import { OpenAIEmbeddings } from "@langchain/openai";
import { QdrantVectorStore } from "@langchain/qdrant";
import { OpenAI } from "openai";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// A helper to clean and format retrieved docs for the prompt
function formatDocs(docs) {
    return docs
        .map((doc, idx) => `Chunk ${idx + 1} (Page/Source: ${doc.metadata?.page || doc.metadata?.source || "N/A"}):\n${doc.pageContent}`)
        .join("\n\n");
}

export async function POST(req) {
    try {
        const { user_query } = await req.json();
        if (!user_query) {
            return new Response(JSON.stringify({ error: "No query provided" }), { status: 400 });
        }

        // Initialize embeddings
        const embedding = new OpenAIEmbeddings({ model: "text-embedding-3-large" });

        // Connect to existing Qdrant collection (can contain PDFs, text files, URLs)
        const vectorstore = await QdrantVectorStore.fromExistingCollection(embedding, {
            url: process.env.QDRANT_URL || "http://localhost:6333",
            collectionName: "dynamic-content",
        });

        // Use vector store as a retriever
        const retriever = vectorstore.asRetriever({ k: 5 }); // fetch top 5 relevant chunks

        // Retrieve relevant chunks
        const relevantDocs = await retriever.getRelevantDocuments(user_query);

        // Format retrieved content dynamically
        const contextText = formatDocs(relevantDocs);

        // Build clear and structured dynamic system prompt
        const system_prompt = `
                            You are a helpful AI assistant. Your task is to answer the user's questions
                            strictly based on the content provided below. Do NOT provide answers
                            that are not present in the given content.

                            Content provided (from PDFs, text files, or website URLs):
                            -----------------------------------------------------------
                            ${contextText}
                            -----------------------------------------------------------

                            Instructions:
                            1. Only use the information in the content above to answer.
                            2. Include references such as page numbers or source names if available.
                            3. Be concise, accurate, and relevant to the user's query.
                            4. If the answer is not present in the content, reply: "The requested information is not available in the provided content."
                            `;


        // Call OpenAI chat API
        const response = await client.chat.completions.create({
            model: "gpt-4.1",
            messages: [
                { role: "system", content: system_prompt },
                { role: "user", content: user_query },
            ],
        });

        return new Response(JSON.stringify({ result: response.choices[0].message.content }), { status: 200 });
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}
