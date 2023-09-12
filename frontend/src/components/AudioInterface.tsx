import React, { useState, useRef } from "react";
import axios from 'axios';
import { ChatCompletionRequestMessage } from "openai";

const AudioInterface = () => {
  const [listening, setListening] = useState(false);
  
  const [chat, setChat] = useState<ChatCompletionRequestMessage[]>([]);
  const [audioUrls, setAudioUrls] = useState<string[]>([]);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const audioBlobRef = useRef<Blob | null>(null);

  const sendAudio = async () => {
    const data = new FormData();
    data.append("file", audioBlobRef.current as Blob);
    data.append("model", "whisper-1");
    data.append("language", "en");
    data.append("martian", "nebulana");
    data.append("chat", JSON.stringify(chat));    

    try {

      console.log("lets go")
      const response = await axios.post("/api/speak", data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      console.log(response);

      const { userText, martianText, audio } = response.data;

      const newMessages: ChatCompletionRequestMessage[] = [
        {
          role: 'user',
          content: userText,
        },{
          role: 'assistant',
          content: martianText,
        }
      ];
      setChat((prevChat) => [...prevChat, ...newMessages]);

      const blob = new Blob([new Uint8Array(Buffer.from(audio, 'base64').buffer)], { type: 'audio/mpeg' });
      const returnAudioUrl = URL.createObjectURL(blob);
      setAudioUrls(prevUrls => [...prevUrls, returnAudioUrl]);

    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  const startListening = () => {
    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      const recorder = new MediaRecorder(stream);      
      const audioChunks = [] as Blob[];
  
      recorder.ondataavailable = (e) => {
        audioChunks.push(e.data);
      };
  
      recorder.onstop = async () => {
        const blob = new Blob(audioChunks, { type: "audio/wav" });
        const url = URL.createObjectURL(blob);
        audioBlobRef.current = blob;
        setAudioUrls(prevUrls => [...prevUrls, url]);
        await sendAudio();
      };
  
      recorder.start();

      setMediaRecorder(recorder);
    });
  };

  const stopListening = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
    }
  }

  return (
    <>
      <button onClick={startListening}>Start listening</button>
      <br/>
      <button onClick={stopListening}>Stop listening</button>
      {audioUrls.map((audioUrl, index) => (
        <audio key={index} controls src={audioUrl}></audio>
      ))}
      <br/>
      {chat.map((item, index) => (
        <div key={index}>
          <span className="text-xs text-gray-500">{item.role}</span>
          &nbsp;:&nbsp; 
          <span className="text-sm text-gray-700">{item.content}</span>
        </div>
      ))}
    </>
  );
};

export default AudioInterface;