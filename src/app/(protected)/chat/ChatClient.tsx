"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import HeaderPage from "@/components/protected/HeaderPage";
import Loader from "@/components/protected/Loader";
import {
  type Conversation,
  createConversationAction,
  getConversationsAction,
  getMessagesAction,
  type Message,
  resetConversationAction,
} from "./actions";
import ChatHeader from "./components/ChatHeader";
import ChatMessages from "./components/ChatMessages";
import type { LocalMessage } from "./components/types";

export default function ChatClient() {
  const [isLoadingInitial, setIsLoadingInitial] = useState(true);
  const [activeConversation, setActiveConversation] =
    useState<Conversation | null>(null);
  const [messages, setMessages] = useState<LocalMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const hasMessages = messages.length > 0;

  useEffect(() => {
    const loadInitialChat = async () => {
      setIsLoadingInitial(true);
      setError(null);

      try {
        const conversations = await getConversationsAction();
        const firstConversation = conversations[0] ?? null;

        setActiveConversation(firstConversation);

        if (!firstConversation?.id) {
          setMessages([]);
          return;
        }

        const initialMessages: Message[] = await getMessagesAction(
          firstConversation.id,
        );

        setMessages(
          initialMessages.map((message) => ({
            id: message.id,
            role: message.role,
            content: message.content,
            created_at: message.created_at,
          })),
        );
      } catch (initialLoadError) {
        console.error(initialLoadError);
        setError("Gagal memuat riwayat chat.");
      } finally {
        setIsLoadingInitial(false);
      }
    };

    void loadInitialChat();
  }, []);

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
    <div className="mx-auto w-full max-w-7xl p-2 md:p-4">
      <HeaderPage
        title="Sedia AI Chat"
        description="Sedia AI hadir untukmu dimanapun dan kapanpun."
      />
      <section className="mt-1 flex h-[calc(100dvh-6.5rem)] min-w-0 flex-1 flex-col overflow-hidden rounded-2xl border border-black/10 bg-slate-50 text-slate-900 md:h-[calc(100dvh-9rem)]">
        {isLoadingInitial ? (
          <div className="flex h-full w-full items-center justify-center">
            <Loader />
          </div>
        ) : (
          <>
            <ChatHeader
              onReset={() => {
                void handleResetConversation();
              }}
              isResetDisabled={isResetting || isStreaming || !hasMessages}
            />

            <ChatMessages
              messages={messages}
              bottomRef={bottomRef}
              draft={draft}
              setDraft={setDraft}
              canSend={canSend}
              error={error}
              onSend={() => {
                void handleSend();
              }}
            />
          </>
        )}
      </section>
    </div>
  );
}
