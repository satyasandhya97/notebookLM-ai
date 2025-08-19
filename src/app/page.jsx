"use client";

import { useCallback, useMemo, useState } from "react";
import { Plus, Search, Upload, Settings, Share2 } from "lucide-react";

import Modal from "./components/Modal";
import useQueryModal from "./hooks/useQueryModal";
import SourcesSidebar from "./components/SourcesSidebar";
import ChatPanel from "./components/ChatPanel";
import UploadModalContent from "./components/UploadModalContent";

export default function Home() {
  const [sources, setSources] = useState([]);

  const { isOpen, open, close } = useQueryModal("upload");

  const [files, setFiles] = useState([]);

  const onFiles = useCallback((list) => {
    const arr = Array.from(list || []);
    setFiles((prev) => [...prev, ...arr]);
  }, []);

  const onDrop = useCallback(
    (e) => {
      e.preventDefault();
      onFiles(e.dataTransfer?.files);
    },
    [onFiles]
  );

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
    <div className="h-screen w-full bg-[#474646] text-gray-100 flex flex-col">
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
        <SourcesSidebar sources={sources} open={open} />
        <ChatPanel open={open} />
      </main>

      {/* Upload Modal */}
      <Modal open={isOpen} onClose={close}>
        <UploadModalContent
          onDrop={onDrop}
          onFiles={onFiles}
          previews={previews}
          removeFile={removeFile}
          commitFiles={commitFiles}
          close={close}
          files={files}
        />
      </Modal>
    </div>
  );
}
