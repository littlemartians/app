import React, { useRef, useEffect, useState } from "react";
import axios from 'axios';
import { Button, Input, Modal, Form, Spin, Switch } from 'antd';
import { CaretRightOutlined, PauseCircleOutlined, FastBackwardOutlined, FastForwardOutlined } from '@ant-design/icons'; 
import { useMemories } from "../hooks/useMemories";

import { Martian } from "../martians/Martian";

type LittleMartianProps = {
  martian: Martian;
};

const LittleMartian: React.FC<LittleMartianProps> = ({ martian }) => {
  const { memories, isLoading, mutate } = useMemories(martian.key);

  const [question, setQuestion] = useState<string | null>(null);
  const [answer, setAnswer] = useState<string | null>(null); 
  const [isAnswerVisible, setIsAnswerVisible] = useState(true);
  
  const [videoSrc, setVideoSrc] = useState("");
  const [audioUrl, setAudioUrl] = useState<string | null>(null); 
  const [isPlaying, setIsPlaying] = useState(false);
  const [isAutoplay, setIsAutoplay] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isAutoplayRef = useRef(isAutoplay);

  const [prompt, setPrompt] = useState<string>("");
  const [isPromptVisible, setIsPromptVisible] = useState(false);
  const [isWaitingForAnswer, setIsWaitingForAnswer] = useState(false);
  
  const [selectedMemoryIndex, setSelectedMemoryIndex] = useState<number | null>(null);
  const [isMemoriesVisible, setIsMemoriesVisible] = useState(false);
  const [summaryPage, setSummaryPage] = useState(0);
  const questionsPerPage = 10;

  useEffect(() => {
    isAutoplayRef.current = isAutoplay;
  }, [isAutoplay]);

  useEffect(() => {
    document.body.style.backgroundColor = "black";
    const screenheight = window.innerHeight;
    if(screenheight < 1000 && screenheight > 10) {
      setVideoSrc(`martian_videos/${martian.key}_mobile.mp4`);
    } else {
      setVideoSrc(`martian_videos/${martian.key}.mp4`);
    }
  }, []);

  const handlePrompt = () => {
    setIsPromptVisible(true);
  };

  const handlePromptCancel = () => {
    setIsPromptVisible(false);
  };

  const handlePromptSubmit = async () => {
    setIsPromptVisible(false);
    setIsMemoriesVisible(false);
    setIsAnswerVisible(true);
    setIsAutoplay(false);
    setQuestion(prompt);
    setAnswer("...");
    setIsWaitingForAnswer(true); 
    try {      
      const response = await axios.post("/api/martian", { 
        question: prompt,
        martian: martian.key
      });
      const blob = new Blob([Buffer.from(response.data.audio, 'base64')], { type: 'audio/mpeg' });
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);
      setAnswer(response.data.answer);
      mutate();
    } catch(error) {
      console.error(error);
    }
    setIsWaitingForAnswer(false);
  };
  
  const toggleMemoriesVisible = () => {
    setIsMemoriesVisible(!isMemoriesVisible);
  };

  const handleNextPage = () => {
    setSummaryPage((prevPage) => prevPage + 1);
  };

  const handlePreviousPage = () => {
    setSummaryPage((prevPage) => Math.max(prevPage - 1, 0));
  };

  const handlePlay = () => {
    if (audioRef.current) {
      audioRef.current.play();
      setIsPlaying(true);
    }
  }

  const handlePause = () => {
    setIsAutoplay(false);
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  }
  
  const handlePrevious = () => {
    if (selectedMemoryIndex !== null && memories.length > 0) {
      const prevIndex = (selectedMemoryIndex - 1 + memories.length) % memories.length;
      handleSelectMemory(prevIndex);
    }
  }

  const handleNext = () => {
    if (selectedMemoryIndex && memories) {
      const nextIndex = (selectedMemoryIndex + 1) % memories.length;
      handleSelectMemory(nextIndex);
    }
  }

  const handleSelectMemory = (index: number) => {
    setIsMemoriesVisible(false);
    setSelectedMemoryIndex(index); 
    setQuestion(memories[index].question);
    setAnswer(memories[index].answer);
    setAudioUrl(memories[index].audioUrl);
    if (audioRef.current) {
      audioRef.current.oncanplay = () => {
        audioRef.current?.play();
        setIsPlaying(true);
      }
      audioRef.current.onended = () => {
        setIsPlaying(false);
      }
    }
  }

  useEffect(() => {
    if (!isPlaying && isAutoplayRef.current) {
      handleNext();
    }
  }, [isPlaying]);

  const MemorySummary = () => {
    if (!memories) return null;
    return (
      <>
        {memories.slice(summaryPage * questionsPerPage, (summaryPage + 1) * questionsPerPage).map((memory: any, index: number) => (
          <a 
            key={index} 
            href="#" 
            onClick={(e) => {
              e.preventDefault();
              handleSelectMemory(summaryPage * questionsPerPage + index);
            }}
          >
            {memory.question}
          </a>
        ))}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "10px"
        }}>
          <Button style={{color: "white"}} disabled={summaryPage === 0} onClick={handlePreviousPage}>Previous page</Button>
          <span>Page {summaryPage + 1} of {Math.ceil(memories.length / questionsPerPage)}</span>
          <Button style={{color: "white"}} disabled={(summaryPage + 1) * questionsPerPage >= memories.length} onClick={handleNextPage}>Next page</Button>
        </div>
      </>
    )
  }

  const AnswerDialog = () => {
    return (
      <>
        <div style={{ paddingBottom: "10px" }}>
          <b><i>{question}</i></b>
        </div>
        {isWaitingForAnswer ? ( 
          <Spin />
        ) : (
          audioUrl && (
            <div style={{ paddingBottom: "10px" }}>
              {answer}
            </div>
          )
        )}
      </>
    )
  }

  const AudioControls = () => {
    return (
      <>
        <Button style={{margin: "1%"}} onClick={handlePrevious} icon={<FastBackwardOutlined rev={undefined}/>} />
        {isPlaying
          ? <Button style={{margin: "1%"}} icon={<PauseCircleOutlined rev={undefined}/>} onClick={handlePause} />
          : <Button style={{margin: "1%"}} icon={<CaretRightOutlined rev={undefined}/>} onClick={handlePlay} />
        }
        <Button style={{margin: "1%"}} onClick={handleNext} icon={<FastForwardOutlined rev={undefined} />} />
        <Switch style={{margin: "1%", paddingLeft: "2%"}} checked={isAutoplay} onChange={setIsAutoplay} /> Autoplay
      </>
    )
  }

  return (
    <div>
      
      {(isMemoriesVisible || (isAnswerVisible && answer)) && (
        <div style={{
          backgroundColor: "rgba(0, 0, 0, 0.7)", 
          color: "white",
          position: "fixed",
          top: "10%",
          bottom: "30%",
          left: "4%",
          right: "4%",
          overflowY: "scroll",
          padding: "20px",
          zIndex: 10,
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}>
          {isMemoriesVisible ? (
            memories && <MemorySummary/>
          ) : (
            isAnswerVisible && <AnswerDialog/>
          )}
        </div>
      )}

      <div id="menu" style={{
        position: "fixed",
        bottom: "2vh",
        left: "0",
        right: "0",
        zIndex: "1000",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center"
      }}>
        <div style={{ 
          display: "flex", 
          justifyContent: "center", 
          marginBottom: "10px" 
        }}>
          <Button 
            size="large" type="primary" 
            style={{ 
            background: "red", 
            borderColor: "yellow", 
            fontSize: "1.25em", 
            padding: "6px 10px", 
            margin: "3px",
            height: "auto"
            }} 
            onClick={handlePrompt}
          >
            Ask {martian.name}
          </Button>
          <Button 
            size="large" 
            type="primary" 
            style={{ 
            background: "red", 
            borderColor: "yellow", 
            fontSize: "1.25em", 
            padding: "6px 10px", 
            margin: "3px",
            height: "auto"
            }} 
            onClick={toggleMemoriesVisible}
          >      
            {isMemoriesVisible ? "Hide memories" : "Show memories" }
          </Button>
        </div>

        {audioUrl && (
          <div style={{
            backgroundColor: "rgba(0, 0, 0, 0.7)", 
            padding: "2%",
            width: "99%",
            color: "white"
          }}>
            <AudioControls />
            <audio ref={audioRef} src={audioUrl} style={{ display: 'none' }}>
              Your browser does not support the audio element.
            </audio>
            {answer && (<>
              <Switch style={{margin: "1%", paddingLeft: "2%"}} checked={isAnswerVisible} onChange={setIsAnswerVisible} />Show answer
            </>)}
          </div> 
        )}
  
      </div>

      {isPromptVisible && (
        <Modal 
          title={`Ask ${martian.name}`}
          open={isPromptVisible} 
          onOk={async () => handlePromptSubmit()} 
          onCancel={handlePromptCancel}
          footer={[
            <Button key="submit" type="primary" style={{ background: "red", borderColor: "yellow" }} onClick={async () => handlePromptSubmit()}>
              Submit
            </Button>
          ]}
        >
          <Form>
            <Form.Item>
              <Input placeholder="What is the meaning of life?" value={prompt} onChange={e => setPrompt(e.target.value)} />
            </Form.Item>
          </Form>
        </Modal>
      )}

      <div>
        {videoSrc && (<>
          <video autoPlay loop muted playsInline style={{ width: "100%", height: "100vh", objectFit: "contain", position: "fixed", top: "150", left: "0", zIndex: "-1" }}>
            <source src={videoSrc} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </>)}
      </div>

    </div>
  );

};

export default LittleMartian;
