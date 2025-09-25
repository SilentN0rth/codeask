import { NextRequest, NextResponse } from 'next/server';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import {
  getUserConversations,
  createConversation,
  getConversationsWithLastMessages,
} from '@/services/server/chat';
import { CreateConversationRequest } from '@/types/chat.types';

export async function GET(request: NextRequest) {
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

    const { searchParams } = new URL(request.url);
    const withMessages = searchParams.get('withMessages') === 'true';

    let conversations;
    if (withMessages) {
      conversations = await getConversationsWithLastMessages(session.user.id);
    } else {
      conversations = await getUserConversations(session.user.id);
    }

    return NextResponse.json({ conversations });
  } catch {
    return NextResponse.json({ error: 'Błąd serwera' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
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

    const body = (await request.json()) as CreateConversationRequest;

    if (
      body.user1_id !== session.user.id &&
      body.user2_id !== session.user.id
    ) {
      return NextResponse.json(
        { error: 'Nie możesz tworzyć konwersacji dla innych użytkowników' },
        { status: 403 }
      );
    }

    const conversation = await createConversation(body);

    if (!conversation) {
      return NextResponse.json(
        { error: 'Nie udało się utworzyć konwersacji' },
        { status: 500 }
      );
    }

    return NextResponse.json({ conversation });
  } catch {
    return NextResponse.json({ error: 'Błąd serwera' }, { status: 500 });
  }
}
