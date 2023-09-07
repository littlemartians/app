import { ChatCompletionRequestMessage } from "openai";

export type Martian = {
  key: string;
  name: string;
  voiceId: string;
  systemPrompt: string;
  messages: ChatCompletionRequestMessage[];
};
