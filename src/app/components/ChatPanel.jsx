"use client";

import { motion } from "framer-motion";
import { Upload } from "lucide-react";
import { Send } from "lucide-react";
import { useState, useRef, useEffect } from "react";

export default function ChatPanel({ open }) {

    const [message, setMessage] = useState("");
    const textareaRef = useRef(null);

    useEffect(() => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = "auto";
            textarea.style.height = textarea.scrollHeight + "px";
        }
    }, [message]);

    const handleSend = () => {
        if (!message.trim()) return;

        const event = new CustomEvent("send-message", { detail: message.trim() });
        window.dispatchEvent(event);

        setMessage("");
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <section className="flex-1 bg-[#181818] rounded-2xl flex flex-col justify-center items-center relative shadow-xl">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="text-center"
            >

                <Upload size={40} className="mx-auto mb-4 bo text-blue-300" />
                <h3 className="text-lg font-semibold">Add a source to get started</h3>
                <button onClick={open} className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-xl transition shadow-md hover:shadow-lg">
                    Upload a source
                </button>
            </motion.div>

            {/* Input box at bottom */}
            <div className="absolute bottom-0 left-0 w-full px-4 pb-4">
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
                        disabled={!message.trim()}
                        className="p-2 rounded-full bg-blue-500 hover:bg-blue-600 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <Send size={20} />
                    </button>
                </div>
            </div>


        </section>
    );
}
