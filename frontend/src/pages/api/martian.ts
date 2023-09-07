import { Buffer } from 'buffer';
import { NextApiRequest, NextApiResponse } from "next";
import { withSessionRoute } from "util/withSession";
import axios from 'axios';
import fs from 'fs';
import { promisify } from 'util';
import FormData from 'form-data';
import { Configuration, OpenAIApi, ChatCompletionRequestMessage } from "openai";
import martians from '../../martians';

import dotenv from 'dotenv';
dotenv.config();


const textToSpeech = async (inputText: string, voiceId: string) => 
{
  const speechDetails = await axios.request({
    method: 'POST',
    url: `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
    headers: {
      accept: 'audio/mpeg',
      'content-type': 'application/json',
      'xi-api-key': `${process.env.ELEVENLABS_API_TOKEN}`,
    },
    data: {
      text: inputText,
    },
    responseType: 'arraybuffer'
  });
  return speechDetails.data;
};

const uploadFile = async (filePath: string) => 
{
  const readFileAsync = promisify(fs.readFile);
  const media = await readFileAsync(filePath);
  const form = new FormData();
  form.append('media', media);
  const authHeader = {
    "x-api-key": process.env.EDEN_API_KEY,
    "x-api-secret": process.env.EDEN_API_SECRET,
    'Content-Type': 'multipart/form-data',
  };
  const response = await axios.post(
    `https://api.eden.art/media/upload`,
    form,
    { headers: { ...authHeader, ...form.getHeaders() } }
  );
  return response.data;
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => 
{
  const { question, martian } = req.body;
  const martian_ = martians.filter((m) => m.key === martian)[0];

  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);

  const martianMessages = martian_.messages;
  const newMessage : ChatCompletionRequestMessage[] = [{
    "role": "user", 
    "content": question
  }];

  const allMessages = martianMessages.concat(newMessage);

  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: allMessages,
    temperature: 1,
    max_tokens: 256,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  });
  
  //const answer = question;
  const answer = response?.data?.choices[0].message?.content || "error";

  // tts
  const audioData = await textToSpeech(answer, martian_.voiceId);
  const base64Audio = Buffer.from(audioData).toString('base64');

  // save local file
  const randomId = Math.floor(Math.random() * 1000000);
  const fileName = 'audio_' + randomId + '.mp3';
  fs.writeFileSync(fileName, audioData);
  const edenFile = await uploadFile(fileName);
  fs.unlinkSync(fileName);

  // save memory
  await axios.request({
    method: 'POST',
    url: 'http://localhost:5050/memory/create',
    headers: {
      'Content-Type': 'application/json',
    },
    data: JSON.stringify({ 
      martian: martian,
      question: question, 
      answer: answer,
      audioUrl: edenFile.url,
    }),
    responseType: 'arraybuffer'
  });
  
  try {    
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json({ audio: base64Audio, answer: answer });
  } catch (error: any) {
    res.status(500).json({ error: "Error" });
  }
};

export default withSessionRoute(handler);
