import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const ELEVENLABS_API_TOKEN = process.env.ELEVENLABS_API_TOKEN;

const textToSpeech = async (inputText: string, voiceId: string) => {
  const speechDetails = await axios.request({
    method: 'POST',
    url: `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
    headers: {
      accept: 'audio/mpeg',
      'content-type': 'application/json',
      'xi-api-key': `${ELEVENLABS_API_TOKEN}`,
    },
    data: {
      text: inputText,
    },
    responseType: 'arraybuffer'
  });
  return speechDetails.data;
};

export default textToSpeech;