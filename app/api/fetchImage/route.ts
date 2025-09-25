import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { url } = (await req.json()) as { url: string };

  if (!url) {
    return NextResponse.json({ success: 0, message: 'Missing URL' });
  }

  return NextResponse.json({
    success: 1,
    file: {
      url,
    },
  });
}
