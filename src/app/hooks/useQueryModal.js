"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function useQueryModal(name = "upload") {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const isOpen = params.get("modal") === name;

  const open = () => {
    const sp = new URLSearchParams(params);
    sp.set("modal", name);
    router.push(`${pathname}?${sp.toString()}`, { scroll: false });
  };

  const close = () => {
    const sp = new URLSearchParams(params);
    sp.delete("modal");
    const next = sp.toString();
    router.push(next ? `${pathname}?${next}` : pathname, { scroll: false });
  };

  return { isOpen, open, close };
}
