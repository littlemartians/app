import type { NextApiRequest, NextApiResponse } from 'next'
import { ChatCompletionRequestMessage } from "openai";
import llm from '../../util/llm'

type ChatRequest = {
  martianName : string;
  chats: ChatCompletionRequestMessage[];
}

const handler = async (
  req: NextApiRequest, 
  res: NextApiResponse
) => {
  const { martianName, chats } = req.body as ChatRequest;
  const answer = await llm(martianName, chats);
  res.status(200).json({ answer })
}

export default handler;