"use server";

import { createClient } from "@/lib/supabase/server";

export type Conversation = {
  id: string;
  title: string;
  created_at: string;
};

export type MessageRole = "user" | "bot";

export type Message = {
  id: string;
  conversation_id: string;
  role: MessageRole;
  content: string;
  created_at: string;
};

type CreateConversationInput = {
  title?: string;
};

type InsertMessageInput = {
  conversationId: string;
  role: MessageRole;
  content: string;
};

async function getSingleConversationByUserId(userId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("conversation")
    .select("id, title, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("Failed to fetch single conversation:", error);
    return null;
  }

  return (data as Conversation | null) ?? null;
}

export async function getConversationsAction(): Promise<Conversation[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.id) {
    return [];
  }

  const singleConversation = await getSingleConversationByUserId(user.id);

  return singleConversation ? [singleConversation] : [];
}

export async function getMessagesAction(
  conversationId: string,
): Promise<Message[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.id || !conversationId) {
    return [];
  }

  const { data: conversation, error: conversationError } = await supabase
    .from("conversation")
    .select("id")
    .eq("id", conversationId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (conversationError || !conversation) {
    return [];
  }

  const { data, error } = await supabase
    .from("messages")
    .select("id, conversation_id, role, content, created_at")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Failed to fetch messages:", error);
    return [];
  }

  return (data ?? []) as Message[];
}

export async function createConversationAction({
  title,
}: CreateConversationInput = {}): Promise<Conversation> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.id) {
    throw new Error("User is not authenticated");
  }

  const existingConversation = await getSingleConversationByUserId(user.id);

  if (existingConversation) {
    const normalizedTitle = title?.trim();

    if (normalizedTitle && normalizedTitle !== existingConversation.title) {
      const { data: updatedConversation, error: updateError } = await supabase
        .from("conversation")
        .update({
          title: normalizedTitle,
        })
        .eq("id", existingConversation.id)
        .eq("user_id", user.id)
        .select("id, title, created_at")
        .single();

      if (updateError || !updatedConversation) {
        console.error("Failed to update conversation title:", updateError);
        throw new Error("Failed to update conversation title");
      }

      return updatedConversation as Conversation;
    }

    return existingConversation;
  }

  const { data, error } = await supabase
    .from("conversation")
    .insert({
      user_id: user.id,
      title: title?.trim() || "Percakapan Baru",
    })
    .select("id, title, created_at")
    .single();

  if (error || !data) {
    console.error("Failed to create conversation:", error);
    throw new Error("Failed to create conversation");
  }

  return data as Conversation;
}

export async function resetConversationAction(): Promise<Conversation> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.id) {
    throw new Error("User is not authenticated");
  }

  const conversation = await createConversationAction({
    title: "Percakapan Baru",
  });

  const { error } = await supabase
    .from("messages")
    .delete()
    .eq("conversation_id", conversation.id);

  if (error) {
    console.error("Failed to reset conversation messages:", error);
    throw new Error("Failed to reset conversation");
  }

  return conversation;
}

export async function insertMessageAction({
  conversationId,
  role,
  content,
}: InsertMessageInput): Promise<Message> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.id) {
    throw new Error("User is not authenticated");
  }

  const { data: conversation, error: conversationError } = await supabase
    .from("conversation")
    .select("id")
    .eq("id", conversationId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (conversationError || !conversation) {
    throw new Error("Conversation not found");
  }

  const { data, error } = await supabase
    .from("messages")
    .insert({
      conversation_id: conversationId,
      role,
      content,
    })
    .select("id, conversation_id, role, content, created_at")
    .single();

  if (error || !data) {
    console.error("Failed to insert message:", error);
    throw new Error("Failed to insert message");
  }

  return data as Message;
}
