import { AlertCircle } from "lucide-react";

type ErrorMessageProps = {
  message: string;
};

export function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-[#ff5de7]/30 bg-[#ff5de7]/10 px-4 py-3 text-sm text-[#ffd3f8]">
      <AlertCircle className="mt-0.5 shrink-0" size={18} />
      <p>{message}</p>
    </div>
  );
}
