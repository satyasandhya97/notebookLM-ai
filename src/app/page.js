"use client";

import { motion } from "framer-motion";
import { useCallback, useMemo, useState } from "react";
import { Plus, Search, Upload, Settings, Share2, Image as ImgIcon, FileText } from "lucide-react";
import Modal from "./components/Modal";
import useQueryModal from "./hooks/useQueryModal";

export default function Home() {
  const [sources, setSources] = useState([]);

  const { isOpen, open, close } = useQueryModal("upload");

  const [files, setFiles] = useState([]);

  const onFiles = useCallback((list) => {
    const arr = Array.from(list || []);
    setFiles((prev) => [...prev, ...arr]);
  }, []);

  const onDrop = useCallback((e) => {
    e.preventDefault();
    onFiles(e.dataTransfer?.files);
  }, [onFiles]);

  const removeFile = (idx) => {
    setFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  const commitFiles = () => {
    if (files.length) {
      setSources((prev) => [...prev, ...files.map((f) => f.name)]);
      setFiles([]);
    }
    close();
  };

  const previews = useMemo(
    () =>
      files.map((f) => {
        const isImage = /^image\//.test(f.type);
        return {
          name: f.name,
          size: f.size,
          type: f.type || "file",
          isImage,
          url: isImage ? URL.createObjectURL(f) : null,
        };
      }),
    [files]
  );

  return (
    <div className="h-screen w-full bg-[#121212] text-gray-100 flex flex-col">
      {/* Top Bar */}
      <header className="flex justify-between items-center px-6 py-3 border-b border-gray-700 bg-[#1e1e1e] shadow-md">
        <h1 className="text-lg font-semibold">NotebookLM AI</h1>
        <div className="flex items-center gap-3">
          <button className="px-3 py-1 bg-[#2a2a2a] rounded-xl flex items-center gap-2 hover:bg-[#333] transition">
            <Share2 size={16} /> Share
          </button>
          <button className="px-3 py-1 bg-[#2a2a2a] rounded-xl flex items-center gap-2 hover:bg-[#333] transition">
            <Settings size={16} /> Settings
          </button>
        </div>
      </header>

      <main className="flex flex-1 gap-4 p-4">
        {/* Sidebar */}
        <aside className="w-80 border border-gray-700 bg-[#181818] rounded-2xl p-4 flex flex-col shadow-lg">
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
              <Upload size={32} className="mb-2" />
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

        {/* Chat Panel */}
        <section className="flex-1 bg-[#181818] rounded-2xl flex flex-col justify-center items-center relative shadow-xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="text-center"
          >
            <Upload size={40} className="mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-semibold">Add a source to get started</h3>
            <button onClick={open} className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-xl transition shadow-md hover:shadow-lg">
              Upload a source
            </button>
          </motion.div>

          {/* Input box at bottom */}
          <div className="absolute bottom-0 w-full border-t border-gray-700 bg-[#1a1a1a] p-4 rounded-b-2xl">
            <input
              type="text"
              placeholder="Upload a source to get started"
              className="w-full px-4 py-2 rounded-xl bg-[#2a2a2a] text-sm text-gray-200 placeholder-gray-500 focus:outline-none"
              disabled
            />
          </div>
        </section>
      </main>

      {/* Upload Modal */}
      <Modal open={isOpen} onClose={close} title="Add sources">
        {/* Dropzone */}
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={onDrop}
          className="rounded-2xl border border-dashed border-gray-700 bg-[#141414] p-6 text-center hover:border-gray-600 transition"
        >
          <div className="flex flex-col items-center gap-2">
            <Upload size={28} className="text-gray-400" />
            <p className="text-sm text-gray-300">
              Drag & drop files here, or
              <label className="ml-1 underline cursor-pointer hover:text-gray-100">
                <input
                  type="file"
                  multiple
                  accept="application/pdf,image/*,text/plain,.md"
                  className="hidden"
                  onChange={(e) => onFiles(e.target.files)}
                />
                browse
              </label>
            </p>
            <p className="text-xs text-gray-500">PNG, JPG, PDF, TXT, MD</p>
          </div>
        </div>

        {/* Previews */}
        {previews.length > 0 && (
          <div className="mt-4 space-y-3">
            <h5 className="text-sm font-medium text-gray-200">Selected files</h5>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {previews.map((p, i) => (
                <li
                  key={i}
                  className="flex items-center gap-3 rounded-xl border border-gray-700 bg-[#1b1b1b] p-3"
                >
                  <div className="h-10 w-10 rounded-lg overflow-hidden flex items-center justify-center border border-gray-700">
                    {p.isImage && p.url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={p.url} alt={p.name} className="h-full w-full object-cover" />
                    ) : (
                      <FileText size={18} className="text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-sm">{p.name}</p>
                    <p className="text-xs text-gray-500">{Math.ceil(p.size / 1024)} KB • {p.type}</p>
                  </div>
                  <button
                    onClick={() => removeFile(i)}
                    className="rounded-lg px-2 py-1 text-xs bg-[#2a2a2a] hover:bg-[#333] transition"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Actions */}
        <div className="mt-6 flex items-center justify-end gap-2">
          <button
            onClick={close}
            className="px-3 py-2 rounded-xl bg-[#2a2a2a] hover:bg-[#333] transition"
          >
            Cancel
          </button>
          <button
            onClick={commitFiles}
            className="px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 transition"
          >
            Add sources
          </button>
        </div>
      </Modal>
    </div>
  );
}
