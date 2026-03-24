import type { RefObject } from "react";
import MarkdownFormatter from "./MarkdownFormatter";
import type { LocalMessage } from "./types";

type ChatMessagesProps = {
  messages: LocalMessage[];
  bottomRef: RefObject<HTMLDivElement | null>;
};

export default function ChatMessages({
  messages,
  bottomRef,
}: ChatMessagesProps) {
  return (
    <div className="min-h-0 flex-1 overflow-y-auto bg-slate-50 px-4 py-5">
      {messages.length === 0 ? (
        <div className="mx-auto mt-10 max-w-xl rounded-2xl border border-dashed border-slate-300 bg-white/70 p-6 text-center">
          <h2 className="mb-2 text-lg font-semibold">Mulai Percakapan</h2>
          <p className="text-sm text-slate-600">
            Tanyakan kondisi cuaca, risiko, atau langkah mitigasi bencana di
            lokasi Anda.
          </p>
        </div>
      ) : (
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`max-w-[90%] rounded-2xl px-4 py-3 text-sm shadow-sm ${
                message.role === "user"
                  ? "ml-auto bg-primary text-white"
                  : "mr-auto bg-white text-slate-800"
              }`}
            >
              {message.role === "bot" ? (
                <MarkdownFormatter content={message.content || "..."} />
              ) : (
                <p className="whitespace-pre-wrap">{message.content}</p>
              )}
            </div>
          ))}
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
}
