/* eslint-disable camelcase */
import { supabase } from 'supabase/supabaseClient';
import {
  generateUniqueSlug,
  generateUniqueSlugForUpdate,
} from '@/lib/utils/generateSlug';
import {
  checkSlugExists,
  checkSlugExistsForUpdate,
} from '@/services/server/questions';
import { createActivity } from '@/services/server/activity';
import { checkAndAwardBadges } from '@/services/server/badges';
import { updateUserReputation } from '@/services/server/users';
import { QuestionCardProps } from '@/types/questions.types';
import { highlightCodeInHTML } from '@/lib/utils/codeHighlighter';

type CreateQuestionProps = {
  title: string;
  content: string;
  short_content: string;
  tags: string[];
  authorId: string;
};

export async function createQuestion({
  title,
  content,
  short_content,
  tags,
  authorId,
}: CreateQuestionProps) {
  // Styluj kod w treści przed zapisaniem
  const highlightedContent = await highlightCodeInHTML(content);

  // Generuj unikalny slug
  const questionSlug = await generateUniqueSlug(title, checkSlugExists);

  const { data: questionData, error: questionError } = await supabase
    .from('questions')
    .insert([
      {
        title,
        content: highlightedContent,
        short_content,
        author_id: authorId,
        question_slug: questionSlug,
      },
    ])
    .select()
    .single();

  if (questionError) throw questionError;

  const questionId = questionData.id;

  // 3. Przetwórz tagi — upewnij się, że istnieją, albo je dodaj
  const tagIds: string[] = [];

  for (const tagName of tags) {
    const trimmed = tagName.trim().toLowerCase();

    // a) Sprawdź, czy tag już istnieje
    const { data: existingTag, error: tagSelectError } = await supabase
      .from('tags')
      .select('id, question_count')
      .eq('name', trimmed)
      .single();

    if (tagSelectError && tagSelectError.code !== 'PGRST116')
      throw tagSelectError;

    let tagId: string;

    if (existingTag) {
      tagId = existingTag.id;

      // Zwiększ licznik question_count
      await supabase
        .from('tags')
        .update({ question_count: existingTag.question_count + 1 })
        .eq('id', tagId);
    } else {
      // b) Stwórz nowy tag
      const { data: newTag, error: tagInsertError } = await supabase
        .from('tags')
        .insert([{ name: trimmed, question_count: 1 }])
        .select()
        .single();

      if (tagInsertError) throw tagInsertError;

      tagId = newTag.id;
    }

    tagIds.push(tagId);
  }

  const tagLinks = tagIds.map((tagId) => ({
    question_id: questionId,
    tag_id: tagId,
  }));

  const { error: linkError } = await supabase
    .from('question_tags')
    .insert(tagLinks);
  if (linkError) throw linkError;

  const { data: user, error: fetchUserError } = await supabase
    .from('users')
    .select('questions_count')
    .eq('id', authorId)
    .single();

  if (!fetchUserError) {
    const { error: userUpdateError } = await supabase
      .from('users')
      .update({
        questions_count: (user?.questions_count || 0) + 1,
        updated_at: new Date().toISOString(),
      })
      .eq('id', authorId);

    if (userUpdateError) {
      console.error(
        'Błąd aktualizacji liczby pytań użytkownika:',
        userUpdateError.message
      );
    }
  } else {
    console.error('Błąd pobierania użytkownika:', fetchUserError.message);
  }

  try {
    await createActivity({
      user_id: authorId,
      type: 'question',
      description: `Zadał pytanie: "${title}"`,
      timestamp: new Date().toISOString(),
    });
  } catch (activityError) {
    console.error('Błąd dodawania aktywności:', activityError);
  }

  try {
    await checkAndAwardBadges(authorId, 'question_created');

    await updateUserReputation(authorId, 2);
  } catch (badgeError) {
    console.error('Błąd sprawdzania odznak:', badgeError);
  }

  return questionData;
}

export async function refreshQuestion(
  questionId: string,
  setQuestion: (question: QuestionCardProps) => void
) {
  if (!questionId) return;

  const { data, error } = await supabase
    .from('questions')
    .select(
      `
        *,
            author:author_id (
                *
            ),
            tags:question_tags (
                tags (*)
            ),
            answers (
                *
            )`
    )
    .eq('id', questionId)
    .single();

  if (error) {
    throw new Error('Nie udało się odświeżyć pytania.');
  } else {
    const { count: viewsCount } = await supabase
      .from('question_views')
      .select('*', { count: 'exact', head: true })
      .eq('question_id', questionId);

    const formattedQuestion = {
      ...data,
      views_count: viewsCount || 0,
      tags: data.tags?.map((tagRelation: any) => tagRelation.tags) || [],
    };
    setQuestion(formattedQuestion);
  }
}

export async function getQuestionsByTag(
  tagId: string,
  limit: number = 3
): Promise<{
  questions: QuestionCardProps[];
  error: any;
}> {
  try {
    const { data: questionTags, error: questionTagsError } = await supabase
      .from('question_tags')
      .select('question_id')
      .eq('tag_id', tagId);

    if (questionTagsError) throw questionTagsError;

    if (!questionTags || questionTags.length === 0) {
      return { questions: [], error: null };
    }

    const questionIds = questionTags.map((qt) => qt.question_id);

    const { data, error } = await supabase
      .from('questions')
      .select(
        `
        *,
        author:author_id (*),
        tags:question_tags (
          tags (*)
        )
      `
      )
      .in('id', questionIds)
      .order('likes_count', { ascending: false })
      .order('views_count', { ascending: false })
      .order('answers_count', { ascending: false })
      .limit(limit);

    if (error) throw error;

    const formattedQuestions = (data || []).map((question) => ({
      ...question,
      tags: question.tags?.map((tagRelation: any) => tagRelation.tags) || [],
    }));

    return {
      questions: formattedQuestions as QuestionCardProps[],
      error: null,
    };
  } catch (error) {
    console.error('getQuestionsByTag error:', error);
    return { questions: [], error };
  }
}

type UpdateQuestionProps = {
  id: string;
  title: string;
  content: string;
  short_content: string;
  tags: string[];
  authorId: string;
};

export async function updateQuestion({
  id,
  title,
  content,
  short_content,
  tags,
  authorId,
}: UpdateQuestionProps) {
  try {
    // Styluj kod w treści przed zapisaniem
    const highlightedContent = await highlightCodeInHTML(content);

    const { updateQuestion: serverUpdateQuestion } = await import(
      '@/services/server/questions'
    );
    return await serverUpdateQuestion({
      id,
      title,
      content: highlightedContent,
      short_content,
      tags,
      authorId,
    });
  } catch (error) {
    console.error('Update question error:', error);
    throw new Error('Nie udało się zaktualizować pytania');
  }
}

export async function archiveQuestion(
  questionId: string,
  userId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('is_moderator')
      .eq('id', userId)
      .single();

    if (userError) {
      console.error('archiveQuestion user check error:', userError.message);
      return {
        success: false,
        error: 'Nie udało się sprawdzić uprawnień użytkownika',
      };
    }

    if (!userData.is_moderator) {
      return {
        success: false,
        error: 'Tylko moderatorzy mogą archiwizować pytania',
      };
    }

    const { error } = await supabase
      .from('questions')
      .update({ status: 'archived' })
      .eq('id', questionId);

    if (error) {
      console.error('archiveQuestion error:', error.message);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('archiveQuestion exception:', error);
    return { success: false, error: 'Wystąpił nieoczekiwany błąd' };
  }
}

export async function unarchiveQuestion(
  questionId: string,
  userId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('is_moderator')
      .eq('id', userId)
      .single();

    if (userError) {
      console.error('unarchiveQuestion user check error:', userError.message);
      return {
        success: false,
        error: 'Nie udało się sprawdzić uprawnień użytkownika',
      };
    }

    if (!userData.is_moderator) {
      return {
        success: false,
        error: 'Tylko moderatorzy mogą cofać archiwizację pytań',
      };
    }

    const { error } = await supabase
      .from('questions')
      .update({ status: 'opened' })
      .eq('id', questionId);

    if (error) {
      console.error('unarchiveQuestion error:', error.message);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('unarchiveQuestion exception:', error);
    return { success: false, error: 'Wystąpił nieoczekiwany błąd' };
  }
}

export async function closeQuestion(
  questionId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('questions')
      .update({ status: 'closed' })
      .eq('id', questionId);

    if (error) {
      console.error('closeQuestion error:', error.message);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('closeQuestion exception:', error);
    return { success: false, error: 'Wystąpił nieoczekiwany błąd' };
  }
}

export async function reopenQuestion(
  questionId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('questions')
      .update({ status: 'opened' })
      .eq('id', questionId);

    if (error) {
      console.error('reopenQuestion error:', error.message);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('reopenQuestion exception:', error);
    return { success: false, error: 'Wystąpił nieoczekiwany błąd' };
  }
}

export async function deleteQuestion(
  questionId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Użytkownik nie jest zalogowany' };
    }

    const { deleteQuestionAction } = await import(
      '@/services/server/questions'
    );

    const result = await deleteQuestionAction(questionId, user.id);

    return result;
  } catch (error) {
    console.error('deleteQuestion exception:', error);
    return { success: false, error: 'Wystąpił nieoczekiwany błąd' };
  }
}

import { VoteType } from '@/types/vote.types';

export interface VoteQuestionParams {
  questionId: string;
  voteType: VoteType;
}

export interface VoteResult {
  success: boolean;
  error?: string;
  newLikesCount?: number;
  newDislikesCount?: number;
}

export async function voteQuestion({
  questionId,
  voteType,
}: VoteQuestionParams): Promise<VoteResult> {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Użytkownik nie jest zalogowany' };
    }

    const { data: existingVote, error: fetchError } = await supabase
      .from('question_votes')
      .select('vote_type')
      .eq('question_id', questionId)
      .eq('user_id', user.id)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('Error fetching existing vote:', fetchError.message);
      return { success: false, error: fetchError.message };
    }

    const currentVote = existingVote?.vote_type;

    if (voteType === null) {
      if (currentVote) {
        const { error: deleteError } = await supabase
          .from('question_votes')
          .delete()
          .eq('question_id', questionId)
          .eq('user_id', user.id);

        if (deleteError) {
          console.error('Error deleting vote:', deleteError.message);
          return { success: false, error: deleteError.message };
        }

        const updateField =
          currentVote === 'liked' ? 'likes_count' : 'unlikes_count';

        const { data: question, error: questionError } = await supabase
          .from('questions')
          .select(updateField)
          .eq('id', questionId)
          .single();

        if (questionError) {
          console.error(
            'Error fetching question count:',
            questionError.message
          );
          return { success: false, error: questionError.message };
        }

        const { error: updateError } = await supabase
          .from('questions')
          .update({
            [updateField]: Math.max(0, (question as any)[updateField] - 1),
          })
          .eq('id', questionId);

        if (updateError) {
          console.error('Error updating question count:', updateError.message);
          return { success: false, error: updateError.message };
        }
      }
    } else {
      if (currentVote) {
        const { error: updateError } = await supabase
          .from('question_votes')
          .update({
            vote_type: voteType,
            updated_at: new Date().toISOString(),
          })
          .eq('question_id', questionId)
          .eq('user_id', user.id);

        if (updateError) {
          console.error('Error updating vote:', updateError.message);
          return { success: false, error: updateError.message };
        }

        if (currentVote !== voteType) {
          const oldField =
            currentVote === 'liked' ? 'likes_count' : 'unlikes_count';
          const newField =
            voteType === 'liked' ? 'likes_count' : 'unlikes_count';

          const { data: question, error: questionError } = await supabase
            .from('questions')
            .select('likes_count, unlikes_count')
            .eq('id', questionId)
            .single();

          if (questionError) {
            console.error(
              'Error fetching question counts:',
              questionError.message
            );
            return { success: false, error: questionError.message };
          }

          const { error: updateCountsError } = await supabase
            .from('questions')
            .update({
              [oldField]: Math.max(0, question[oldField] - 1),
              [newField]: question[newField] + 1,
            })
            .eq('id', questionId);

          if (updateCountsError) {
            console.error(
              'Error updating vote counts:',
              updateCountsError.message
            );
            return { success: false, error: updateCountsError.message };
          }
        }
      } else {
        const { error: insertError } = await supabase
          .from('question_votes')
          .insert({
            question_id: questionId,
            user_id: user.id,
            vote_type: voteType,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          });

        if (insertError) {
          console.error('Error inserting vote:', insertError.message);
          return { success: false, error: insertError.message };
        }

        const updateField =
          voteType === 'liked' ? 'likes_count' : 'unlikes_count';

        const { data: question, error: questionError } = await supabase
          .from('questions')
          .select(updateField)
          .eq('id', questionId)
          .single();

        if (questionError) {
          console.error(
            'Error fetching question count:',
            questionError.message
          );
          return { success: false, error: questionError.message };
        }

        const { error: updateError } = await supabase
          .from('questions')
          .update({
            [updateField]: (question as any)[updateField] + 1,
          })
          .eq('id', questionId);

        if (updateError) {
          console.error('Error updating question count:', updateError.message);
          return { success: false, error: updateError.message };
        }
      }
    }

    const { data: question, error: questionError } = await supabase
      .from('questions')
      .select('likes_count, unlikes_count, author_id')
      .eq('id', questionId)
      .single();

    if (questionError) {
      console.error('Error fetching updated counts:', questionError.message);
      return { success: false, error: questionError.message };
    }

    try {
      const shouldCheckBadges = voteType === 'liked';

      if (shouldCheckBadges) {
        await checkAndAwardBadges(question.author_id, 'answer_liked');
        await checkAndAwardBadges(user.id, 'daily_active');
      }

      await createActivity({
        user_id: user.id,
        type: voteType === 'liked' ? 'like' : 'dislike',
        description:
          voteType === 'liked' ? 'Polubił pytanie' : 'Nie polubił pytania',
        timestamp: new Date().toISOString(),
      });

      await checkAndAwardBadges(user.id, 'daily_active');

      if (voteType === 'liked') {
        await updateUserReputation(question.author_id, 1);
      }
    } catch (badgeError) {
      console.error('❌ Błąd sprawdzania odznak:', badgeError);
    }

    return {
      success: true,
      newLikesCount: question.likes_count,
      newDislikesCount: question.unlikes_count,
    };
  } catch (error) {
    console.error('voteQuestion exception:', error);
    return { success: false, error: 'Wystąpił nieoczekiwany błąd' };
  }
}

export async function getUserVoteForQuestion(
  questionId: string
): Promise<VoteType> {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return null;
    }

    const { data: vote, error } = await supabase
      .from('question_votes')
      .select('vote_type')
      .eq('question_id', questionId)
      .eq('user_id', user.id)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching user vote:', error.message);
      return null;
    }

    return vote?.vote_type || null;
  } catch (error) {
    console.error('getUserVoteForQuestion exception:', error);
    return null;
  }
}
