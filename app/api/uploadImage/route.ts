// app/api/uploadImage/route.ts
import { NextRequest, NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";

export async function POST(req: NextRequest) {
    const formData = await req.formData();
    const file = formData.get("image") as File;

    if (!file) {
        return NextResponse.json({ success: 0, message: "No file uploaded" });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filename = Date.now() + "-" + file.name;

    const filepath = path.join(process.cwd(), "public/uploads", filename);
    await writeFile(filepath, buffer);

    return NextResponse.json({
        success: 1,
        file: {
            url: `/uploads/${filename}`,
        },
    });
}
