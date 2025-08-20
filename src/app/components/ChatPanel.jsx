"use client";

import { motion } from "framer-motion";
import { Upload, Send } from "lucide-react";
import { useState, useRef, useEffect } from "react";

export default function ChatPanel({ open, selectedFile }) {
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const textareaRef = useRef(null);
    const scrollRef = useRef(null);

    useEffect(() => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = "auto";
            textarea.style.height = textarea.scrollHeight + "px";
        }
    }, [message]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async () => {
        if (!message.trim()) return;

        const userMsg = { role: "user", content: message.trim() };
        setMessages((prev) => [...prev, userMsg]);
        setMessage("");
        setLoading(true);

        try {
            const res = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    user_query: userMsg.content,
                    file_name: selectedFile ? selectedFile.name : "ALL_FILES"
                }),
            });

            const data = await res.json();
            const aiMsg = {
                role: "assistant",
                content: data.reply || "No response available.",
            };

            setMessages((prev) => [...prev, aiMsg]);
        } catch (err) {
            setMessages((prev) => [
                ...prev,
                { role: "assistant", content: "⚠️ Error fetching response." },
            ]);
        } finally {
            setLoading(false);
        }
    };


    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <section className="flex-1 bg-[#181818] rounded-2xl flex flex-col relative shadow-xl overflow-hidden">

            {/* Chat Header */}
            <div className="px-4 py-3 border-b border-gray-700 bg-[#1f1f1f] flex items-center justify-between">
                <h2 className="text-sm font-medium text-gray-100">
                    Chat {selectedFile ? `– ${selectedFile.name}` : ""}
                </h2>
                <button
                    onClick={open}
                    className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm transition"
                >
                    Add Source
                </button>
            </div>


            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-4 space-y-3 scroll-smooth max-h-[calc(100vh-160px)]"
            >
                {messages.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                        className="text-center mt-50"
                    >
                        <Upload size={40} className="mx-auto mb-4 text-blue-300" />
                        <h3 className="text-lg font-semibold">Add a source to get started</h3>
                        <button
                            onClick={open}
                            className="mt-4 px-4 py-2 bg-gray-800 hover:bg-blue-700 rounded-xl transition shadow-md hover:shadow-lg"
                        >
                            Upload a source
                        </button>
                    </motion.div>
                )}
                {messages.map((msg, idx) => (
                    <div
                        key={idx}
                        className={`p-3 rounded-xl whitespace-pre-wrap leading-relaxed 
                           ${msg.role === "user"
                                ? "bg-gray-700 text-white self-end ml-auto"
                                : "bg-gray-600 text-gray-100 self-start"
                            } min-w-[20%] max-w-[60%]`}
                    >
                        {msg.content}
                    </div>
                ))}

                {loading && (
                    <div className="flex items-center gap-2">
                        <span className="dot w-2 h-2 bg-blue-400 rounded-full"></span>
                        <span className="dot w-2 h-2 bg-pink-400 rounded-full"></span>
                        <span className="dot w-2 h-2 bg-gray-400 rounded-full"></span>
                    </div>
                )}
            </div>

            {/* Input box */}
            <div className="px-4 pb-4">
                <div className="flex items-center gap-2 rounded-full border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-md px-4 py-2">
                    <textarea
                        ref={textareaRef}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Type your message..."
                        className="flex-1 resize-none bg-transparent outline-none text-gray-900 dark:text-gray-100 placeholder-gray-400"
                        rows={1}
                    />
                    <button
                        onClick={handleSend}
                        disabled={!message.trim() || loading}
                        className="p-2 rounded-full bg-blue-500 hover:bg-blue-600 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <Send size={20} />
                    </button>
                </div>
            </div>
        </section>
    );
}
