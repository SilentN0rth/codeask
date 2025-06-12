// app/api/fetchImage/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const { url } = await req.json();

    if (!url) {
        return NextResponse.json({ success: 0, message: "Missing URL" });
    }

    // Tu można zrobić fetch, zapis do pliku lub po prostu zwrócić URL:
    return NextResponse.json({
        success: 1,
        file: {
            url, // lub przetworzony adres CDN
        },
    });
}
