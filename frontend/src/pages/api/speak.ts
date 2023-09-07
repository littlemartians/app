import fs from "fs";
import FormData from "form-data";
import fetch from "node-fetch";
import * as formidable from "formidable";
import { NextApiRequest, NextApiResponse } from "next";


import { Buffer } from 'buffer';
import { withSessionRoute } from "../../util/withSession";
import axios from 'axios';
import { promisify } from 'util';
import { Configuration, OpenAIApi, ChatCompletionRequestMessage } from "openai";
import martians from '../../martians';


import dotenv from 'dotenv';
dotenv.config();

const OPENAI_API_KEY = "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"; //process.env.LM_OPENAI_API_KEY;
const ELEVENLABS_API_TOKEN = "4a874e2437601d9bfa00d6727074c0d8";


export const config = {
  api: {
    bodyParser: false,
  },
};



const textToSpeech = async (inputText: string, voiceId: string) => 
{
  console.log('tts')
  console.log(ELEVENLABS_API_TOKEN)
  console.log(inputText);
  console.log(voiceId);
  const speechDetails = await axios.request({
    method: 'POST',
    url: `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
    headers: {
      accept: 'audio/mpeg',
      'content-type': 'application/json',
      // 'xi-api-key': `${process.env.ELEVENLABS_API_TOKEN}`,
      'xi-api-key': `${ELEVENLABS_API_TOKEN}`,
    },
    data: {
      text: inputText,
    },
    responseType: 'arraybuffer'
  });
  console.log("doneenenene")
  return speechDetails.data;
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
        
        

        const file = (files.file[0] as unknown) as formidable.File;
        const data = new FormData();

        data.append('file', fs.createReadStream(file.filepath), "test.wav");
        data.append("model", "whisper-1");
        data.append("language", "en");
        
        const response = await fetch("https://api.openai.com/v1/audio/transcriptions", {
          headers: {
            Authorization: `Bearer ${OPENAI_API_KEY}`,
          },
          method: "POST",
          body: data,
        });

        const result = await response.json() as { text: string};
        // const result = { text: "what is your current occupat ssion?"} as { text: string};
        
        console.log("======")
        console.log(result);
        console.log("======")



        // const martian = fields.martian;
        const martian = Array.isArray(fields.martian) ? fields.martian[0] : fields.martian;

        console.log("no?", martian)
        // if (!martian) {
        //   return reject({ error: "No martian provided" });
        // }
        const martian_ = martians.filter((m) => m.key === martian)[0];
        console.log(martian_)
        console.log("THE MARTIAN IS", martian)



        const configuration = new Configuration({
          apiKey: OPENAI_API_KEY,
        });
        const openai = new OpenAIApi(configuration);
      
        const martianMessages = martian_.messages;
        const newMessage : ChatCompletionRequestMessage[] = [{
          "role": "user", 
          "content": result.text
        }];
      
        const allMessages = martianMessages.concat(newMessage);
        console.log(allMessages)
        console.log("done")
        const gptResponse = await openai.createChatCompletion({
          model: "gpt-3.5-turbo",
          messages: allMessages,
          temperature: 1,
          max_tokens: 256,
          top_p: 1,
          frequency_penalty: 0,
          presence_penalty: 0,
        });
        console.log("done2")
        console.log(gptResponse)
        
        //const answer = question;
        const answer = gptResponse?.data?.choices[0].message?.content || "error";
        console.log("GPT RESPONSE", answer)

        // tts
        const audioData = await textToSpeech(answer, martian_.voiceId);
        const base64Audio = Buffer.from(audioData).toString('base64');
      
        // save local file
        const randomId = Math.floor(Math.random() * 1000000);
        const fileName = 'audio_' + randomId + '.mp3';
        fs.writeFileSync(fileName, audioData);

        console.log("save", fileName)

        // resolve({ text: result.text });
        resolve({ audio: base64Audio });


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