import { Configuration, OpenAIApi, ChatCompletionRequestMessage } from "openai";
import martians from '../martians';
import dotenv from 'dotenv';
dotenv.config();

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const configuration = new Configuration({
  apiKey: OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const llm = async (martianName : string, chats: ChatCompletionRequestMessage[]) => {
  const martian = martians.filter((m) => m.key === martianName)[0];

  const initialChat = martian.messages;

  const systemMessage : ChatCompletionRequestMessage = {
    "role": "system", 
    "content": martian.systemPrompt
  };

  const messages : ChatCompletionRequestMessage[] = [
    systemMessage,
    ...initialChat,
    ...chats
  ];

  const gptResponse = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: messages,
    temperature: 1,
    max_tokens: 256,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  });
  
  const answer = gptResponse?.data?.choices[0].message?.content || "error";

  return answer;
}

export default llm;