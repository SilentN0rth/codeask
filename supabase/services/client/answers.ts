'use client';

import { supabase } from 'supabase/supabaseClient';
import { VoteType } from '@/types/vote.types';
import { checkAndAwardBadges } from '@/services/server/badges';
import { createActivity } from '@/services/server/activity';
import { updateUserReputation } from '@/services/server/users';

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
            [updateField]: Math.max(0, (answer as any)[updateField] - 1),
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
            [updateField]: (answer as any)[updateField] + 1,
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
      .select('likes_count, dislikes_count, author_id')
      .eq('id', answerId)
      .single();

    if (answerError) {
      console.error('Error fetching updated counts:', answerError.message);
      return { success: false, error: answerError.message };
    }

    // Sprawdź odznaki dla autora odpowiedzi tylko przy polubieniach
    try {
      // Sprawdź odznaki tylko jeśli użytkownik polubił odpowiedź
      const shouldCheckBadges = voteType === 'liked';

      if (shouldCheckBadges) {
        await checkAndAwardBadges(answer.author_id, 'answer_liked');
        await checkAndAwardBadges(user.id, 'daily_active');
      }

      // Utwórz aktywność dla każdego głosowania (like i dislike)
      await createActivity({
        user_id: user.id,
        type: voteType === 'liked' ? 'like' : 'dislike',
        description:
          voteType === 'liked' ? 'Polubił odpowiedź' : 'Nie polubił odpowiedzi',
        timestamp: new Date().toISOString(),
      });

      // Sprawdź aktywność użytkownika (dla odznaki active_user)
      await checkAndAwardBadges(user.id, 'daily_active');

      // Aktualizuj reputację autora odpowiedzi (+1 za polubienie)
      if (voteType === 'liked') {
        await updateUserReputation(answer.author_id, 1);
      }
    } catch (badgeError) {
      console.error('❌ Błąd sprawdzania odznak:', badgeError);
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
