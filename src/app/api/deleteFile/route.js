import fs from "fs";
import path from "path";

export async function DELETE(req) {
    try {
        const { fileName } = await req.json();

        if (!fileName) {
            return new Response(
                JSON.stringify({ error: "fileName is required" }),
                { status: 400 }
            );
        }

        const uploadsDir = path.join(process.cwd(), "public", "uploads");
        const filePath = path.join(uploadsDir, fileName);

        if (!fs.existsSync(filePath)) {
            return new Response(
                JSON.stringify({ error: "File not found" }),
                { status: 404 }
            );
        }

        fs.unlinkSync(filePath);

        return new Response(
            JSON.stringify({ message: "File deleted successfully", fileName }),
            { status: 200 }
        );
    } catch (err) {
        console.error("Error deleting file:", err);
        return new Response(
            JSON.stringify({ error: "Failed to delete file" }),
            { status: 500 }
        );
    }
}
