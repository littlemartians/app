import React, { useState, useEffect, useRef } from "react";
import axios from "axios";


const AudioInterface = () => {
  const [listening, setListening] = useState(false);
  const [recording, setRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioURL, setAudioURL] = useState("");
  const [returnAudioUrl, setReturnAudioUrl] = useState("");

  const [volume, setVolume] = useState(0);
  const [smoothingTimeConstant, setSmoothingTimeConstant] = useState(0.8);
  const [onThreshold, setOnThreshold] = useState(50);
  const [offThreshold, setOffThreshold] = useState(10);
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  const isSpeakingRef = useRef(isSpeaking);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const audioBlobRef = useRef<Blob | null>(null);

  useEffect(() => {
    isSpeakingRef.current = isSpeaking;
  }, [isSpeaking]);

  useEffect(() => {
    if (listening && isSpeaking) {
      startRecording();
    } else if (!isSpeaking && recording) {
      stopRecording();
    }
  }, [listening, isSpeaking]);

  useEffect(() => {
    if (analyserRef.current) {
      analyserRef.current.smoothingTimeConstant = smoothingTimeConstant;
    }
  }, [smoothingTimeConstant]);

  const startListening = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const audioContext = new window.AudioContext();
    const source = audioContext.createMediaStreamSource(stream);
    const analyser = audioContext.createAnalyser();
    const processor = audioContext.createScriptProcessor(2048, 1, 1);

    analyser.smoothingTimeConstant = 0.8;
    analyser.fftSize = 1024;
    analyserRef.current = analyser; 

    source.connect(analyser);
    analyser.connect(processor);
    processor.connect(audioContext.destination);

    processor.onaudioprocess = function (e) {
      const array = new Uint8Array(analyser.frequencyBinCount);
      analyser.getByteFrequencyData(array);
      let values = 0;
      const length = array.length;

      for (let i = 0; i < length; i++) {
        values += array[i];
      }

      const average = values / length;
      setVolume(average);

      if (average > onThreshold && !isSpeakingRef.current) {
        setIsSpeaking(true);
      } else if (average < offThreshold && isSpeakingRef.current) {
        setIsSpeaking(false);
      }
    };

    setListening(true);
  };

  const stopListening = () => {
    if (recording) {
      stopRecording();
    }
    setListening(false);
  };

  const startRecording = () => {
    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      const recorder = new MediaRecorder(stream);
      const audioChunks = [] as Blob[];

      recorder.ondataavailable = (e) => {
        audioChunks.push(e.data);
      };

      recorder.onstop = () => {
        setRecording(false);
        const blob = new Blob(audioChunks, { type: "audio/wav" });
        const url = URL.createObjectURL(blob);
        audioBlobRef.current = blob;
        setAudioURL(url);
      };

      recorder.onstart = () => {
        setRecording(true);
      };

      recorder.start();
      setMediaRecorder(recorder);
    });
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
    }
  };

  const sendAudio = async () => {
    // const data = new FormData();
    // data.append("file", audioBlobRef.current as Blob);    
    // data.append("model", "whisper-1");
    // data.append("language", "en");
    // // data.append("martian", "nebulana");
    // console.log("SEND AUDIO!")
    // const response = await fetch("/api/speak", {
    //   method: "POST",
    //   body: data,
    // });

    // const result = await response.json();
    // console.log(result);

    const data = new FormData();
    data.append("file", audioBlobRef.current as Blob);
    data.append("model", "whisper-1");
    data.append("language", "en");
    data.append("martian", "nebulana");
    console.log("SEND AUDIO!");

    try {
      const response = await axios.post("/api/speak", data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      // const result = response.data;
      // console.log(result);
      
      const { audio } = response.data;
      const blob = new Blob([new Uint8Array(Buffer.from(audio, 'base64').buffer)], { type: 'audio/mpeg' });
      const returnAudioUrl = URL.createObjectURL(blob);
      setReturnAudioUrl(returnAudioUrl);


    } catch (error) {
      console.error("An error occurred:", error);
    }





    // textBufferRef.current = [...textBufferRef.current.slice(-4), result.text];

    // const prompt = `${task_description}\n\n${textBufferRef.current.join("\n")}.\n\nNow describe the image.`;
    // promptBufferRef.current = prompt;
    
    // setLastResult(result.text)
    // setSendingAudio(false);

    // if (!sdReady) {
    //   setSdReady(true);
    // }
  };


  return (
    <>
      {listening ? (
        <button onClick={stopListening}>Stop listening</button>
      ) : (
        <button onClick={startListening}>Listen</button>
      )}       
      <button onClick={sendAudio}>Send Audio</button>
      <div>
        <label>Vol Smooth&nbsp;&nbsp;&nbsp;&nbsp;:</label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={smoothingTimeConstant}
          onChange={(e) => setSmoothingTimeConstant(parseFloat(e.target.value))}
          style={{ width: "50%" }}
        />
        {smoothingTimeConstant}
      </div>
      <div>
        <label>On Threshold:</label>
        <input 
          type="range" 
          min="0" 
          max="100" 
          value={onThreshold} 
          onChange={(e) => setOnThreshold(parseFloat(e.target.value))} 
          style={{ width: "50%" }} 
        />
        {onThreshold}
      </div>
      <div>
        <label>Off Threshold:</label>
        <input 
          type="range" 
          min="0" 
          max="100" 
          value={offThreshold} 
          onChange={(e) => setOffThreshold(parseFloat(e.target.value))} 
          style={{ width: "50%" }} 
        />
        {offThreshold}
      </div>
      <div>
        <label>Volume&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:</label>
        <input
          type="range"
          min="0"
          max="100"
          step="0.01"
          value={volume}
          readOnly
          style={{ width: "50%" }}
        />
        {volume.toFixed(2)}
      </div>
      <div>Speaking: {isSpeaking.toString()}</div>
      <div>
        {audioURL && <audio controls key={audioURL}>
          <source src={audioURL} type="audio/wav" />
          Your browser does not support the audio element.
        </audio>}
        {returnAudioUrl && <audio controls key={returnAudioUrl}>
          <source src={returnAudioUrl} type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>}

      </div>
    </>
  );
};

export default AudioInterface;
