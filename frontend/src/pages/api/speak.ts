import * as formidable from "formidable";
import { NextApiRequest, NextApiResponse } from "next";
import { Buffer } from 'buffer';
import { ChatCompletionRequestMessage } from "openai";
import fs from 'fs';
import fetch from 'node-fetch';


import martians from '../../martians';
import llm from '../../util/llm'
import whisper from '../../util/whisper'
import tts from '../../util/tts'
import create from '../../util/create'

export const config = {
  api: {
    bodyParser: false,
  },
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const form = new formidable.IncomingForm();

  return new Promise((resolve, reject) => {
    form.parse(req, async (error, fields, files) => {
      if (error) {
        return reject(error);
      }
      try {
        if (!files.file) {
          return reject({ error: "No file uploaded" });
        }

        if (!fields.chat || !Array.isArray(fields.chat)) {
          return reject({ error: "Invalid chat field" });
        }

        if (!fields.martian) {
          return reject({ error: "No Martian specified" });
        }

        const martian = Array.isArray(fields.martian) ? fields.martian[0] : fields.martian;
        const martian_ = martians.filter((m) => m.key === martian)[0];
        const chat: ChatCompletionRequestMessage[] = JSON.parse(fields.chat.join(''));
        const file = (files.file[0] as unknown) as formidable.File;

        // stt
        const prompt = await whisper(file);

        // setup chat
        const newMessage : ChatCompletionRequestMessage[] = [{
          "role": "user", 
          "content": prompt
        }]; 
        const allMessages = chat.concat(newMessage);
        const answer = await llm(martian, allMessages);

        // create image and tts in parallel
        const [imageUrl, audioData] = await Promise.all([
          create(answer),
          tts(answer, martian_.voiceId)
        ]);

        //const audioData = fs.readFileSync('audio_673480.mp3');
        const imageFetch = await fetch(imageUrl);
        const imageBuffer = await imageFetch.arrayBuffer();
        const image = Buffer.from(imageBuffer).toString('base64');
        const base64Audio = Buffer.from(audioData).toString('base64');
      
        // save local file
        // const randomId = Math.floor(Math.random() * 1000000);
        // const fileName = 'audio_' + randomId + '.mp3';
        // fs.writeFileSync(fileName, audioData);

        resolve({ 
          userText: prompt, 
          martianText: answer,
          image: image,
          audio: base64Audio 
        });

      } catch (error: any) {
        console.log(error);
        reject({ error });
      }
    });
  }).then((result) => {
    return res.status(200).json(result);
  }).catch((error) => {
    return res.status(500).json({ error });
  });
};

export default handler;