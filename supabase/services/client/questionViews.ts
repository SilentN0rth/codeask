import { supabase } from 'supabase/supabaseClient';

/**
 * Dodaje wyświetlenie pytania do tabeli question_views
 */
export async function trackQuestionView(questionId: string): Promise<boolean> {
  try {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return false;
    }

    const { data: existingView, error: checkError } = await supabase
      .from('question_views')
      .select('id')
      .eq('question_id', questionId)
      .eq('user_id', user.id)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      console.error(
        '❌ Błąd sprawdzania istniejącego wyświetlenia:',
        checkError
      );
      return false;
    }

    if (existingView) {
      return false;
    }

    // Dodaj nowe wyświetlenie
    const { error: insertError } = await supabase
      .from('question_views')
      .insert({
        question_id: questionId,
        user_id: user.id,
      });

    if (insertError) {
      console.error('❌ Błąd dodawania wyświetlenia:', insertError);
      return false;
    }

    // AKTUALIZUJ views_count w tabeli questions
    // Najpierw pobierz aktualny licznik
    const { data: currentQuestion, error: fetchError } = await supabase
      .from('questions')
      .select('views_count')
      .eq('id', questionId)
      .single();

    if (!fetchError && currentQuestion) {
      const { error: updateError } = await supabase
        .from('questions')
        .update({
          views_count: (currentQuestion.views_count || 0) + 1,
          updated_at: new Date().toISOString(),
        })
        .eq('id', questionId);

      if (updateError) {
        console.error('❌ Błąd aktualizacji views_count:', updateError);
      }
    }

    return true;
  } catch (error) {
    console.error('❌ Błąd w trackQuestionView:', error);
    return false;
  }
}

/**
 * Pobiera liczbę wyświetleń pytania z tabeli question_views
 */
export async function getQuestionViewsCount(
  questionId: string
): Promise<number> {
  try {
    const { count, error } = await supabase
      .from('question_views')
      .select('*', { count: 'exact', head: true })
      .eq('question_id', questionId);

    if (error) {
      console.error('❌ Błąd pobierania liczby wyświetleń:', error);
      return 0;
    }

    return count || 0;
  } catch (error) {
    console.error('❌ Błąd w getQuestionViewsCount:', error);
    return 0;
  }
}
