export type LocalMessage = {
  id: string;
  role: "user" | "bot";
  content: string;
  created_at: string;
};
