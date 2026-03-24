import { IconCircleCheck, IconMessageCirclePlus } from "@tabler/icons-react";

type ChatHeaderProps = {
  onReset: () => void;
  isResetDisabled: boolean;
};

export default function ChatHeader({
  onReset,
  isResetDisabled,
}: ChatHeaderProps) {
  return (
    <header className="flex items-center justify-between border-b border-black/10 bg-white px-4 py-3">
      <div>
        <div className="flex justify-center items-center gap-1 flex-row text-slate-500">
          <IconCircleCheck className="w-4 h-4" />{" "}
          <p className="text-xs tracking-wider">Tersedia</p>
        </div>
      </div>
      <button
        type="button"
        onClick={onReset}
        disabled={isResetDisabled}
        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-50"
      >
        <IconMessageCirclePlus className="h-4 w-4" /> Reset Chat
      </button>
    </header>
  );
}
