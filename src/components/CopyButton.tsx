"use client";

import { Check, Clipboard, TriangleAlert } from "lucide-react";
import { useEffect, useState } from "react";

type CopyButtonProps = {
  value: string;
  disabled?: boolean;
};

export function CopyButton({ value, disabled = false }: CopyButtonProps) {
  const [status, setStatus] = useCopyStatus();

  async function handleCopy() {
    if (!value || disabled) {
      return;
    }

    try {
      await navigator.clipboard.writeText(value);
      setStatus("copied");
    } catch {
      setStatus("error");
    }
  }

  const isCopied = status === "copied";
  const hasError = status === "error";

  return (
    <button
      type="button"
      className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/[0.06] px-3 text-sm font-semibold text-[#d9e9e4] shadow-sm transition hover:border-[#24f2c3]/35 hover:bg-[#24f2c3]/10 hover:text-[#8fffe4] disabled:cursor-not-allowed disabled:opacity-45"
      onClick={handleCopy}
      disabled={disabled || !value}
      title="Скопировать ответ"
    >
      {isCopied ? <Check size={16} /> : hasError ? <TriangleAlert size={16} /> : <Clipboard size={16} />}
      {isCopied ? "Скопировано" : hasError ? "Ошибка" : "Копировать"}
    </button>
  );
}

function useCopyStatus() {
  const [status, setStatus] = useState<"idle" | "copied" | "error">("idle");

  useEffect(() => {
    if (status === "idle") {
      return;
    }

    const timeoutId = window.setTimeout(() => setStatus("idle"), 1800);

    return () => window.clearTimeout(timeoutId);
  }, [status]);

  return [status, setStatus] as const;
}
