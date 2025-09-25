import { NextRequest, NextResponse } from 'next/server';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import {
  getConversationById,
  deleteConversation,
} from '@/services/server/chat';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
  try {
    const supabase = createServerComponentClient({ cookies });
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError || !session?.user) {
      return NextResponse.json(
        { error: 'Nieautoryzowany dostęp' },
        { status: 401 }
      );
    }

    const conversation = await getConversationById(params.id);

    if (!conversation) {
      return NextResponse.json(
        { error: 'Konwersacja nie została znaleziona' },
        { status: 404 }
      );
    }

    if (
      conversation.user1_id !== session.user.id &&
      conversation.user2_id !== session.user.id
    ) {
      return NextResponse.json(
        { error: 'Brak dostępu do tej konwersacji' },
        { status: 403 }
      );
    }

    return NextResponse.json({ conversation });
  } catch {
    return NextResponse.json({ error: 'Błąd serwera' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
  try {
    const supabase = createServerComponentClient({ cookies });
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError || !session?.user) {
      return NextResponse.json(
        { error: 'Nieautoryzowany dostęp' },
        { status: 401 }
      );
    }

    const conversation = await getConversationById(params.id);

    if (!conversation) {
      return NextResponse.json(
        { error: 'Konwersacja nie została znaleziona' },
        { status: 404 }
      );
    }

    if (
      conversation.user1_id !== session.user.id &&
      conversation.user2_id !== session.user.id
    ) {
      return NextResponse.json(
        { error: 'Brak dostępu do tej konwersacji' },
        { status: 403 }
      );
    }

    const success = await deleteConversation(params.id);

    if (!success) {
      return NextResponse.json(
        { error: 'Nie udało się usunąć konwersacji' },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: 'Konwersacja została usunięta' });
  } catch {
    return NextResponse.json({ error: 'Błąd serwera' }, { status: 500 });
  }
}
