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
    <footer className="border-t border-black/10 bg-white p-3">
      <div className="mx-auto flex max-w-3xl items-end gap-2 rounded-2xl border border-slate-300 bg-slate-50 p-2">
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
          className="max-h-48 min-h-10 flex-1 resize-none bg-transparent px-2 py-2 text-sm outline-none"
        />
        <button
          type="button"
          disabled={!canSend}
          onClick={onSend}
          className="rounded-xl bg-primary p-2 text-white transition disabled:cursor-not-allowed disabled:opacity-40"
        >
          <IconSend2 className="h-5 w-5" />
        </button>
      </div>
      {error ? (
        <p className="mx-auto mt-2 max-w-3xl text-xs text-red-500">{error}</p>
      ) : null}
    </footer>
  );
}
