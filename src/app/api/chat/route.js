import { OpenAIEmbeddings } from "@langchain/openai";
import { QdrantVectorStore } from "@langchain/qdrant";
import { OpenAI } from "openai";
import { QdrantClient } from "@qdrant/js-client-rest";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });


export async function POST(req) {
    try {
        const { user_query, file_name } = await req.json();

        if (!user_query) {
            return new Response(
                JSON.stringify({ error: "No query provided" }),
                { status: 400 }
            );
        }
        const qdrantClient = new QdrantClient({
            url: process.env.QDRANT_URL ||
                "https://fc945ef7-d03a-4eb5-823c-45dd43612cca.us-east4-0.gcp.cloud.qdrant.io:6333",
            apiKey: process.env.QDRANT_API_KEY,
        });
        const embedding = new OpenAIEmbeddings({ model: "text-embedding-3-large" });

        const vectorstore = await QdrantVectorStore.fromExistingCollection(
            embedding,
            {
                client: qdrantClient,
                collectionName: "langchainjs-testing",
            }
        );

        let retriever;

        if (file_name && file_name !== "ALL_FILES") {
            retriever = vectorstore.asRetriever({
                filter: {
                    must: [{ key: "source", match: { value: file_name } }],
                },
            });
        } else {
            retriever = vectorstore.asRetriever();
        }

        const relevantDocs = await retriever.invoke(user_query);

        const system_prompt = `
        You are an AI assistant who helps resolve user queries based only on the content 
        from the selected file(s).
        Only answer based on the available content.
        Context: ${JSON.stringify(relevantDocs)}
        `;

        const response = await client.chat.completions.create({
            model: "gpt-4.1",
            messages: [
                { role: "system", content: system_prompt },
                { role: "user", content: user_query },
            ],
        });

        const reply = response.choices[0].message.content;

        return new Response(
            JSON.stringify({ reply, docs: relevantDocs }),
            { status: 200 }
        );
    } catch (err) {
        console.error(err);
        return new Response(JSON.stringify({ error: err.message }), {
            status: 500,
        });
    }
}
