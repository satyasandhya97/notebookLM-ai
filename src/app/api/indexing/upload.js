import formidable from "formidable";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { OpenAIEmbeddings } from "@langchain/openai";
import { QdrantVectorStore } from "@langchain/qdrant";

export const config = {
    api: {
        bodyParser: false, // disable bodyParser for file upload
    },
};

export async function POST(req) {
    try {
        // Parse file upload
        const form = formidable({ multiples: false, uploadDir: "./uploads", keepExtensions: true });

        const data = await new Promise((resolve, reject) => {
            form.parse(req, (err, fields, files) => {
                if (err) reject(err);
                resolve({ fields, files });
            });
        });

        const file = data.files.file;
        if (!file) {
            return new Response(JSON.stringify({ error: "No file uploaded" }), { status: 400 });
        }

        const filePath = file.filepath || file.path;

        // 1. Load PDF with LangChain PDFLoader
        const loader = new PDFLoader(filePath);
        const docs = await loader.load();

        // 2. Generate embeddings
        const embeddings = new OpenAIEmbeddings({
            openAIApiKey: process.env.OPENAI_API_KEY,
            model: "text-embedding-3-large",
        });

        // 3. Store into Qdrant
        await QdrantVectorStore.fromDocuments(docs, embeddings, {
            url: process.env.QDRANT_URL || "http://localhost:6333",
            collectionName: "langchainjs-testing",
        });

        return new Response(
            JSON.stringify({
                message: "PDF uploaded and indexed successfully!",
                chunks: docs.length,
            }),
            { status: 200 }
        );
    } catch (error) {
        console.error("Error in PDF upload route:", error);
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}
