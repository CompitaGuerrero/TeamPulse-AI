"use client";

import { ArrowUpRight, LoaderCircle, SendHorizontal } from "lucide-react";
import type { FormEvent, KeyboardEvent } from "react";

import { ResponseModeToggle } from "@/components/ResponseModeToggle";
import type { ResponseMode } from "@/lib/responseModes";

const EXAMPLES = [
  "Как быстро подготовить запуск лендинга к понедельнику?",
  "Команда не успевает закрыть задачи спринта. Что делать?",
  "Какие риски есть при запуске новой функции без пользовательского тестирования?",
  "Помоги подготовить план обсуждения с заказчиком по редизайну сайта.",
  "Как распределить задачи между дизайнером, разработчиком и менеджером на этой неделе?",
];

type QuestionFormProps = {
  question: string;
  mode: ResponseMode;
  isLoading: boolean;
  onQuestionChange: (value: string) => void;
  onModeChange: (mode: ResponseMode) => void;
  onSubmit: () => void;
};

export function QuestionForm({
  question,
  mode,
  isLoading,
  onQuestionChange,
  onModeChange,
  onSubmit,
}: QuestionFormProps) {
  const trimmedQuestion = question.trim();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
      event.preventDefault();
      onSubmit();
    }
  }

  return (
    <section className="glass-panel rounded-lg p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-[#f4fff9]">Рабочий вопрос</h2>
          <p className="mt-1 text-sm text-[#92a5b4]">
            Опишите рабочую ситуацию, задачу, проблему или запрос на информацию.
          </p>
        </div>
        <span className="hidden rounded-full border border-[#ff5de7]/25 bg-[#ff5de7]/10 px-3 py-1 text-xs font-semibold text-[#ff9ff0] sm:inline-flex">
          structured prompt
        </span>
      </div>

      <ResponseModeToggle value={mode} onChange={onModeChange} disabled={isLoading} />

      <form onSubmit={handleSubmit}>
        <textarea
          className="min-h-36 w-full resize-none rounded-lg border border-white/10 bg-black/25 px-4 py-3 text-sm leading-6 text-[#eef7f3] outline-none transition placeholder:text-[#5e7080] focus:border-[#24f2c3]/70 focus:bg-black/35 focus:ring-4 focus:ring-[#24f2c3]/10 disabled:cursor-not-allowed disabled:opacity-70"
          value={question}
          placeholder="Задайте рабочий вопрос: например, как подготовить запуск проекта к понедельнику?"
          onChange={(event) => onQuestionChange(event.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
          maxLength={1600}
        />

        <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-[#8798a7]">{question.length}/1600 символов</p>
          <button
            type="submit"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-[#f4fff9] px-5 text-sm font-semibold text-[#02040a] shadow-[0_14px_34px_rgba(36,242,195,0.16)] transition hover:bg-[#24f2c3] disabled:cursor-not-allowed disabled:bg-white/20 disabled:text-white/45 disabled:shadow-none"
            disabled={!trimmedQuestion || isLoading}
            title="Отправить вопрос"
          >
            {isLoading ? <LoaderCircle className="animate-spin" size={17} /> : <SendHorizontal size={17} />}
            {isLoading ? "AI думает..." : "Спросить AI"}
          </button>
        </div>
      </form>

      <div className="mt-5">
        <p className="mb-2 text-xs font-semibold text-[#8798a7]">
          Примеры корректных запросов
        </p>
        <div className="flex flex-wrap gap-2">
          {EXAMPLES.map((example) => (
            <button
              key={example}
              type="button"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-left text-xs font-medium text-[#b8c7d2] transition hover:border-[#24f2c3]/35 hover:bg-[#24f2c3]/10 hover:text-[#dffff5] disabled:cursor-not-allowed disabled:opacity-50"
              onClick={() => onQuestionChange(example)}
              disabled={isLoading}
              title="Вставить пример вопроса"
            >
              <ArrowUpRight size={13} />
              {example}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
