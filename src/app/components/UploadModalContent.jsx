"use client";

import { Upload, Link, Clipboard , X } from "lucide-react";

export default function UploadModalContent({ onDrop, onFiles, close }) {
 
  return (
    <div className="w-full mx-auto bg-[#1a1a1a] rounded-2xl  p-8 flex flex-col gap-6 text-white">
        {/* Close Button (X) */}
      <button
        onClick={close}
        className="absolute top-4 right-4 p-2 rounded-full bg-[#2a2a2a] hover:bg-[#333] shadow-md transition"
      >
        <X size={18} className="text-gray-300" />
      </button>
      {/* Header */}
        <div>
          <h2 className="text-xl font-semibold">Add sources</h2>
          <p className="text-sm text-gray-400 mt-1">
            Sources let your app base its responses on the information that
            matters most to you. <br />
            (Examples: marketing plans, course reading, research notes,
            transcripts, sales documents, etc.)
          </p>
        </div>

      {/* Upload Zone */}
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={onDrop}
        className="rounded-xl border border-dashed border-gray-600 bg-[#0f0f0f] p-10 text-center hover:border-gray-400 transition"
      >
        <div className="flex flex-col items-center gap-3">
          <div className="p-3 rounded-full bg-[#0c263d]">
            <Upload size={28} className="text-blue-400" />
          </div>
          <p className="text-base font-medium">Upload sources</p>
          <p className="text-sm text-gray-400">
            Drag & drop or{" "}
            <label className="underline cursor-pointer hover:text-blue-500">
              <input
                type="file"
                multiple
                accept="application/pdf,image/*,text/plain,.md,.mp3"
                className="hidden"
                onChange={(e) => onFiles(e.target.files)}
              />
              choose file
            </label>{" "}
            to upload
          </p>
          <p className="text-xs text-gray-500">
            Supported: PDF, TXT, Markdown, Audio (e.g. mp3)
          </p>
        </div>
      </div>

      {/* Bottom Options */}
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-xl bg-[#0f0f0f] p-5 flex flex-col gap-3 shadow">
          <h4 className="text-sm font-medium text-gray-300">Link</h4>
          <button className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#2a2a2a] hover:bg-[#333] text-sm shadow">
            <Link size={16} /> Website
          </button>
          <button className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#2a2a2a] hover:bg-[#333] text-sm shadow">
            <Link size={16} /> YouTube
          </button>
        </div>

        <div className="rounded-xl bg-[#0f0f0f] p-5 flex flex-col gap-3 shadow">
          <h4 className="text-sm font-medium text-gray-300">Paste text</h4>
          <button className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#2a2a2a] hover:bg-[#333] text-sm shadow">
            <Clipboard size={16} /> Copied text
          </button>
        </div>
      </div>

    </div>
  );
}
