'use client';

import { useEffect, useState } from 'react';
import { format, parseISO } from 'date-fns';

type RecallQuestion = {
  context: string;
  question: string;
  answer: string;
};

type Memory = {
  title: string;
  person: string;
  created_at: string;
  recall_questions: RecallQuestion[];
};

export default function RelivePage() {
  const [memory, setMemory] = useState<Memory | null>(null);
  const [recordingIndex, setRecordingIndex] = useState<number | null>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioURLs, setAudioURLs] = useState<string[]>([]);

  useEffect(() => {
    const fetchMemory = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/relive');
        const data = await res.json();
        setMemory(data);
      } catch (error) {
        console.error('Error fetching memory:', error);
      }
    };

    fetchMemory();
  }, []);

  const startRecording = async (index: number) => {
    setRecordingIndex(index);

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream);

    const chunks: Blob[] = [];
    recorder.ondataavailable = (e) => chunks.push(e.data);
    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'audio/webm' });
      const audioURL = URL.createObjectURL(blob);
      setAudioURLs((prev) => {
        const updated = [...prev];
        updated[index] = audioURL;
        return updated;
      });
    };

    setMediaRecorder(recorder);
    recorder.start();
  };

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
      mediaRecorder.stop();
      setRecordingIndex(null);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {memory ? (
        <>
          <div className="space-y-1">
            <h1 className="text-2xl font-bold">Memory with {memory.person}</h1>
            {/* <p className="text-sm text-gray-600">{format(parseISO(memory.created_at), 'PPPpp')}</p> */}
          </div>

          <div className="space-y-6">
            {memory && memory.recall_questions && memory.recall_questions.length > 0 ? (
                memory.recall_questions.map((q, index) => (
            <div key={index} className="p-4 border rounded-lg bg-white shadow">
             <p className="font-medium mb-1">{q.question}</p>

            {audioURLs[index] ? (
                <audio controls src={audioURLs[index]} className="mt-2" />
            ) : recordingIndex === index ? (
            <button onClick={stopRecording} className="btn mt-2">⏹ Stop Recording</button>
            ) : (
            <button onClick={() => startRecording(index)} className="btn mt-2">🎤 Answer</button>
            )}
      </div>
    ))
  ) : (
    <p>No recall questions available.</p>
  )}
</div>
        </>
      ) : (
        <p>Loading memory...</p>
      )}
    </div>
  );
}
