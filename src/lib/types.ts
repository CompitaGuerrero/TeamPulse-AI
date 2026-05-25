import type { ResponseMode } from "@/lib/responseModes";

export type AskRequest = {
  question: string;
  mode: ResponseMode;
};

export type AskSuccessResponse = {
  answer: string;
  mode: ResponseMode;
};

export type AskErrorResponse = {
  error: string;
};

export type AskResponse = AskSuccessResponse | AskErrorResponse;

export type HistoryItem = {
  id: string;
  question: string;
  answer: string;
  mode: ResponseMode;
  createdAt: string;
};

export type RequestState = "idle" | "loading" | "success" | "error";
