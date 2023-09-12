import { ConnectButton } from "@rainbow-me/rainbowkit";
import Balance from "../components/MintButton";
import AudioInterface from "../components/AudioInterface";
import LittleMartian from "../components/LittleMartian";
import nebulana from "../martians/nebulana";
import React, { useState } from 'react';
import axios from 'axios';


import { Martian } from "../martians/Martian";


import { ChatCompletionRequestMessage } from "openai";

// type ChatRequest = {
//   martianName : string;
//   chats: ChatCompletionRequestMessage[];
// }



// character builder
// - character manifest / configurator
// - select voice
// - create appearance
// voice interface
// chat interface
// prompt a monologue
// talking head


const ChatInterface : React.FC<{martian: Martian}> = ({ martian }) => {
  const [userInput, setUserInput] = useState('');
  const [chat, setChat] = useState<ChatCompletionRequestMessage[]>([]);

  const handleSendMessage = async () => {
    const newMessage: ChatCompletionRequestMessage = {
      role: 'user',
      content: userInput,
    };
    setChat((prevChat) => [...prevChat, newMessage]);
    setUserInput('');
  
    try {
      const response = await axios.post('/api/chat', {
        martianName: martian.key,
        chats: [...chat, newMessage],
      });
  
      const assistantMessage: ChatCompletionRequestMessage = {
        role: 'assistant',
        content: response.data.answer,
      };

      setChat((prevChat) => [...prevChat, assistantMessage]);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      {chat.map((item, index) => (
        <div key={index}>
          <span className="text-xs text-gray-500">{item.role}</span>
          &nbsp;:&nbsp; 
          <span className="text-sm text-gray-700">{item.content}</span>
        </div>
      ))}
      <div>
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleSendMessage();
            }
          }}
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
};


export default function Home() {
  return (
    <div>
      {/* <h1 className="text-3xl font-bold underline">Hello world!</h1> */}
      {/* <ConnectButton /> */}
      {/* <Balance /> */}
      <AudioInterface />
      {/* <LittleMartian martian={nebulana} /> */}
      {/* <ChatInterface martian={nebulana} /> */}
    </div>
  );
}
