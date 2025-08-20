"use client";

import { useCallback, useMemo, useState } from "react";
import { Twitter, Linkedin } from "lucide-react";

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

  const removeFile = useCallback((idx) => {
    setFiles((prev) => prev.filter((_, i) => i !== idx));
  }, []);

  const commitFiles = async () => {
    if (!files.length) return;

    try {
      for (const f of files) {
        const formData = new FormData();
        formData.append("file", f);

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) {
          const errBody = await res.json().catch(() => ({ error: "unknown" }));
          console.error("Upload failed for", f.name, errBody);
          continue;
        }

        const json = await res.json().catch(() => ({}));
        console.log("Upload success:", f.name, json);

        setSources((prev) => [...prev, f.name]);
      }

      setFiles([]);
      close();
    } catch (err) {
      console.error("Error uploading files:", err);
    }
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
          <a
            href="https://x.com/Satyasandhya__"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 bg-[#2a2a2a] rounded-full hover:bg-[#333] transition"
          >
            <Twitter size={20} className="text-blue-300" />
          </a>
          <a
            href="https://www.linkedin.com/in/satyasandhya-biswal-b48bb61b5/"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 bg-[#2a2a2a] rounded-full hover:bg-[#333] transition"
          >
            <Linkedin size={20} className="text-blue-300" />
          </a>
        </div>

      </header>

      <main className="flex flex-1 gap-4 p-4">
        <SourcesSidebar sources={sources} setSources={setSources} open={open} />
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
