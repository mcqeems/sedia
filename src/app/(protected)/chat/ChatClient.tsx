"use client";

import { IconMessageCirclePlus, IconSend2 } from "@tabler/icons-react";
import { useMemo, useRef, useState } from "react";
import {
  type Conversation,
  createConversationAction,
  getMessagesAction,
  type Message,
  resetConversationAction,
} from "./actions";

type ChatClientProps = {
  initialConversation: Conversation | null;
  initialMessages: Message[];
};

type LocalMessage = {
  id: string;
  role: "user" | "bot";
  content: string;
  created_at: string;
};

function formatInlineMarkdown(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`|\*[^*]+\*)/g);
  let tokenCounter = 0;

  return parts.map((part) => {
    const tokenKey = `${part}-${tokenCounter++}`;

    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={tokenKey}>{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code
          key={tokenKey}
          className="rounded bg-slate-200/70 px-1 py-0.5 text-xs text-slate-900"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    if (part.startsWith("*") && part.endsWith("*")) {
      return <em key={tokenKey}>{part.slice(1, -1)}</em>;
    }

    return part;
  });
}

function MarkdownFormatter({ content }: { content: string }) {
  const lines = content.split("\n");
  const blocks: React.ReactNode[] = [];
  const listBuffer: string[] = [];
  let codeBlockBuffer: string[] = [];
  let inCodeBlock = false;
  let keyCounter = 0;

  const nextKey = (prefix: string) => `${prefix}-${keyCounter++}`;

  const flushList = (keyPrefix: string) => {
    if (listBuffer.length === 0) {
      return;
    }
    let itemKeyCounter = 0;

    blocks.push(
      <ul
        key={`${keyPrefix}-${nextKey("ul")}`}
        className="list-disc space-y-1 pl-5"
      >
        {listBuffer.map((item) => (
          <li key={`${item}-${itemKeyCounter++}`}>
            {formatInlineMarkdown(item)}
          </li>
        ))}
      </ul>,
    );
    listBuffer.length = 0;
  };

  const flushCodeBlock = (keyPrefix: string) => {
    if (codeBlockBuffer.length === 0) {
      return;
    }

    blocks.push(
      <pre
        key={`${keyPrefix}-${nextKey("pre")}`}
        className="overflow-x-auto rounded-lg bg-slate-900 p-3 text-xs text-slate-100"
      >
        <code>{codeBlockBuffer.join("\n")}</code>
      </pre>,
    );
    codeBlockBuffer = [];
  };

  lines.forEach((rawLine) => {
    const line = rawLine.trimEnd();

    if (line.startsWith("```")) {
      flushList(nextKey("line"));
      if (inCodeBlock) {
        flushCodeBlock(nextKey("line"));
      }
      inCodeBlock = !inCodeBlock;
      return;
    }

    if (inCodeBlock) {
      codeBlockBuffer.push(rawLine);
      return;
    }

    const listMatch = /^[-*]\s+(.+)$/.exec(line);
    if (listMatch) {
      listBuffer.push(listMatch[1]);
      return;
    }

    flushList(nextKey("line"));

    if (!line) {
      blocks.push(<div key={nextKey("spacer")} className="h-2" />);
      return;
    }

    if (line.startsWith("### ")) {
      blocks.push(
        <h3 key={nextKey("h3")} className="text-sm font-semibold">
          {formatInlineMarkdown(line.replace(/^###\s+/, ""))}
        </h3>,
      );
      return;
    }

    if (line.startsWith("## ")) {
      blocks.push(
        <h2 key={nextKey("h2")} className="text-base font-semibold">
          {formatInlineMarkdown(line.replace(/^##\s+/, ""))}
        </h2>,
      );
      return;
    }

    if (line.startsWith("# ")) {
      blocks.push(
        <h1 key={nextKey("h1")} className="text-lg font-semibold">
          {formatInlineMarkdown(line.replace(/^#\s+/, ""))}
        </h1>,
      );
      return;
    }

    blocks.push(
      <p key={nextKey("p")} className="leading-relaxed">
        {formatInlineMarkdown(line)}
      </p>,
    );
  });

  flushList("final");
  flushCodeBlock("final");

  return <div className="space-y-1">{blocks}</div>;
}

export default function ChatClient({
  initialConversation,
  initialMessages,
}: ChatClientProps) {
  const [activeConversation, setActiveConversation] =
    useState<Conversation | null>(initialConversation);
  const [messages, setMessages] = useState<LocalMessage[]>(
    initialMessages.map((message) => ({
      id: message.id,
      role: message.role,
      content: message.content,
      created_at: message.created_at,
    })),
  );
  const [draft, setDraft] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const canSend = useMemo(
    () => draft.trim().length > 0 && !isStreaming,
    [draft, isStreaming],
  );

  const scrollToBottom = () => {
    requestAnimationFrame(() => {
      bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    });
  };

  const handleCreateConversation = async (seedText?: string) => {
    const titleSource = seedText?.trim() || "Percakapan Baru";
    const title =
      titleSource.length > 60 ? `${titleSource.slice(0, 57)}...` : titleSource;
    const conversation = await createConversationAction({ title });
    setActiveConversation(conversation);
    setMessages([]);
    return conversation.id;
  };

  const handleResetConversation = async () => {
    if (isStreaming) {
      return;
    }

    setIsResetting(true);
    setError(null);

    try {
      const conversation = await resetConversationAction();
      setActiveConversation(conversation);
      setMessages([]);
      scrollToBottom();
    } catch (resetError) {
      console.error(resetError);
      setError("Gagal mereset percakapan.");
    } finally {
      setIsResetting(false);
    }
  };

  const handleSend = async () => {
    const trimmed = draft.trim();
    if (!trimmed || isStreaming) {
      return;
    }

    setError(null);
    setDraft("");
    setIsStreaming(true);

    try {
      let conversationId = activeConversation?.id ?? null;
      if (!conversationId) {
        conversationId = await handleCreateConversation(trimmed);
      }

      const userMessageId = `user-${Date.now()}`;
      const botMessageId = `bot-${Date.now()}`;

      setMessages((prev) => [
        ...prev,
        {
          id: userMessageId,
          role: "user",
          content: trimmed,
          created_at: new Date().toISOString(),
        },
        {
          id: botMessageId,
          role: "bot",
          content: "",
          created_at: new Date().toISOString(),
        },
      ]);
      scrollToBottom();

      const response = await fetch("/api/chat/stream", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          conversationId,
          message: trimmed,
        }),
      });

      if (!response.ok || !response.body) {
        const errorText = await response.text();
        throw new Error(errorText || "Gagal memulai streaming.");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let streamedText = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) {
          break;
        }

        streamedText += decoder.decode(value, { stream: true });
        setMessages((prev) =>
          prev.map((message) =>
            message.id === botMessageId
              ? {
                  ...message,
                  content: streamedText,
                }
              : message,
          ),
        );
        scrollToBottom();
      }

      const persistedMessages = await getMessagesAction(conversationId);
      setMessages(
        persistedMessages.map((message) => ({
          id: message.id,
          role: message.role,
          content: message.content,
          created_at: message.created_at,
        })),
      );
    } catch (sendError) {
      console.error(sendError);
      setError("Pesan gagal diproses. Silakan coba lagi.");
    } finally {
      setIsStreaming(false);
      scrollToBottom();
    }
  };

  return (
    <div className="mx-auto w-full max-w-7xl px-3 py-3 md:px-6 md:py-5">
      <section className="flex h-[calc(100dvh-1.5rem)] min-w-0 flex-1 flex-col overflow-hidden rounded-2xl border border-black/10 bg-slate-50 text-slate-900 md:h-[calc(100dvh-2.5rem)]">
        <header className="flex items-center justify-between border-b border-black/10 bg-white px-4 py-3">
          <div>
            <p className="text-xs uppercase tracking-wider text-slate-500">
              Sedia AI Chat
            </p>
            <h1 className="text-base font-semibold">
              {activeConversation?.title ?? "Percakapan Baru"}
            </h1>
          </div>
          <button
            type="button"
            onClick={() => {
              void handleResetConversation();
            }}
            disabled={isResetting || isStreaming}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-50"
          >
            <IconMessageCirclePlus className="h-4 w-4" /> Reset Chat
          </button>
        </header>

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
                  void handleSend();
                }
              }}
              placeholder="Tulis pesan Anda..."
              className="max-h-48 min-h-10 flex-1 resize-none bg-transparent px-2 py-2 text-sm outline-none"
            />
            <button
              type="button"
              disabled={!canSend}
              onClick={() => {
                void handleSend();
              }}
              className="rounded-xl bg-primary p-2 text-white transition disabled:cursor-not-allowed disabled:opacity-40"
            >
              <IconSend2 className="h-5 w-5" />
            </button>
          </div>
          {error ? (
            <p className="mx-auto mt-2 max-w-3xl text-xs text-red-500">
              {error}
            </p>
          ) : null}
        </footer>
      </section>
    </div>
  );
}
