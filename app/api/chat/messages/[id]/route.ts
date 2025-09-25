import { NextRequest, NextResponse } from 'next/server';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { deleteMessage } from '@/services/server/chat';
import { MessageInterface } from '@/types/chat.types';

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
  try {
    const supabaseServer = createServerComponentClient({ cookies });
    const {
      data: { session },
      error: sessionError,
    } = await supabaseServer.auth.getSession();

    if (sessionError || !session?.user) {
      return NextResponse.json(
        { error: 'Nieautoryzowany dostęp' },
        { status: 401 }
      );
    }

    const { data: message, error: messageError } = (await supabaseServer
      .from('messages')
      .select('*')
      .eq('id', params.id)
      .single()) as { data: MessageInterface | null; error: unknown };

    if (messageError || !message) {
      return NextResponse.json(
        { error: 'Wiadomość nie została znaleziona' },
        { status: 404 }
      );
    }

    if (message.sender_id !== session.user.id) {
      return NextResponse.json(
        { error: 'Możesz usuwać tylko swoje wiadomości' },
        { status: 403 }
      );
    }

    const success = await deleteMessage(params.id);

    if (!success) {
      return NextResponse.json(
        { error: 'Nie udało się usunąć wiadomości' },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: 'Wiadomość została usunięta' });
  } catch {
    return NextResponse.json({ error: 'Błąd serwera' }, { status: 500 });
  }
}
