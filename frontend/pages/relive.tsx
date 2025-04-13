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
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);

  useEffect(() => {
    const fetchMemory = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/relive');
        const data = await res.json();

        // Fix: convert flat array of strings to array of objects
        let processedQuestions: RecallQuestion[] = [];
        const raw = data.recall_questions;
        if (raw && Array.isArray(raw) && raw.length % 3 === 0) {
          for (let i = 0; i < raw.length; i += 3) {
            processedQuestions.push({
              context: raw[i]?.replace('context:', '').trim() || '',
              question: raw[i + 1]?.replace('question:', '').trim() || '',
              answer: raw[i + 2]?.replace('answer:', '').trim() || ''
            });
          }
        }

        setMemory({
          ...data,
          recall_questions: processedQuestions
        });
      } catch (error) {
        console.error('Error fetching memory:', error);
      }
    };

    fetchMemory();
  }, []);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream);
    const chunks: Blob[] = [];

    recorder.ondataavailable = (e) => chunks.push(e.data);
    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'audio/webm' });
      setAudioBlob(blob);
      setAudioURL(URL.createObjectURL(blob));
    };

    setMediaRecorder(recorder);
    recorder.start();
    setIsRecording(true);
  };

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };

  const handleSubmit = async () => {
    if (!audioBlob || !memory) return;

    setUploadStatus('Uploading...');

    const formData = new FormData();
    formData.append('audio', audioBlob, 'response.webm');
    formData.append('questions', JSON.stringify(memory.recall_questions));

    try {
      const res = await fetch('http://localhost:5000/api/evaluate', {
        method: 'POST',
        body: formData
      });

      const result = await res.json();
      console.log(result);
      setUploadStatus('Evaluation complete!');
    } catch (err) {
      console.error('Upload error:', err);
      setUploadStatus('Failed to upload.');
    }
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 rounded-lg shadow-lg">
      {memory ? (
        <>
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold text-gray-900">Memory with {memory.person}</h1>
            <p className="text-sm text-gray-600">{format(parseISO(memory.created_at), 'PPP')}</p>
          </div>

          <div className="space-y-4">
            {memory.recall_questions.map((q, i) => (
              <div key={i} className="p-4 border border-gray-300 rounded-lg bg-white shadow-sm">
                <p className="font-medium text-gray-800">{q.question}</p>
              </div>
            ))}
          </div>

          <div className="space-y-4 mt-6">
            {audioURL ? (
              <audio controls src={audioURL} className="w-full mt-2" />
            ) : null}

            <div className="flex gap-4">
              {isRecording ? (
                <button
                  onClick={stopRecording}
                  className="px-6 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition duration-300"
                >
                  ⏹ Stop Recording
                </button>
              ) : (
                <button
                  onClick={startRecording}
                  className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-300"
                >
                  🎤 Start Answering
                </button>
              )}

              {audioBlob && (
                <button
                  onClick={handleSubmit}
                  className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-300"
                >
                  📤 Submit Response
                </button>
              )}
            </div>

            {uploadStatus && <p className="text-center text-gray-600 mt-4">{uploadStatus}</p>}
          </div>
        </>
      ) : (
        <p className="text-gray-600">Loading memory...</p>
      )}
    </div>
  );
}

// 'use client';

// import { useEffect, useState } from 'react';
// import { format, parseISO } from 'date-fns';

// type RecallQuestion = {
//   context: string;
//   question: string;
//   answer: string;
// };

// type Memory = {
//   title: string;
//   person: string;
//   created_at: string;
//   recall_questions: RecallQuestion[];
// };

// export default function RelivePage() {
//   const [memory, setMemory] = useState<Memory | null>(null);
//   const [recordingIndex, setRecordingIndex] = useState<number | null>(null);
//   const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
//   const [audioURLs, setAudioURLs] = useState<string[]>([]);
//   const [audioBlobs, setAudioBlobs] = useState<(Blob | null)[]>([]);

//   useEffect(() => {
//     const fetchMemory = async () => {
//       try {
//         const res = await fetch('http://localhost:5000/api/relive');
//         const data = await res.json();

//         // Fix: convert flat array of strings to array of objects
//         let processedQuestions: RecallQuestion[] = [];
//         const raw = data.recall_questions;
//         if (raw && Array.isArray(raw) && raw.length % 3 === 0) {
//           for (let i = 0; i < raw.length; i += 3) {
//             processedQuestions.push({
//               context: raw[i]?.replace('context:', '').trim() || '',
//               question: raw[i + 1]?.replace('question:', '').trim() || '',
//               answer: raw[i + 2]?.replace('answer:', '').trim() || ''
//             });
//           }
//         }

//         setMemory({
//           ...data,
//           recall_questions: processedQuestions
//         });
//       } catch (error) {
//         console.error('Error fetching memory:', error);
//       }
//     };

//     fetchMemory();
//   }, []);

//   const startRecording = async (index: number) => {
//     setRecordingIndex(index);

//     const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//     const recorder = new MediaRecorder(stream);

//     const chunks: Blob[] = [];
//     recorder.ondataavailable = (e) => chunks.push(e.data);
//     recorder.onstop = () => {
//       const blob = new Blob(chunks, { type: 'audio/webm' });
//       const audioURL = URL.createObjectURL(blob);

//       setAudioURLs((prev) => {
//         const updated = [...prev];
//         updated[index] = audioURL;
//         return updated;
//       });

//       setAudioBlobs((prev) => {
//         const updated = [...prev];
//         updated[index] = blob;
//         return updated;
//       });
//     };

//     setMediaRecorder(recorder);
//     recorder.start();
//   };

//   const stopRecording = () => {
//     if (mediaRecorder && mediaRecorder.state === 'recording') {
//       mediaRecorder.stop();
//       setRecordingIndex(null);
//     }
//   };

//   const handleSubmitAll = async () => {
//     if (!memory) return;

//     const formData = new FormData();

//     memory.recall_questions.forEach((q, index) => {
//       formData.append('questions', JSON.stringify(q));
//       if (audioBlobs[index]) {
//         formData.append('audios', audioBlobs[index] as Blob, `response-${index}.webm`);
//       }
//     });

//     try {
//       const res = await fetch('http://localhost:5000/api/submit-responses', {
//         method: 'POST',
//         body: formData
//       });

//       const data = await res.json();
//       console.log('Evaluation result:', data);
//       alert('Submitted for evaluation!');
//     } catch (error) {
//       console.error('Submission failed:', error);
//     }
//   };

//   return (
//     <div className="p-6 space-y-6">
//       {memory ? (
//         <>
//           <div className="space-y-1">
//             <h1 className="text-2xl font-bold">Memory with {memory.person}</h1>
//             <p className="text-sm text-gray-600">
//               {format(parseISO(memory.created_at), 'PPPpp')}
//             </p>
//           </div>

//           <div className="space-y-6">
//             {memory.recall_questions && memory.recall_questions.length > 0 ? (
//               memory.recall_questions.map((q, index) => (
//                 <div key={index} className="p-4 border rounded-lg bg-white shadow">
//                   <p className="font-medium mb-1">{q.question}</p>

//                   {audioURLs[index] ? (
//                     <audio controls src={audioURLs[index]} className="mt-2" />
//                   ) : recordingIndex === index ? (
//                     <button
//                       onClick={stopRecording}
//                       className="bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 mt-2 rounded"
//                     >
//                       ⏹ Stop Recording
//                     </button>
//                   ) : (
//                     <button
//                       onClick={() => startRecording(index)}
//                       className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 mt-2 rounded"
//                     >
//                       🎤 Answer
//                     </button>
//                   )}
//                 </div>
//               ))
//             ) : (
//               <p>No recall questions available.</p>
//             )}
//           </div>

//           {audioURLs.length === memory.recall_questions.length &&
//             audioURLs.every(Boolean) && (
//               <button
//                 onClick={handleSubmitAll}
//                 className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded w-full mt-6"
//               >
//                 📤 Submit All Answers
//               </button>
//             )}
//         </>
//       ) : (
//         <p>Loading memory...</p>
//       )}
//     </div>
//   );
// }

// 'use client';

// import { useEffect, useState } from 'react';
// import { format, parseISO } from 'date-fns';

// type RecallQuestion = {
//   context: string;
//   question: string;
//   answer: string;
// };

// type Memory = {
//   title: string;
//   person: string;
//   created_at: string;
//   recall_questions: RecallQuestion[];
// };

// export default function RelivePage() {
//   const [memory, setMemory] = useState<Memory | null>(null);
//   const [recordingIndex, setRecordingIndex] = useState<number | null>(null);
//   const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
//   const [audioURLs, setAudioURLs] = useState<string[]>([]);

//   useEffect(() => {
//     const fetchMemory = async () => {
//       try {
//         const res = await fetch('http://localhost:5000/api/relive');
//         const data = await res.json();

//         // Fix: convert flat array of strings to array of objects
//         let processedQuestions: RecallQuestion[] = [];
//         const raw = data.recall_questions;
//         if (raw && Array.isArray(raw) && raw.length % 3 === 0) {
//           for (let i = 0; i < raw.length; i += 3) {
//             processedQuestions.push({
//               context: raw[i]?.replace('context:', '').trim() || '',
//               question: raw[i + 1]?.replace('question:', '').trim() || '',
//               answer: raw[i + 2]?.replace('answer:', '').trim() || ''
//             });
//           }
//         }

//         setMemory({
//           ...data,
//           recall_questions: processedQuestions
//         });
//       } catch (error) {
//         console.error('Error fetching memory:', error);
//       }
//     };

//     fetchMemory();
//   }, []);

//   const startRecording = async (index: number) => {
//     setRecordingIndex(index);

//     const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//     const recorder = new MediaRecorder(stream);

//     const chunks: Blob[] = [];
//     recorder.ondataavailable = (e) => chunks.push(e.data);
//     recorder.onstop = () => {
//       const blob = new Blob(chunks, { type: 'audio/webm' });
//       const audioURL = URL.createObjectURL(blob);
//       setAudioURLs((prev) => {
//         const updated = [...prev];
//         updated[index] = audioURL;
//         return updated;
//       });
//     };

//     setMediaRecorder(recorder);
//     recorder.start();
//   };

//   const stopRecording = () => {
//     if (mediaRecorder && mediaRecorder.state === 'recording') {
//       mediaRecorder.stop();
//       setRecordingIndex(null);
//     }
//   };

//   return (
//     <div className="p-6 space-y-6">
//       {memory ? (
//         <>
//           <div className="space-y-1">
//             <h1 className="text-2xl font-bold">Memory with {memory.person}</h1>
//             {/* <p className="text-sm text-gray-600">{format(parseISO(memory.created_at), 'PPPpp')}</p> */}
//           </div>

//           <div className="space-y-6">
//             {memory.recall_questions && memory.recall_questions.length > 0 ? (
//               memory.recall_questions.map((q, index) => (
//                 <div key={index} className="p-4 border rounded-lg bg-white shadow">
//                   <p className="font-medium mb-1">{q.question}</p>

//                   {audioURLs[index] ? (
//                     <audio controls src={audioURLs[index]} className="mt-2" />
//                   ) : recordingIndex === index ? (
//                     <button onClick={stopRecording} className="btn mt-2">
//                       ⏹ Stop Recording
//                     </button>
//                   ) : (
//                     <button onClick={() => startRecording(index)} className="btn mt-2">
//                       🎤 Answer
//                     </button>
//                   )}
//                 </div>
//               ))
//             ) : (
//               <p>No recall questions available.</p>
//             )}
//           </div>
//         </>
//       ) : (
//         <p>Loading memory...</p>
//       )}
//     </div>
//   );
// }
