import { IconSend2 } from "@tabler/icons-react";

type ChatComposerProps = {
  draft: string;
  setDraft: (value: string) => void;
  canSend: boolean;
  error: string | null;
  onSend: () => void;
};

export default function ChatComposer({
  draft,
  setDraft,
  canSend,
  error,
  onSend,
}: ChatComposerProps) {
  return (
    <footer className="bg-transparent p-2">
      <div className="mx-auto flex max-w-3xl justify-center items-center gap-2 rounded-4xl border border-slate-50 bg-slate-100 p-1 drop-shadow-sm">
        <textarea
          rows={1}
          value={draft}
          onChange={(event) => {
            setDraft(event.target.value);
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              onSend();
            }
          }}
          placeholder="Tulis pesan Anda..."
          className="flex-1 resize-none text-slate-700 bg-transparent px-2 py-2 text-sm outline-none"
        />
        <button
          type="button"
          disabled={!canSend}
          onClick={onSend}
          className="rounded-full bg-primary p-2 text-white transition disabled:cursor-not-allowed disabled:opacity-40"
        >
          <IconSend2 className="h-5 w-5" />
        </button>
      </div>
      {error ? (
        <p className="mx-auto mt-2 text-center max-w-3xl text-xs text-red-500">
          {error}
        </p>
      ) : null}
    </footer>
  );
}
