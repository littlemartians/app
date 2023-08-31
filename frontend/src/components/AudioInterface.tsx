import React, { useState, useEffect, useRef } from "react";

const AudioInterface = () => {
  const [listening, setListening] = useState(false);
  const [recording, setRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioURLs, setAudioURLs] = useState([]); // To hold individual audio segments
  const [volume, setVolume] = useState(0);
  const [onThreshold, setOnThreshold] = useState(50);
  const [offThreshold, setOffThreshold] = useState(10);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const isSpeakingRef = useRef(isSpeaking);

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

  const startListening = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const audioContext = new window.AudioContext();
    const source = audioContext.createMediaStreamSource(stream);
    const analyser = audioContext.createAnalyser();
    const processor = audioContext.createScriptProcessor(2048, 1, 1);

    analyser.smoothingTimeConstant = 0.8;
    analyser.fftSize = 1024;

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
      const audioChunks = [];

      recorder.ondataavailable = (e) => {
        audioChunks.push(e.data);
      };

      recorder.onstop = () => {
        setRecording(false);
        const blob = new Blob(audioChunks, { type: "audio/wav" });
        const url = URL.createObjectURL(blob);
        setAudioURLs((prevURLs) => [...prevURLs, url]);
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

  return (
    <>
      {listening ? (
        <button onClick={stopListening}>Stop listening</button>
      ) : (
        <button onClick={startListening}>Listen</button>
      )}
      <div>
        <label>On Threshold:</label>
        <input type="range" min="0" max="100" value={onThreshold} onChange={(e) => setOnThreshold(e.target.value)} />
      </div>
      <div>
        <label>Off Threshold:</label>
        <input type="range" min="0" max="100" value={offThreshold} onChange={(e) => setOffThreshold(e.target.value)} />
      </div>
      <div>Volume: {volume.toFixed(2)}</div>
      <div>Speaking: {isSpeaking.toString()}</div>
      {audioURLs.map((url, index) => (
        <div key={index}>
          <audio controls>
            <source src={url} type="audio/wav" />
            Your browser does not support the audio element.
          </audio>
        </div>
      ))}
    </>
  );
};

export default AudioInterface;
