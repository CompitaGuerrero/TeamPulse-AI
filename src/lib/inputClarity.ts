export const UNCLEAR_INPUT_ANSWER =
  "Сообщение не содержит ясного рабочего запроса. Пожалуйста, переформулируйте вопрос или опишите задачу, которую нужно разобрать.";

const WORK_INTENT_TERMS = [
  "как",
  "что",
  "почему",
  "где",
  "когда",
  "помоги",
  "нуж",
  "надо",
  "можно",
  "сдела",
  "делать",
  "подготов",
  "разобр",
  "оцен",
  "риск",
  "план",
  "задач",
  "команд",
  "спринт",
  "проект",
  "запуск",
  "релиз",
  "лендинг",
  "функц",
  "клиент",
  "заказчик",
  "редизайн",
  "менеджер",
  "дизайнер",
  "разработчик",
  "срок",
  "дедлайн",
  "приоритет",
  "решени",
  "обсуждени",
  "распредел",
  "проблем",
  "успева",
  "данн",
  "отчет",
  "встреч",
  "созвон",
  "тестирован",
  "пользователь",
  "ответствен",
  "how",
  "what",
  "why",
  "plan",
  "risk",
  "team",
  "project",
  "task",
  "sprint",
  "launch",
  "deadline",
  "meeting",
];

export function hasClearWorkIntent(input: string): boolean {
  const normalized = input.replace(/\s+/g, " ").trim();

  if (!normalized) {
    return false;
  }

  const letters = normalized.match(/\p{L}/gu)?.length ?? 0;
  const digits = normalized.match(/\d/g)?.length ?? 0;
  const words = getTokens(normalized);
  const hasQuestionMark = normalized.includes("?");
  const hasWorkSignal = hasWorkIntent(words);
  const isSingleToken = words.length <= 1;
  const hasMixedNoise = isSingleToken && letters > 0 && digits > 0;

  if (letters < 5 || normalized.length < 10) {
    return false;
  }

  if (hasRepeatedCharacters(normalized)) {
    return false;
  }

  if (hasMixedNoise) {
    return false;
  }

  if (isSingleToken && !hasWorkSignal) {
    return false;
  }

  if (hasWorkSignal) {
    return true;
  }

  return hasQuestionMark && words.length >= 3;
}

function getTokens(value: string): string[] {
  return value.toLowerCase().match(/[\p{L}\d]+/gu) ?? [];
}

function hasWorkIntent(words: string[]): boolean {
  return words.some((word) =>
    WORK_INTENT_TERMS.some((term) => word === term || word.startsWith(term)),
  );
}

function hasRepeatedCharacters(value: string): boolean {
  const compact = value.replace(/\s+/g, "").toLowerCase();

  return /(.)\1{5,}/u.test(compact);
}
