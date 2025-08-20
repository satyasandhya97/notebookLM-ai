import fs from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const uploadDir = path.join(process.cwd(), "uploads");

        await fs.mkdir(uploadDir, { recursive: true });

        const files = await fs.readdir(uploadDir);

        return NextResponse.json({ files }, { status: 200 });
    } catch (error) {
        console.error("Error reading uploads folder:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
