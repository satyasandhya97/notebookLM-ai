"use client";

import { Upload, Link, Clipboard, X, Trash2 } from "lucide-react";
import { useState } from "react";

export default function UploadModalContent({
    onDrop,
    onFiles,
    previews = [],
    removeFile,
    commitFiles,
    close,
    files = [],
}) {
    const [uploading, setUploading] = useState(false);
    const [statusMessage, setStatusMessage] = useState("");

    const handleDrop = (e) => {
        e.preventDefault();
        onDrop?.(e);
    };

    const handleSelectFiles = (e) => {
        onFiles?.(e.target.files);
    };

    const handleCommit = async () => {
        if (!files.length) return;
        setUploading(true);
        setStatusMessage("Uploading...");
        try {
            // commitFiles is defined in Home and returns a promise
            await commitFiles();
            setStatusMessage("✅ Uploaded successfully");
        } catch (err) {
            console.error(err);
            setStatusMessage("❌ Upload failed: " + (err?.message || "unknown"));
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="w-full mx-auto bg-[#1a1a1a] rounded-2xl p-6 flex flex-col gap-4 text-white relative">
            <button
                onClick={close}
                className="absolute top-4 right-4 p-2 rounded-full bg-[#2a2a2a] hover:bg-[#333] shadow-md transition"
                aria-label="Close"
            >
                <X size={18} className="text-gray-300" />
            </button>

            <div>
                <h2 className="text-xl font-semibold">Add sources</h2>
                <p className="text-sm text-gray-400 mt-1">
                    Upload PDFs to index them into the DB and use them with the chat.
                </p>
            </div>

            <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                className="rounded-xl border border-dashed border-gray-600 bg-[#0f0f0f] p-6 text-center hover:border-gray-400 transition"
            >
                <div className="flex flex-col items-center gap-3">
                    <div className="p-3 rounded-full bg-[#0c263d]">
                        <Upload size={28} className="text-blue-400" />
                    </div>
                    <p className="text-base font-medium">{uploading ? "Uploading..." : "Upload sources"}</p>
                    <p className="text-sm text-gray-400">
                        Drag & drop or{" "}
                        <label className="underline cursor-pointer hover:text-blue-500">
                            <input
                                type="file"
                                multiple
                                accept="application/pdf"
                                className="hidden"
                                onChange={handleSelectFiles}
                            />
                            choose file
                        </label>{" "}
                        to upload
                    </p>
                    <p className="text-xs text-gray-500">Supported: PDF</p>
                </div>
            </div>

            {/* previews */}
            <div>
                {previews.length > 0 ? (
                    <div className="space-y-2">
                        {previews.map((p, idx) => (
                            <div key={idx} className="flex items-center justify-between gap-2 p-2 rounded-lg bg-[#151515]">
                                <div className="flex items-center gap-3">
                                    {p.isImage && p.url ? (
                                        <img src={p.url} alt={p.name} className="w-10 h-10 rounded-md object-cover" />
                                    ) : (
                                        <div className="w-10 h-10 flex items-center justify-center rounded-md bg-[#222] text-xs">
                                            FILE
                                        </div>
                                    )}
                                    <div className="text-sm truncate max-w-[220px]" title={p.name}>
                                        {p.name}
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => removeFile(idx)}
                                        className="p-2 rounded hover:bg-[#2a2a2a]"
                                        title="Remove"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                        <div className="flex gap-2 mt-2">
                            <button
                                onClick={handleCommit}
                                disabled={uploading}
                                className="flex-1 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-60"
                            >
                                {uploading ? "Uploading..." : "Upload"}
                            </button>
                            <button
                                onClick={() => {
                                    setStatusMessage("");
                                    setUploading(false);
                                }}
                                className="px-4 py-2 rounded-xl bg-[#2a2a2a] hover:bg-[#333]"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                ) : (
                    <p className="text-gray-400 text-sm">No files selected yet</p>
                )}
            </div>

            {statusMessage && (
                <p className={`text-sm mt-2 ${statusMessage.startsWith("✅") ? "text-green-400" : statusMessage.startsWith("❌") ? "text-red-400" : "text-gray-300"}`}>
                    {statusMessage}
                </p>
            )}

            {/* Bottom options unchanged */}
            <div className="grid grid-cols-2 gap-4 mt-2">
                <div className="rounded-xl bg-[#0f0f0f] p-4 flex flex-col gap-3 shadow">
                    <h4 className="text-sm font-medium text-gray-300">Link</h4>
                    <button className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#2a2a2a] hover:bg-[#333] text-sm shadow">
                        <Link size={16} /> Website
                    </button>
                    <button className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#2a2a2a] hover:bg-[#333] text-sm shadow">
                        <Link size={16} /> YouTube
                    </button>
                </div>

                <div className="rounded-xl bg-[#0f0f0f] p-4 flex flex-col gap-3 shadow">
                    <h4 className="text-sm font-medium text-gray-300">Paste text</h4>
                    <button className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#2a2a2a] hover:bg-[#333] text-sm shadow">
                        <Clipboard size={16} /> Copied text
                    </button>
                </div>
            </div>
        </div>
    );
}
