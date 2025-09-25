'use server';
/* eslint-disable camelcase */
import { supabase } from 'supabase/supabaseClient';
import { createActivity } from './activity';
import { checkAndAwardBadges } from './badges';
import { BADGE_DEFINITIONS } from '@/types/badges.types';
import { updateUserReputation } from './users';
import { VoteType } from '@/types/vote.types';

export interface VoteAnswerParams {
  answerId: string;
  voteType: VoteType;
}

export interface VoteResult {
  success: boolean;
  error?: string;
  newLikesCount?: number;
  newDislikesCount?: number;
}

export async function addAnswer({
  content,
  questionId,
  authorId,
}: {
  content: string;
  questionId: string;
  authorId: string;
}) {
  // 1. Dodanie odpowiedzi
  const { data: answerData, error: answerError } = await supabase
    .from('answers')
    .insert([
      {
        content,
        question_id: questionId,
        author_id: authorId,
        likes_count: 0,
        dislikes_count: 0,
      },
    ])
    .select()
    .single();

  if (answerError) throw answerError;
  const { data: question, error: fetchQuestionError } = await supabase
    .from('questions')
    .select('answers_count, author_id')
    .eq('id', questionId)
    .single();

  if (!fetchQuestionError) {
    const { error: questionUpdateError } = await supabase
      .from('questions')
      .update({ answers_count: (question?.answers_count || 0) + 1 })
      .eq('id', questionId);
    if (questionUpdateError) {
      console.error(
        'Błąd aktualizacji liczby odpowiedzi w pytaniu:',
        questionUpdateError.message
      );
    }
  } else {
    console.error('Błąd pobierania pytania:', fetchQuestionError.message);
  }

  // 3. Aktualizacja liczby odpowiedzi użytkownika
  const { data: user, error: fetchUserError } = await supabase
    .from('users')
    .select('answers_count')
    .eq('id', authorId)
    .single();

  if (!fetchUserError) {
    const { error: userUpdateError } = await supabase
      .from('users')
      .update({
        answers_count: (user?.answers_count || 0) + 1,
        updated_at: new Date().toISOString(),
      })
      .eq('id', authorId);

    if (userUpdateError) {
      console.error(
        'Błąd aktualizacji liczby odpowiedzi użytkownika:',
        userUpdateError.message
      );
    }
  } else {
    console.error('Błąd pobierania użytkownika:', fetchUserError.message);
  }

  // 4. Aktywność
  try {
    await createActivity({
      user_id: authorId,
      type: 'answer',
      description: 'Udzielił odpowiedzi na pytanie.',
      timestamp: new Date().toISOString(),
    });
  } catch (activityError) {
    console.warn(
      'Błąd dodawania aktywności (nie przerywa działania):',
      activityError
    );
  }

  // 5. Sprawdź i przyznaj odznaki dla autora odpowiedzi
  try {
    await checkAndAwardBadges(authorId, 'answer_created');

    // Dodaj reputację za stworzenie odpowiedzi (+3)
    await updateUserReputation(authorId, 3);
  } catch (badgeError) {
    console.error('Błąd sprawdzania odznak dla autora odpowiedzi:', badgeError);
  }

  // 6. Sprawdź odznakę popular_question dla autora pytania
  try {
    if (question?.author_id) {
      // Pobierz aktualne odznaki autora pytania
      const { data: questionAuthor, error: authorError } = await supabase
        .from('users')
        .select('badges')
        .eq('id', question.author_id)
        .single();

      if (!authorError && questionAuthor) {
        const currentBadges = questionAuthor.badges || {};

        // Sprawdź czy autor pytania już ma odznakę popular_question
        if (!currentBadges.popular_question) {
          // Sprawdź czy pytanie ma wystarczająco odpowiedzi
          const popularQuestionDef = BADGE_DEFINITIONS.popular_question;
          const requiredAnswers = popularQuestionDef.requirements.value || 0;

          // +1 bo właśnie dodaliśmy odpowiedź

          if (question.answers_count + 1 >= requiredAnswers) {
            // Przyznaj odznakę
            const updatedBadges = {
              ...currentBadges,
              popular_question: true,
            };

            const { error: updateError } = await supabase
              .from('users')
              .update({ badges: updatedBadges })
              .eq('id', question.author_id);

            if (updateError) {
              console.error('Błąd aktualizacji odznak:', updateError);
            }
          }
        }
      }
    }
  } catch (badgeError) {
    console.error('Błąd sprawdzania odznaki popular_question:', badgeError);
  }

  return answerData;
}

export async function updateAnswer({
  id,
  content,
}: {
  id: string;
  content: string;
}) {
  // 1. Pobierz aktualną odpowiedź, by znać obecną wartość updates_count
  const { data: existingAnswer, error: fetchError } = await supabase
    .from('answers')
    .select('updates_count')
    .eq('id', id)
    .single();

  if (fetchError) throw fetchError;

  const newUpdatesCount = (existingAnswer?.updates_count || 0) + 1;

  // 2. Aktualizacja odpowiedzi
  const { data: answerData, error: answerError } = await supabase
    .from('answers')
    .update({
      content,
      updated_at: new Date(),
      updates_count: newUpdatesCount,
    })
    .eq('id', id)
    .select()
    .single();

  if (answerError) throw answerError;

  return answerData;
}

export async function deleteAnswer(
  id: string,
  questionId: string
): Promise<boolean> {
  // 1. Usuń odpowiedź
  const { error: deleteError } = await supabase
    .from('answers')
    .delete()
    .eq('id', id);

  if (deleteError) {
    console.error('deleteAnswer error:', deleteError.message);
    return false;
  }

  // 2. Zmniejsz licznik odpowiedzi w pytaniu o 1
  // Najpierw pobierz aktualną wartość
  const { data: question, error: fetchQuestionError } = await supabase
    .from('questions')
    .select('answers_count')
    .eq('id', questionId)
    .single();

  if (fetchQuestionError) {
    console.error('fetchQuestionError:', fetchQuestionError.message);
    return false;
  }

  const newCount = Math.max(0, (question?.answers_count || 1) - 1);

  const { error: updateQuestionError } = await supabase
    .from('questions')
    .update({ answers_count: newCount })
    .eq('id', questionId);

  if (updateQuestionError) {
    console.error('updateQuestionError:', updateQuestionError.message);
    return false;
  }

  return true;
}

export async function voteAnswer({
  answerId,
  voteType,
}: VoteAnswerParams): Promise<VoteResult> {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Użytkownik nie jest zalogowany' };
    }

    // Check if user already voted on this answer
    const { data: existingVote, error: fetchError } = await supabase
      .from('answer_votes')
      .select('vote_type')
      .eq('answer_id', answerId)
      .eq('user_id', user.id)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('Error fetching existing vote:', fetchError.message);
      return { success: false, error: fetchError.message };
    }

    const currentVote = existingVote?.vote_type;

    // Handle vote logic
    if (voteType === null) {
      // Remove vote
      if (currentVote) {
        const { error: deleteError } = await supabase
          .from('answer_votes')
          .delete()
          .eq('answer_id', answerId)
          .eq('user_id', user.id);

        if (deleteError) {
          console.error('Error deleting vote:', deleteError.message);
          return { success: false, error: deleteError.message };
        }

        // Update answer counts
        const updateField =
          currentVote === 'liked' ? 'likes_count' : 'dislikes_count';

        // Get current count
        const { data: answer, error: answerError } = await supabase
          .from('answers')
          .select(updateField)
          .eq('id', answerId)
          .single();

        if (answerError) {
          console.error('Error fetching answer count:', answerError.message);
          return { success: false, error: answerError.message };
        }

        // Update count
        const { error: updateError } = await supabase
          .from('answers')
          .update({
            [updateField]: Math.max(
              0,
              updateField === 'likes_count'
                ? (answer as { likes_count: number }).likes_count - 1
                : (answer as { dislikes_count: number }).dislikes_count - 1
            ),
          })
          .eq('id', answerId);

        if (updateError) {
          console.error('Error updating answer count:', updateError.message);
          return { success: false, error: updateError.message };
        }
      }
    } else {
      // Add or update vote
      if (currentVote) {
        // Update existing vote
        const { error: updateError } = await supabase
          .from('answer_votes')
          .update({
            vote_type: voteType,
            updated_at: new Date().toISOString(),
          })
          .eq('answer_id', answerId)
          .eq('user_id', user.id);

        if (updateError) {
          console.error('Error updating vote:', updateError.message);
          return { success: false, error: updateError.message };
        }

        // Update answer counts - decrement old vote, increment new vote
        if (currentVote !== voteType) {
          const oldField =
            currentVote === 'liked' ? 'likes_count' : 'dislikes_count';
          const newField =
            voteType === 'liked' ? 'likes_count' : 'dislikes_count';

          // Get current counts
          const { data: answer, error: answerError } = await supabase
            .from('answers')
            .select('likes_count, dislikes_count')
            .eq('id', answerId)
            .single();

          if (answerError) {
            console.error('Error fetching answer counts:', answerError.message);
            return { success: false, error: answerError.message };
          }

          // Update counts
          const { error: updateCountsError } = await supabase
            .from('answers')
            .update({
              [oldField]: Math.max(0, answer[oldField] - 1),
              [newField]: answer[newField] + 1,
            })
            .eq('id', answerId);

          if (updateCountsError) {
            console.error(
              'Error updating vote counts:',
              updateCountsError.message
            );
            return { success: false, error: updateCountsError.message };
          }
        }
      } else {
        // Insert new vote
        const { error: insertError } = await supabase
          .from('answer_votes')
          .insert({
            answer_id: answerId,
            user_id: user.id,
            vote_type: voteType,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          });

        if (insertError) {
          console.error('Error inserting vote:', insertError.message);
          return { success: false, error: insertError.message };
        }

        // Update answer count
        const updateField =
          voteType === 'liked' ? 'likes_count' : 'dislikes_count';

        // Get current count
        const { data: answer, error: answerError } = await supabase
          .from('answers')
          .select(updateField)
          .eq('id', answerId)
          .single();

        if (answerError) {
          console.error('Error fetching answer count:', answerError.message);
          return { success: false, error: answerError.message };
        }

        // Update count
        const { error: updateError } = await supabase
          .from('answers')
          .update({
            [updateField]: (answer as Record<string, number>)[updateField] + 1,
          })
          .eq('id', answerId);

        if (updateError) {
          console.error('Error updating answer count:', updateError.message);
          return { success: false, error: updateError.message };
        }
      }
    }

    // Get updated counts
    const { data: answer, error: answerError } = await supabase
      .from('answers')
      .select('likes_count, dislikes_count')
      .eq('id', answerId)
      .single();

    if (answerError) {
      console.error('Error fetching updated counts:', answerError.message);
      return { success: false, error: answerError.message };
    }

    return {
      success: true,
      newLikesCount: answer.likes_count,
      newDislikesCount: answer.dislikes_count,
    };
  } catch (error) {
    console.error('voteAnswer exception:', error);
    return { success: false, error: 'Wystąpił nieoczekiwany błąd' };
  }
}

export async function getUserVoteForAnswer(
  answerId: string
): Promise<VoteType> {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return null;
    }

    const { data: vote, error } = await supabase
      .from('answer_votes')
      .select('vote_type')
      .eq('answer_id', answerId)
      .eq('user_id', user.id)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching user vote:', error.message);
      return null;
    }

    return vote?.vote_type || null;
  } catch (error) {
    console.error('getUserVoteForAnswer exception:', error);
    return null;
  }
}
