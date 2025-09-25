import { NextRequest, NextResponse } from 'next/server';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import {
  getConversationMessages,
  sendMessage,
  getConversationById,
} from '@/services/server/chat';
import { SendMessageRequest } from '@/types/chat.types';

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

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') ?? '50');
    const offset = parseInt(searchParams.get('offset') ?? '0');

    const messages = await getConversationMessages(params.id, limit, offset);

    return NextResponse.json({ messages });
  } catch {
    return NextResponse.json({ error: 'Błąd serwera' }, { status: 500 });
  }
}

export async function POST(
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

    const body = (await request.json()) as { content: string };
    const messageRequest: SendMessageRequest = {
      conversation_id: params.id,
      sender_id: session.user.id,
      content: body.content,
    };

    if (!messageRequest.content || messageRequest.content.trim().length === 0) {
      return NextResponse.json(
        { error: 'Treść wiadomości nie może być pusta' },
        { status: 400 }
      );
    }

    const message = await sendMessage(messageRequest);

    if (!message) {
      return NextResponse.json(
        { error: 'Nie udało się wysłać wiadomości' },
        { status: 500 }
      );
    }

    return NextResponse.json({ message });
  } catch {
    return NextResponse.json({ error: 'Błąd serwera' }, { status: 500 });
  }
}
