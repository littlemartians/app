import { NextApiRequest, NextApiResponse } from "next";
import { Buffer } from 'buffer';
import { ChatCompletionRequestMessage } from "openai";

import martians from '../../martians';
import llm from '../../util/llm'
import tts from '../../util/tts'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { martian, prompt } = req.body;
  const martian_ = martians.filter((m) => m.key === martian)[0];

  // setup chat
  const chat : ChatCompletionRequestMessage[] = [{
    "role": "user", 
    "content": prompt
  }]; 
  
  const answer = await llm(martian, chat);

  // create image and tts in parallel
  const audioData = await tts(answer, martian_.voiceId);
  const base64Audio = Buffer.from(audioData).toString('base64');
      
  // save local file
  // const randomId = Math.floor(Math.random() * 1000000);
  // const fileName = 'audio_' + randomId + '.mp3';
  // fs.writeFileSync(fileName, audioData);

  res.status(200).json({ 
    answer: answer, 
    audio: base64Audio 
  })
};

export default handler;