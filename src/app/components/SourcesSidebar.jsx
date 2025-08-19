"use client";

import { motion } from "framer-motion";
import { Plus, Search, Upload } from "lucide-react";

export default function SourcesSidebar({ sources = [], open }) {
    return (
        <aside className="w-100 border border-gray-700 bg-[#181818] rounded-2xl p-4 flex flex-col shadow-lg">
            <h2 className="text-sm font-medium mb-4">Sources</h2>
            <div className="flex gap-2 mb-6">
                <button
                    onClick={open}
                    className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl bg-[#2a2a2a] hover:bg-[#333] transition"
                >
                    <Plus size={16} /> Add
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl bg-[#2a2a2a] hover:bg-[#333] transition">
                    <Search size={16} /> Discover
                </button>
            </div>

            {sources.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col items-center justify-center flex-1 text-center text-gray-400"
                >
                    <Upload size={32} className="mb-2 text-blue-300" />
                    <p className="text-sm">Saved sources will appear here</p>
                    <p className="text-xs mt-1">
                        Click <span className="font-semibold">Add</span> to upload PDFs, text, or files
                    </p>
                </motion.div>
            ) : (
                <ul className="flex flex-col gap-2">
                    {sources.map((src, i) => (
                        <motion.li
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="p-2 rounded-lg bg-[#2a2a2a] hover:bg-[#333] transition shadow-sm"
                        >
                            {src}
                        </motion.li>
                    ))}
                </ul>
            )}
        </aside>
    );
}
