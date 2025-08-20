"use client";

import { FileText } from "lucide-react";

export default function FilePreviewItem({ p, i, removeFile }) {
  return (
    <li
      key={i}
      className="flex items-center gap-3 rounded-xl border border-gray-700 bg-[#1b1b1b] p-3"
    >
      <div className="h-10 w-10 rounded-lg overflow-hidden flex items-center justify-center border border-gray-700">
        {p.isImage && p.url ? (
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
  );
}
