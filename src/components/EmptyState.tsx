import { Sparkles } from "lucide-react";

type EmptyStateProps = {
  title: string;
  description: string;
};

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="flex min-h-72 flex-col items-center justify-center rounded-lg border border-dashed border-white/15 bg-white/[0.04] px-6 py-10 text-center">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-[#24f2c3]/25 bg-[#24f2c3]/10 text-[#8fffe4]">
        <Sparkles size={22} />
      </div>
      <h3 className="text-base font-semibold text-[#f4fff9]">{title}</h3>
      <p className="mt-2 max-w-md text-sm leading-6 text-[#92a5b4]">{description}</p>
    </div>
  );
}
