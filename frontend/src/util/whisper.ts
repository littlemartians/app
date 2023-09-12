import fs from "fs";
import FormData from "form-data";
import fetch from "node-fetch";
import * as formidable from "formidable";
import dotenv from 'dotenv';

dotenv.config();
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

async function whisper(file: formidable.File): Promise<string> {
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

  const result = await response.json() as { text: string };

  return result.text;
}

export default whisper;