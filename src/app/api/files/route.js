import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export async function GET() {
    try {
        const uploadDir = path.join(process.cwd(), "public", "uploads");

        // Ensure uploads folder exists
        await fs.mkdir(uploadDir, { recursive: true });

        // List files
        const files = await fs.readdir(uploadDir);

        return NextResponse.json({ files });
    } catch (err) {
        console.error("Error listing files:", err);
        return NextResponse.json({ error: "Failed to fetch files" }, { status: 500 });
    }
}
