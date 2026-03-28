import type { Metadata } from "next";
import ChatClient from "@/app/(protected)/chat/ChatClient";

export const metadata: Metadata = {
  title: "Chat",
};

export default function Chat() {
  return <ChatClient />;
}
