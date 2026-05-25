"use client";

import { ClipboardList, FileText, Zap } from "lucide-react";

import { RESPONSE_MODES, type ResponseMode } from "@/lib/responseModes";

const MODE_ICONS = {
  brief: Zap,
  detailed: FileText,
  "action-plan": ClipboardList,
} satisfies Record<ResponseMode, typeof Zap>;

type ResponseModeToggleProps = {
  value: ResponseMode;
  disabled?: boolean;
  onChange: (mode: ResponseMode) => void;
};

export function ResponseModeToggle({
  value,
  disabled = false,
  onChange,
}: ResponseModeToggleProps) {
  const selectedMode = RESPONSE_MODES.find((mode) => mode.id === value);

  return (
    <div className="mb-4">
      <div className="mb-2 flex items-center justify-between gap-3">
        <p className="text-sm font-semibold text-[#f4fff9]">Режим ответа</p>
        <p className="hidden text-xs text-[#8798a7] sm:block">Влияет на prompt и структуру</p>
      </div>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 xl:grid-cols-1">
        {RESPONSE_MODES.map((mode) => {
          const Icon = MODE_ICONS[mode.id];
          const isActive = mode.id === value;

          return (
            <button
              key={mode.id}
              type="button"
              className={`flex min-h-12 items-center gap-2 rounded-lg border px-3 py-2 text-left text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${
                isActive
                  ? "border-[#24f2c3]/65 bg-[#24f2c3]/12 text-[#e8fff8]"
                  : "border-white/10 bg-white/[0.04] text-[#aebfca] hover:border-[#24f2c3]/35 hover:text-[#f4fff9]"
              }`}
              onClick={() => onChange(mode.id)}
              disabled={disabled}
              aria-pressed={isActive}
              title={mode.description}
            >
              <Icon className="shrink-0" size={16} />
              <span>{mode.label}</span>
            </button>
          );
        })}
      </div>
      {selectedMode ? (
        <p className="mt-2 text-xs leading-5 text-[#8798a7]">{selectedMode.description}</p>
      ) : null}
    </div>
  );
}
