"use client";

import { LoaderCircle, Sparkles } from "lucide-react";

import { CopyButton } from "@/components/CopyButton";
import { EmptyState } from "@/components/EmptyState";
import { ErrorMessage } from "@/components/ErrorMessage";
import { getResponseModeLabel, type ResponseMode } from "@/lib/responseModes";

type AnswerCardProps = {
  answer: string;
  error: string;
  isLoading: boolean;
  mode: ResponseMode;
};

export function AnswerCard({ answer, error, isLoading, mode }: AnswerCardProps) {
  if (isLoading) {
    return (
      <section className="glass-panel rounded-lg p-5">
        <div className="flex min-h-72 flex-col items-center justify-center text-center">
          <LoaderCircle className="mb-4 animate-spin text-[#24f2c3]" size={34} />
          <h2 className="text-base font-semibold text-[#f4fff9]">AI собирает ответ</h2>
          <p className="mt-2 max-w-md text-sm leading-6 text-[#92a5b4]">
            TeamPulse анализирует вопрос, выделяет риски и формирует следующие действия.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="glass-panel rounded-lg p-5">
      <div className="mb-4 flex flex-col gap-3 border-b border-white/10 pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-md border border-[#24f2c3]/25 bg-[#24f2c3]/10 text-[#8fffe4]">
            <Sparkles size={19} />
          </div>
          <div>
            <h2 className="text-base font-semibold text-[#f4fff9]">Ответ TeamPulse AI</h2>
            <p className="text-sm text-[#92a5b4]">
              Режим: {getResponseModeLabel(mode)}
            </p>
          </div>
        </div>
        <CopyButton value={answer} disabled={!answer || Boolean(error)} />
      </div>

      {error ? <ErrorMessage message={error} /> : null}

      {!error && !answer ? (
        <EmptyState
          title="Задайте вопрос"
          description="Задайте вопрос — AI соберёт краткий вывод, риски и следующие действия."
        />
      ) : null}

      {!error && answer ? (
        <div className="space-y-4">
          {parseAnswer(answer).map((block, index) => {
            if (block.kind === "heading") {
              return (
                <div
                  key={`${block.content}-${index}`}
                  className="mt-5 flex items-center gap-2 first:mt-0"
                >
                  <span className="h-2 w-2 rounded-full bg-[#24f2c3]" />
                  <h3 className="text-sm font-bold uppercase text-[#f4fff9]">
                    {block.content}
                  </h3>
                </div>
              );
            }

            if (block.kind === "list") {
              return (
                <ul
                  key={`${block.items.join("-")}-${index}`}
                  className="space-y-2 rounded-lg border border-white/10 bg-white/[0.04] px-4 py-3 text-sm leading-6 text-[#c7d5df]"
                >
                  {block.items.map((item) => (
                    <li key={item} className="flex gap-2">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#ff5de7]" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              );
            }

            return (
              <p key={`${block.content}-${index}`} className="text-sm leading-7 text-[#c7d5df]">
                {block.content}
              </p>
            );
          })}
        </div>
      ) : null}
    </section>
  );
}

type ParsedBlock =
  | { kind: "heading"; content: string }
  | { kind: "paragraph"; content: string }
  | { kind: "list"; items: string[] };

function parseAnswer(answer: string): ParsedBlock[] {
  const lines = answer
    .split(/\r?\n/)
    .map((line) => cleanMarkdown(line.trim()))
    .filter(Boolean);

  const blocks: ParsedBlock[] = [];
  let listItems: string[] = [];

  function flushList() {
    if (listItems.length > 0) {
      blocks.push({ kind: "list", items: listItems });
      listItems = [];
    }
  }

  for (const line of lines) {
    const bulletMatch = line.match(/^([-*]|\d+\.)\s+(.+)/);

    if (bulletMatch) {
      listItems.push(bulletMatch[2]);
      continue;
    }

    flushList();

    if (isHeading(line)) {
      blocks.push({ kind: "heading", content: line.replace(/:$/, "") });
    } else {
      blocks.push({ kind: "paragraph", content: line });
    }
  }

  flushList();

  return blocks;
}

function cleanMarkdown(value: string): string {
  return value.replace(/^#+\s*/, "").replace(/\*\*/g, "").replace(/`/g, "");
}

function isHeading(value: string): boolean {
  const normalized = value.toLowerCase().replace(/:$/, "");
  const knownHeadings = [
    "краткий вывод",
    "разбор",
    "анализ",
    "риски / ограничения",
    "риски и ограничения",
    "ограничения",
    "следующие действия",
    "что нужно уточнить",
    "что сделать сегодня",
    "что сделать дальше",
    "ответственные / входные данные",
    "ответственные",
    "входные данные",
    "риски / контрольные точки",
    "риски и контрольные точки",
    "summary",
    "analysis",
    "risks / limitations",
    "next steps",
  ];

  return knownHeadings.includes(normalized) || (value.endsWith(":") && value.length < 48);
}
