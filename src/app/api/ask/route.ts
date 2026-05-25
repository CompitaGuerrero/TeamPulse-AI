import { NextRequest, NextResponse } from "next/server";

import { buildTeamPulseSystemPrompt } from "@/lib/aiPrompt";
import { hasClearWorkIntent, UNCLEAR_INPUT_ANSWER } from "@/lib/inputClarity";
import { DEFAULT_RESPONSE_MODE, isResponseMode } from "@/lib/responseModes";
import type { AskErrorResponse, AskRequest, AskSuccessResponse } from "@/lib/types";

const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";
const REQUEST_TIMEOUT_MS = 30000;

export async function POST(request: NextRequest) {
  let body: AskRequest;

  try {
    body = (await request.json()) as AskRequest;
  } catch {
    return jsonError("Некорректный формат запроса.", 400);
  }

  const question = body.question?.trim();
  const mode = isResponseMode(body.mode) ? body.mode : DEFAULT_RESPONSE_MODE;

  if (!question) {
    return jsonError("Введите рабочий вопрос для TeamPulse AI.", 400);
  }

  if (!hasClearWorkIntent(question)) {
    return NextResponse.json<AskSuccessResponse>({
      answer: UNCLEAR_INPUT_ANSWER,
      mode,
    });
  }

  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return jsonError(
      "OPENAI_API_KEY не настроен. Создайте .env.local и перезапустите сервер.",
      500,
    );
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(OPENAI_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: buildTeamPulseSystemPrompt(mode),
          },
          {
            role: "user",
            content: question,
          },
        ],
        temperature: 0.35,
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      return jsonError(
        "Не удалось получить ответ от AI. Проверьте API-ключ или попробуйте позже.",
        response.status === 401 ? 401 : 502,
      );
    }

    const data = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };

    const answer = data.choices?.[0]?.message?.content?.trim();

    if (!answer) {
      return jsonError("AI вернул пустой ответ. Попробуйте уточнить вопрос.", 502);
    }

    return NextResponse.json<AskSuccessResponse>({ answer, mode });
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      return jsonError(
        "Ответ занимает слишком много времени. Попробуйте сократить вопрос или повторить позже.",
        504,
      );
    }

    return jsonError(
      "Не удалось получить ответ. Проверьте подключение, API-ключ или попробуйте ещё раз.",
      500,
    );
  } finally {
    clearTimeout(timeoutId);
  }
}

function jsonError(message: string, status: number) {
  return NextResponse.json<AskErrorResponse>({ error: message }, { status });
}
