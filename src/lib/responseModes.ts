export const RESPONSE_MODES = [
  {
    id: "brief",
    label: "Кратко",
    description: "Сжатый вывод, главные риски и ближайшие действия.",
  },
  {
    id: "detailed",
    label: "Подробно",
    description: "Глубокий разбор, ограничения, вопросы и следующие шаги.",
  },
  {
    id: "action-plan",
    label: "План действий",
    description: "Пошаговый план с ответственностью, сроками и рисками.",
  },
] as const;

export type ResponseMode = (typeof RESPONSE_MODES)[number]["id"];

export const DEFAULT_RESPONSE_MODE: ResponseMode = "brief";

export function isResponseMode(value: unknown): value is ResponseMode {
  return RESPONSE_MODES.some((mode) => mode.id === value);
}

export function getResponseModeLabel(mode: ResponseMode): string {
  return RESPONSE_MODES.find((item) => item.id === mode)?.label ?? "Кратко";
}
