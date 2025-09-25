import { useEffect, useState } from 'react';
import { supabase } from 'supabase/supabaseClient';
import { QuestionCardProps } from '@/types/questions.types';

/**
 * Hook do real-time updates liczników wyświetleń pytań
 */
export function useQuestionViewsRealtime(questions: QuestionCardProps[]) {
  const [updatedQuestions, setUpdatedQuestions] =
    useState<QuestionCardProps[]>(questions);

  useEffect(() => {
    setUpdatedQuestions(questions);
  }, [questions]);

  useEffect(() => {
    const channel1 = supabase
      .channel('question_views_insert')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'question_views',
        },
        (payload) => {
          const newView = payload.new as {
            question_id: string;
            user_id: string;
          };

          setUpdatedQuestions((prev) =>
            prev.map((question) =>
              question.id === newView.question_id
                ? { ...question, views_count: question.views_count + 1 }
                : question
            )
          );
        }
      )
      .subscribe();

    const channel2 = supabase
      .channel('questions_views_update')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'questions',
          filter: 'views_count=neq.null',
        },
        (payload) => {
          const updatedQuestion = payload.new as {
            id: string;
            views_count: number;
          };

          setUpdatedQuestions((prev) =>
            prev.map((question) =>
              question.id === updatedQuestion.id
                ? { ...question, views_count: updatedQuestion.views_count }
                : question
            )
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel1);
      supabase.removeChannel(channel2);
    };
  }, []);

  return updatedQuestions;
}

/**
 * Hook do real-time updates dla pojedynczego pytania
 */
export function useSingleQuestionViewsRealtime(question: QuestionCardProps) {
  const [updatedQuestion, setUpdatedQuestion] =
    useState<QuestionCardProps>(question);

  useEffect(() => {
    setUpdatedQuestion(question);
  }, [question]);

  useEffect(() => {
    const channel = supabase
      .channel(`question_views_${question.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'question_views',
          filter: `question_id=eq.${question.id}`,
        },
        (payload) => {
          setUpdatedQuestion((prev) => ({
            ...prev,
            views_count: prev.views_count + 1,
          }));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [question.id]);

  return updatedQuestion;
}
