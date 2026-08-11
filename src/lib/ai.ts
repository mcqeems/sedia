import OpenAI from "openai";

let llmClient: OpenAI | undefined;

export function getLlm(): OpenAI {
  llmClient ??= new OpenAI({
    apiKey: process.env.LLM_API_KEY,
    baseURL: process.env.LLM_BASE_URL ?? "https://apihub.agnes-ai.com/v1",
  });
  return llmClient;
}

export const LLM_MODEL: string = process.env.LLM_MODEL ?? "agnes-2.5-flash";
