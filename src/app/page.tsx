"use client";

import { Activity, BadgeCheck, ShieldCheck, Sparkles } from "lucide-react";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";

import { AnswerCard } from "@/components/AnswerCard";
import { HistoryList } from "@/components/HistoryList";
import { QuestionForm } from "@/components/QuestionForm";
import { DEFAULT_RESPONSE_MODE, type ResponseMode } from "@/lib/responseModes";
import { createHistoryId } from "@/lib/utils";
import {
  clearHistory,
  loadHistory,
  prependHistoryItem,
  removeHistoryItem,
  saveHistory,
} from "@/lib/storage";
import type { AskResponse, HistoryItem, RequestState } from "@/lib/types";

const DEFAULT_ERROR =
  "Не удалось получить ответ. Проверьте подключение, API-ключ или попробуйте ещё раз.";

export default function Home() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState("");
  const [mode, setMode] = useState<ResponseMode>(DEFAULT_RESPONSE_MODE);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [requestState, setRequestState] = useState<RequestState>("idle");

  useEffect(() => {
    setHistory(loadHistory());
  }, []);

  async function handleSubmit() {
    const trimmedQuestion = question.trim();

    if (requestState === "loading") {
      return;
    }

    if (!trimmedQuestion) {
      setError("Введите рабочий вопрос для TeamPulse AI.");
      setRequestState("error");
      return;
    }

    setRequestState("loading");
    setError("");
    setAnswer("");

    try {
      const response = await fetch("/api/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question: trimmedQuestion, mode }),
      });

      const data = (await response.json().catch(() => ({}))) as AskResponse;

      if (!response.ok || "error" in data) {
        throw new Error("error" in data ? data.error : DEFAULT_ERROR);
      }

      const nextAnswer = data.answer.trim();
      const nextItem: HistoryItem = {
        id: createHistoryId(),
        question: trimmedQuestion,
        answer: nextAnswer,
        mode: data.mode,
        createdAt: new Date().toISOString(),
      };
      const nextHistory = prependHistoryItem(history, nextItem);

      setAnswer(nextAnswer);
      setHistory(nextHistory);
      saveHistory(nextHistory);
      setRequestState("success");
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : DEFAULT_ERROR);
      setRequestState("error");
    }
  }

  function handleHistorySelect(item: HistoryItem) {
    setQuestion(item.question);
    setAnswer(item.answer);
    setMode(item.mode);
    setError("");
    setRequestState("success");
  }

  function handleHistoryDelete(id: string) {
    const nextHistory = removeHistoryItem(history, id);

    setHistory(nextHistory);
    saveHistory(nextHistory);
  }

  function handleHistoryClear() {
    const nextHistory = clearHistory();

    setHistory(nextHistory);
    saveHistory(nextHistory);
  }

  const isLoading = requestState === "loading";

  return (
    <main className="dashboard-shell relative min-h-screen overflow-hidden text-[#eef7f3]">
      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <header className="glass-panel rounded-lg px-5 py-5">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#24f2c3]/25 bg-[#24f2c3]/10 px-3 py-1 text-xs font-semibold text-[#8fffe4]">
                <Activity size={14} />
                Team decision assistant
              </div>
              <h1 className="text-3xl font-bold text-[#f4fff9] sm:text-4xl">
                TeamPulse AI
              </h1>
              <p className="mt-2 max-w-2xl text-base leading-7 text-[#9fb3c3]">
                Мини-дашборд для быстрых командных решений через AI
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 lg:w-[520px]">
              <Metric icon={<Sparkles size={17} />} label="Фокус" value="выводы" />
              <Metric icon={<ShieldCheck size={17} />} label="Контроль" value="риски" />
              <Metric icon={<BadgeCheck size={17} />} label="Финиш" value="действия" />
            </div>
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px] xl:grid-cols-[390px_minmax(0,1fr)_320px]">
          <QuestionForm
            question={question}
            mode={mode}
            isLoading={isLoading}
            onQuestionChange={setQuestion}
            onModeChange={setMode}
            onSubmit={handleSubmit}
          />
          <AnswerCard answer={answer} error={error} isLoading={isLoading} mode={mode} />
          <div className="lg:sticky lg:top-6 lg:self-start">
            <HistoryList
              items={history}
              onSelect={handleHistorySelect}
              onDelete={handleHistoryDelete}
              onClear={handleHistoryClear}
            />
          </div>
        </div>

        <footer className="flex flex-col gap-2 border-t border-white/10 py-5 text-xs text-[#8c9dab] sm:flex-row sm:items-center sm:justify-between">
          <span>Powered by structured team prompt</span>
          <span>API key lives only on the server route</span>
        </footer>
      </div>
    </main>
  );
}

type MetricProps = {
  icon: ReactNode;
  label: string;
  value: string;
};

function Metric({ icon, label, value }: MetricProps) {
  return (
    <div className="glass-panel-soft flex min-h-20 items-center gap-3 rounded-lg px-4 py-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-[#ff5de7]/25 bg-[#ff5de7]/10 text-[#ff9ff0]">
        {icon}
      </div>
      <div>
        <p className="text-xs font-medium text-[#92a5b4]">{label}</p>
        <p className="text-sm font-bold text-[#f4fff9]">{value}</p>
      </div>
    </div>
  );
}
