"use client";

import { Clock3, RotateCcw, Trash2 } from "lucide-react";

import type { HistoryItem } from "@/lib/types";
import { getResponseModeLabel } from "@/lib/responseModes";
import { formatDateTime } from "@/lib/utils";

type HistoryListProps = {
  items: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
  onDelete: (id: string) => void;
  onClear: () => void;
};

export function HistoryList({ items, onSelect, onDelete, onClear }: HistoryListProps) {
  return (
    <aside className="glass-panel rounded-lg p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-[#f4fff9]">История</h2>
          <p className="mt-1 text-sm text-[#92a5b4]">Последние 5 запросов</p>
        </div>
        <Clock3 className="shrink-0 text-[#8fffe4]" size={20} />
      </div>

      {items.length === 0 ? (
        <div className="rounded-lg border border-dashed border-white/15 bg-white/[0.04] px-4 py-8 text-center text-sm leading-6 text-[#92a5b4]">
          История появится после первых запросов.
        </div>
      ) : (
        <div>
          <button
            type="button"
            className="mb-3 inline-flex h-9 w-full items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-3 text-sm font-semibold text-[#b8c7d2] transition hover:border-[#ff5de7]/40 hover:bg-[#ff5de7]/10 hover:text-[#ffd9f8]"
            onClick={onClear}
            title="Очистить всю историю"
            aria-label="Очистить всю историю"
          >
            <Trash2 size={15} />
            Очистить историю
          </button>

          <div className="space-y-3">
            {items.map((item) => (
              <article
                key={item.id}
                className="group rounded-lg border border-white/10 bg-white/[0.04] p-3 transition hover:border-[#24f2c3]/35 hover:bg-[#24f2c3]/10"
              >
                <div className="flex items-start justify-between gap-3">
                  <button
                    type="button"
                    className="min-w-0 flex-1 text-left"
                    onClick={() => onSelect(item)}
                    title="Открыть запрос из истории"
                    aria-label="Открыть запрос из истории"
                  >
                    <p className="history-question text-sm font-semibold leading-5 text-[#edf9f5]">
                      {item.question}
                    </p>
                  </button>
                  <div className="flex shrink-0 items-center gap-1">
                    <button
                      type="button"
                      className="flex h-8 w-8 items-center justify-center rounded-md text-[#627486] transition hover:bg-[#24f2c3]/10 hover:text-[#24f2c3]"
                      onClick={() => onSelect(item)}
                      title="Открыть запрос из истории"
                    >
                      <RotateCcw size={15} />
                    </button>
                    <button
                      type="button"
                      className="flex h-8 w-8 items-center justify-center rounded-md text-[#627486] transition hover:bg-[#ff5de7]/10 hover:text-[#ff9ff0]"
                      onClick={() => onDelete(item.id)}
                      title="Удалить запись из истории"
                      aria-label="Удалить запись из истории"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
                <button
                  type="button"
                  className="mt-2 block w-full text-left"
                  onClick={() => onSelect(item)}
                  title="Открыть запрос из истории"
                >
                  <p className="history-answer text-xs leading-5 text-[#91a3b2]">
                    {item.answer}
                  </p>
                </button>
                <div className="mt-3 flex items-center justify-between gap-2">
                  <span className="rounded-full border border-[#24f2c3]/20 bg-[#24f2c3]/10 px-2 py-1 text-xs font-semibold text-[#8fffe4]">
                    {getResponseModeLabel(item.mode)}
                  </span>
                  <p className="text-xs font-medium text-[#627486]">
                    {formatDateTime(item.createdAt)}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      )}
    </aside>
  );
}
