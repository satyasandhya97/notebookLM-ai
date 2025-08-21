import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { CSVLoader } from "@langchain/community/document_loaders/fs/csv";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { OpenAIEmbeddings } from "@langchain/openai";
import { QdrantVectorStore } from "@langchain/qdrant";
import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { QdrantClient } from "@qdrant/js-client-rest";

export async function POST(req) {
    try {
        const formData = await req.formData();
        const file = formData.get("file");

        if (!file) {
            return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
        }

        const bytes = Buffer.from(await file.arrayBuffer());
        const uploadDir = path.join(process.cwd(), "public", "uploads");
        await fs.mkdir(uploadDir, { recursive: true });
        const filePath = path.join(uploadDir, file.name);
        await fs.writeFile(filePath, bytes);

        const ext = path.extname(file.name).toLowerCase();
        let loader;

        if (ext === ".pdf") {
            loader = new PDFLoader(filePath);
        } else if (ext === ".csv") {
            loader = new CSVLoader(filePath, { separator: "," });
        } else if (ext === ".txt") {
            loader = new TextLoader(filePath);
        } else {
            return NextResponse.json(
                { error: "Unsupported file type. Only PDF, CSV, and TXT are allowed." },
                { status: 400 }
            );
        }

        const docs = await loader.load();

        const embeddings = new OpenAIEmbeddings({
            openAIApiKey: process.env.OPENAI_API_KEY,
            model: "text-embedding-3-large",
        });

        const qdrantClient = new QdrantClient({
            url: process.env.QDRANT_URL ||
                "https://fc945ef7-d03a-4eb5-823c-45dd43612cca.us-east4-0.gcp.cloud.qdrant.io:6333" || 'http://localhost:6333/',
            apiKey: process.env.QDRANT_API_KEY,
        });

        await QdrantVectorStore.fromDocuments(docs, embeddings, {
            client: qdrantClient,
            collectionName: "langchainjs-testing",
            metadata: { source: file.name },
        });

        return NextResponse.json(
            {
                message: `${file.name} uploaded and indexed successfully!`,
                url: `/uploads/${file.name}`,
                chunks: docs.length,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error in upload route:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
