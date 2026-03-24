import { type RefObject, useEffect, useState } from "react";
import ChatComposer from "./ChatComposer";
import MarkdownFormatter from "./MarkdownFormatter";
import type { LocalMessage } from "./types";

function ThinkingIndicator() {
  const [dotCount, setDotCount] = useState(1);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setDotCount((prev) => (prev % 3) + 1);
    }, 450);

    return () => {
      window.clearInterval(intervalId);
    };
  }, []);

  return (
    <p className="text-sm text-slate-500">Thinking{".".repeat(dotCount)}</p>
  );
}

type ChatMessagesProps = {
  messages: LocalMessage[];
  bottomRef: RefObject<HTMLDivElement | null>;
  draft: string;
  setDraft: (value: string) => void;
  canSend: boolean;
  error: string | null;
  onSend: () => void;
};

export default function ChatMessages({
  messages,
  bottomRef,
  draft,
  setDraft,
  canSend,
  error,
  onSend,
}: ChatMessagesProps) {
  return (
    <div className="relative min-h-0 flex-1 bg-slate-50">
      <div className="h-full overflow-y-auto md:px-4 py-5 px-2 pb-30">
        {messages.length === 0 ? (
          <div className="mx-auto mt-10 max-w-xl rounded-2xl p-6 text-center">
            <h2 className="mb-2 text-lg font-semibold text-slate-800">
              Mulai Percakapan
            </h2>
            <p className="text-sm text-slate-600">
              Tanyakan kondisi cuaca, risiko, atau langkah mitigasi bencana di
              lokasi Anda.
            </p>
          </div>
        ) : (
          <div className="mx-auto flex w-full flex-col gap-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`max-w-[90%] rounded-4xl text-sm ${
                  message.role === "user"
                    ? "ml-auto bg-primary text-white px-4 py-3"
                    : "mr-auto text-slate-700 p-0 md:p-2"
                }`}
              >
                {message.role === "bot" ? (
                  message.content ? (
                    <MarkdownFormatter content={message.content} />
                  ) : (
                    <ThinkingIndicator />
                  )
                ) : (
                  <p className="whitespace-pre-wrap">{message.content}</p>
                )}
              </div>
            ))}
          </div>
        )}

        <div ref={bottomRef} className="h-24" />
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center">
        <div className="pointer-events-auto w-full max-w-3xl px-2 pb-2">
          <ChatComposer
            draft={draft}
            setDraft={setDraft}
            canSend={canSend}
            error={error}
            onSend={onSend}
          />
        </div>
      </div>
    </div>
  );
}
