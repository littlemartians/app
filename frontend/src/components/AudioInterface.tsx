import React, { useState, useRef } from "react";
import { Button } from 'antd';
import { AudioOutlined, StopOutlined, ReloadOutlined, LoadingOutlined } from '@ant-design/icons';
import axios from 'axios';
import { ChatCompletionRequestMessage } from "openai";

const AudioInterface = () => {
  const [thinking, setThinking] = useState(false);
  const [listening, setListening] = useState(false);
  const [chat, setChat] = useState<ChatCompletionRequestMessage[]>([]);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [audioUrls, setAudioUrls] = useState<string[]>([]);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const audioBlobRef = useRef<Blob | null>(null);

  const sendAudio = async () => {
    setThinking(true);
    const data = new FormData();
    data.append("file", audioBlobRef.current as Blob);
    data.append("model", "whisper-1");
    data.append("language", "en");
    data.append("martian", "nebulana");
    data.append("chat", JSON.stringify(chat));    

    try {
      const response = await axios.post("/api/speak", data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const { userText, martianText, audio, image } = response.data;

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

      // convert base64 image and display
      const imageBlob = new Blob([new Uint8Array(Buffer.from(image, 'base64').buffer)], { type: 'image/png' });
      const imageUrl = URL.createObjectURL(imageBlob);
      setImageSrc(imageUrl);
      

    } catch (error) {
      console.error("An error occurred:", error);
    } finally {
      setThinking(false);
    }
  };

  const startListening = () => {
    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      setListening(true);
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
    setListening(false);
  }

  return (
    <div id="audioInterface" style={{width: "100%", display: "flex", justifyContent: "space-between"}}>
      <div style={{width: "50%", padding: "10px"}}>
        {chat.map((item, index) => (
          <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
            <audio controls src={audioUrls[index]} style={{ marginRight: '10px' }}></audio>
            <div style={{width: "70%"}}>
              <span className="text-lg text-gray-500">{item.role}</span>
              &nbsp;:&nbsp; 
              <span className="text-lg text-white-700">{item.content}</span>
            </div>
          </div>
        ))}
        <br />
        {thinking ? <LoadingOutlined rev={undefined} /> : (<>
          <Button 
            size="large"
            onClick={listening ? stopListening : startListening} 
            style={{backgroundColor: listening ? 'red' : 'green'}}
            icon={listening ? <StopOutlined style={{ fontSize: '20px' }} rev={undefined} /> : <AudioOutlined style={{ fontSize: '20px' }} rev={undefined} />}
          />
          <Button 
            size="large"
            onClick={() => {
              setChat([]);
              setImageSrc(null);
              setAudioUrls([]);
            }}
            style={{backgroundColor: 'blue', marginLeft: '10px'}}
            icon={<ReloadOutlined style={{ fontSize: '20px' }} rev={undefined} />}
          />
        </>)}
      </div>
      <div style={{width: "50%", padding: "10px"}}>
        {imageSrc && <img src={imageSrc} alt="From server" style={{maxWidth: "100%"}} />}
      </div>
    </div>
  );

};

export default AudioInterface;