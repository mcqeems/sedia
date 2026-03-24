import {
  getConversationsAction,
  getMessagesAction,
} from "@/app/(protected)/chat/actions";
import ChatClient from "@/app/(protected)/chat/ChatClient";

export default async function Chat() {
  const conversations = await getConversationsAction();
  const initialConversation = conversations[0] ?? null;
  const initialMessages = initialConversation?.id
    ? await getMessagesAction(initialConversation.id)
    : [];

  return (
    <ChatClient
      initialConversation={initialConversation}
      initialMessages={initialMessages}
    />
  );
}
