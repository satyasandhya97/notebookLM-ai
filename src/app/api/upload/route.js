import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { OpenAIEmbeddings } from "@langchain/openai";
import { QdrantVectorStore } from "@langchain/qdrant";
import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export async function POST(req) {
    try {
        const formData = await req.formData();
        const file = formData.get("file");

        if (!file) {
            return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
        }

        // Save the uploaded file
        const bytes = Buffer.from(await file.arrayBuffer());
        const uploadDir = path.join(process.cwd(), "uploads");
        await fs.mkdir(uploadDir, { recursive: true });
        const filePath = path.join(uploadDir, file.name);
        await fs.writeFile(filePath, bytes);

        // 1. Load PDF
        const loader = new PDFLoader(filePath);
        const docs = await loader.load();

        // 2. Generate embeddings
        const embeddings = new OpenAIEmbeddings({
            openAIApiKey: process.env.OPENAI_API_KEY,
            model: "text-embedding-3-large",
        });

        // 3. Store in Qdrant
        await QdrantVectorStore.fromDocuments(docs, embeddings, {
            url: process.env.QDRANT_URL || "http://localhost:6333",
            collectionName: "langchainjs-testing",
        });

        return NextResponse.json(
            { message: "PDF uploaded and indexed successfully!", chunks: docs.length },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error in PDF upload route:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
