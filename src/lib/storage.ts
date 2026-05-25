import { DEFAULT_RESPONSE_MODE, isResponseMode } from "@/lib/responseModes";
import type { HistoryItem } from "@/lib/types";

const HISTORY_KEY = "teampulse-ai-history";
const HISTORY_LIMIT = 5;

export function loadHistory(): HistoryItem[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const rawHistory = window.localStorage.getItem(HISTORY_KEY);

    if (!rawHistory) {
      return [];
    }

    const parsed = JSON.parse(rawHistory);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed
      .map(normalizeHistoryItem)
      .filter((item): item is HistoryItem => Boolean(item))
      .slice(0, HISTORY_LIMIT);
  } catch {
    return [];
  }
}

export function saveHistory(items: HistoryItem[]): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(
      HISTORY_KEY,
      JSON.stringify(items.slice(0, HISTORY_LIMIT)),
    );
  } catch {
    // localStorage can be unavailable in private mode or strict browser settings.
  }
}

export function prependHistoryItem(
  items: HistoryItem[],
  item: HistoryItem,
): HistoryItem[] {
  return [item, ...items.filter((entry) => entry.id !== item.id)].slice(
    0,
    HISTORY_LIMIT,
  );
}

export function removeHistoryItem(items: HistoryItem[], id: string): HistoryItem[] {
  return items.filter((item) => item.id !== id);
}

export function clearHistory(): HistoryItem[] {
  return [];
}

function normalizeHistoryItem(value: unknown): HistoryItem | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const item = value as Record<string, unknown>;

  if (
    typeof item.id === "string" &&
    typeof item.question === "string" &&
    typeof item.answer === "string" &&
    typeof item.createdAt === "string"
  ) {
    return {
      id: item.id,
      question: item.question,
      answer: item.answer,
      mode: isResponseMode(item.mode) ? item.mode : DEFAULT_RESPONSE_MODE,
      createdAt: item.createdAt,
    };
  }

  return null;
}
