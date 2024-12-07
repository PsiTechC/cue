// import React, { useState } from "react";
// import axios from "axios";

// const AutoSubtitling = () => {
//   const [file, setFile] = useState(null);
//   const [language, setLanguage] = useState("en-US");
//   const [transcription, setTranscription] = useState("");
//   const [isProcessing, setIsProcessing] = useState(false);
//   const [filePath, setFilePath] = useState("");

//   const handleFileChange = (e) => {
//     setFile(e.target.files[0]);
//   };

//   const handleUpload = async () => {
//     if (!file) {
//       alert("Please upload a file first!");
//       return;
//     }
//     const formData = new FormData();
//     formData.append("file", file);
//     try {
//       const response = await axios.post("http://127.0.0.1:5002/upload", formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });
//       setFilePath(response.data.file_path);
//       alert("File uploaded successfully!");
//     } catch (error) {
//       console.error("Error uploading file:", error);
//     }
//   };

//   const handleStartProcessing = async () => {
//     if (!filePath) {
//       alert("Please upload the file first.");
//       return;
//     }
//     setIsProcessing(true);
//     setTranscription("");
//     try {
//       await axios.post("http://127.0.0.1:5002/process_audio", {
//         file_path: filePath,
//         language_code: language,
//       });
//       fetchTranscription();
//     } catch (error) {
//       console.error("Error starting transcription:", error);
//     }
//   };

//   const handleStopProcessing = () => {
//     setIsProcessing(false);
//     alert("Stopped processing (no actual stop function).");
//   };

//   const fetchTranscription = async () => {
//     try {
//       const response = await axios.get("http://127.0.0.1:5002/get_transcription");
//       const transcriptionText = response.data.transcription.join("\n\n");
//       const vttOutput = generateVTTFormat(transcriptionText);
//       setTranscription(vttOutput);
//       setIsProcessing(false);
//     } catch (error) {
//       console.error("Error fetching transcription:", error);
//     }
//   };

//   const generateVTTFormat = (text) => {
//     let startTime = 0;
//     const duration = 2;
//     const lines = text.split("\n");
//     let vttOutput = "\n\n";
//     lines.forEach((line, index) => {
//       const endTime = startTime + duration;
//       vttOutput += `${formatTime(startTime)} --> ${formatTime(endTime)}\n${line}\n\n`;
//       startTime = endTime;
//     });
//     return vttOutput;
//   };

//   const formatTime = (seconds) => {
//     const date = new Date(0);
//     date.setSeconds(seconds);
//     return date.toISOString().substr(11, 12);
//   };

//   const handleDownload = () => {
//     const blob = new Blob([transcription], { type: "text/vtt" });
//     const url = URL.createObjectURL(blob);
//     const link = document.createElement("a");
//     link.href = url;
//     link.download = "transcription.vtt";
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   return (
//     <div className="text-white" style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif' }}>
//       <div className="p-5 flex justify-between items-center border-b border-[#2E2E2E]">
//         <h2 className="text-xl font-normal text-center flex-grow">Auto Subtitling</h2>
//       </div>
//       <div className="p-4">
//         <div className="mb-4">
//           <input type="file" accept=".mp3,.wav" onChange={handleFileChange} className="text-gray-400" />
//           <button onClick={handleUpload} className="ml-2 bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded">
//             Upload Audio
//           </button>
//         </div>
//         <div className="mb-4">
//           <label className="text-gray-400">Language:</label>
//           <select
//             value={language}
//             onChange={(e) => setLanguage(e.target.value)}
//             className="ml-2 bg-gray-800 text-white py-1 px-2 rounded"
//           >
//             <option value="en-US">English (US)</option>
//             <option value="hi-IN">Hindi (India)</option>
//             <option value="es-ES">Spanish (Spain)</option>
//             {/* Add more languages as needed */}
//           </select>
//         </div>
//         <div className="mb-4">
//           <button
//             onClick={handleStartProcessing}
//             disabled={isProcessing}
//             className="bg-green-600 hover:bg-green-700 text-white py-1 px-3 rounded mr-2"
//           >
//             Start Processing
//           </button>
//           <button onClick={handleStopProcessing} className="bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded">
//             Stop Processing
//           </button>
//         </div>
//         <div className="mb-4">
//           <textarea
//             value={transcription}
//             readOnly
//             placeholder="Transcription output will appear here"
//             rows="10"
//             className="w-full bg-gray-900 text-gray-300 p-2 rounded"
//           ></textarea>
//         </div>
//         <div>
//           <button
//             onClick={handleDownload}
//             disabled={!transcription}
//             className="bg-purple-600 hover:bg-purple-700 text-white py-1 px-3 rounded"
//           >
//             Download Transcription (VTT)
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AutoSubtitling;


// import React, { useState } from "react";
// import axios from "axios";

// const AutoSubtitling = () => {
//   const [file, setFile] = useState(null);
//   const [language, setLanguage] = useState("en-US");
//   const [transcription, setTranscription] = useState("");
//   const [isProcessing, setIsProcessing] = useState(false);
//   const [filePath, setFilePath] = useState("");

//   const handleFileChange = (e) => {
//     setFile(e.target.files[0]);
//   };

//   const handleUpload = async () => {
//     if (!file) {
//       alert("Please upload a file first!");
//       return;
//     }
//     const formData = new FormData();
//     formData.append("file", file);
//     try {
//       const response = await axios.post("http://127.0.0.1:5002/upload", formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });
//       setFilePath(response.data.file_path);
//       alert("File uploaded successfully!");
//     } catch (error) {
//       console.error("Error uploading file:", error);
//     }
//   };

//   const handleStartProcessing = async () => {
//     if (!filePath) {
//       alert("Please upload the file first.");
//       return;
//     }
//     setIsProcessing(true);
//     setTranscription("");
//     try {
//       await axios.post("http://127.0.0.1:5002/process_audio", {
//         file_path: filePath,
//         language_code: language,
//       });
//       fetchTranscription();
//     } catch (error) {
//       console.error("Error starting transcription:", error);
//     }
//   };

//   const handleStopProcessing = () => {
//     setIsProcessing(false);
//     alert("Stopped processing (no actual stop function).");
//   };

//   const fetchTranscription = async () => {
//     try {
//       const response = await axios.get("http://127.0.0.1:5002/get_transcription");
//       const transcriptionText = response.data.transcription.join("\n");
//       setTranscription(transcriptionText); // No need to call generateVTTFormat here if backend already provides it
//       setIsProcessing(false);
//     } catch (error) {
//       console.error("Error fetching transcription:", error);
//     }
//   };


//   const generateVTTFormat = (text) => {
//     let startTime = 0;
//     const duration = 2;
//     const lines = text.split("\n");
//     let vttOutput = "WEBVTT\n\n";
//     lines.forEach((line, index) => {
//       const endTime = startTime + duration;
//       vttOutput += `${formatTime(startTime)} --> ${formatTime(endTime)}\n${line}\n\n`;
//       startTime = endTime;
//     });
//     return vttOutput;
//   };

//   const formatTime = (seconds) => {
//     const date = new Date(0);
//     date.setSeconds(seconds);
//     return date.toISOString().substr(11, 12);
//   };

//   const handleDownload = () => {
//     const blob = new Blob([transcription], { type: "text/vtt" });
//     const url = URL.createObjectURL(blob);
//     const link = document.createElement("a");
//     link.href = url;
//     link.download = "transcription.vtt";
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   const handleTranscriptionChange = (e) => {
//     setTranscription(e.target.value); // Update transcription state on edit
//   };

//   return (
//     <div className="text-white" style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif' }}>
//       <div className="p-5 flex justify-between items-center border-b border-[#2E2E2E]">
//         <h2 className="text-xl font-normal text-center flex-grow">Auto Subtitling</h2>
//       </div>
//       <div className="p-4">
//         <div className="mb-4">
//           <input type="file" accept=".mp3,.wav" onChange={handleFileChange} className="text-gray-400" />
//           <button onClick={handleUpload} className="ml-2 bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded">
//             Upload Audio
//           </button>
//         </div>
//         <div className="mb-4">
//           <label className="text-gray-400">Language:</label>
//           <select
//             value={language}
//             onChange={(e) => setLanguage(e.target.value)}
//             className="ml-2 bg-gray-800 text-white py-1 px-2 rounded"
//           >
//             <option value="en-US">English (US)</option>
//             <option value="hi-IN">Hindi (India)</option>
//             <option value="es-ES">Spanish (Spain)</option>
//             {/* Add more languages as needed */}
//           </select>
//         </div>
//         <div className="mb-4">
//           <button
//             onClick={handleStartProcessing}
//             disabled={isProcessing}
//             className="bg-green-600 hover:bg-green-700 text-white py-1 px-3 rounded mr-2"
//           >
//             Start Processing
//           </button>
//           <button onClick={handleStopProcessing} className="bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded">
//             Stop Processing
//           </button>
//         </div>
//         <div className="mb-4">
//           <textarea
//             value={transcription}
//             onChange={handleTranscriptionChange} // Allow editing of transcription
//             placeholder="Transcription output will appear here"
//             rows="10"
//             className="w-full bg-gray-900 text-gray-300 p-2 rounded"
//           ></textarea>
//         </div>
//         <div>
//           <button
//             onClick={handleDownload}
//             disabled={!transcription}
//             className="bg-purple-600 hover:bg-purple-700 text-white py-1 px-3 rounded"
//           >
//             Download Transcription (VTT)
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AutoSubtitling;


// import React, { useState } from "react";
// import axios from "axios";

// const AutoSubtitling = () => {
//   const [file, setFile] = useState(null);
//   const [language, setLanguage] = useState("en-US");
//   const [transcription, setTranscription] = useState("");
//   const [isProcessing, setIsProcessing] = useState(false);
//   const [filePath, setFilePath] = useState("");

//   const handleFileChange = (e) => {
//     setFile(e.target.files[0]);
//   };

//   const handleUpload = async () => {
//     if (!file) {
//       alert("Please upload a file first!");
//       return;
//     }
//     const formData = new FormData();
//     formData.append("file", file);
//     try {
//       const response = await axios.post("http://127.0.0.1:5002/upload", formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });
//       setFilePath(response.data.file_path);
//       alert("File uploaded successfully!");
//     } catch (error) {
//       console.error("Error uploading file:", error);
//     }
//   };

//   const handleStartProcessing = async () => {
//     if (!filePath) {
//       alert("Please upload the file first.");
//       return;
//     }
//     setIsProcessing(true);
//     setTranscription("");
//     try {
//       await axios.post("http://127.0.0.1:5002/process_audio", {
//         file_path: filePath,
//         language,  // Send language directly as `language` key for backend compatibility
//       });
//       fetchTranscription();
//     } catch (error) {
//       console.error("Error starting transcription:", error);
//     }
//   };

//   const handleStopProcessing = () => {
//     setIsProcessing(false);
//     alert("Stopped processing (no actual stop function).");
//   };

//   const fetchTranscription = async () => {
//     try {
//       const response = await axios.get("http://127.0.0.1:5002/get_transcription");
//       const transcriptionText = response.data.transcription.join("\n");
//       setTranscription(transcriptionText);
//       setIsProcessing(false);
//     } catch (error) {
//       console.error("Error fetching transcription:", error);
//     }
//   };

//   const generateVTTFormat = (text) => {
//     let startTime = 0;
//     const duration = 2;
//     const lines = text.split("\n");
//     let vttOutput = "WEBVTT\n\n";
//     lines.forEach((line, index) => {
//       const endTime = startTime + duration;
//       vttOutput += `${formatTime(startTime)} --> ${formatTime(endTime)}\n${line}\n\n`;
//       startTime = endTime;
//     });
//     return vttOutput;
//   };

//   const formatTime = (seconds) => {
//     const date = new Date(0);
//     date.setSeconds(seconds);
//     return date.toISOString().substr(11, 12);
//   };

//   const handleDownload = () => {
//     const blob = new Blob([transcription], { type: "text/vtt" });
//     const url = URL.createObjectURL(blob);
//     const link = document.createElement("a");
//     link.href = url;
//     link.download = "transcription.vtt";
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   const handleTranscriptionChange = (e) => {
//     setTranscription(e.target.value);
//   };

//   return (
//     <div className="text-white" style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif' }}>
//       <div className="p-5 flex justify-between items-center border-b border-[#2E2E2E]">
//         <h2 className="text-xl font-normal text-center flex-grow">Auto Subtitling</h2>
//       </div>
//       <div className="p-4">
//         <div className="mb-4">
//           <input type="file" accept=".mp3,.wav" onChange={handleFileChange} className="text-gray-400" />
//           <button onClick={handleUpload} className="ml-2 bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded">
//             Upload Audio
//           </button>
//         </div>
//         <div className="mb-4">
//           <label className="text-gray-400">Language:</label>
//           <select
//             value={language}
//             onChange={(e) => setLanguage(e.target.value)}
//             className="ml-2 bg-gray-800 text-white py-1 px-2 rounded"
//           >
//             <option value="en">English (US)</option>
//             <option value="hi-IN">Hindi (India)</option>
//             <option value="es">Spanish (Spain)</option>

//           </select>
//         </div>
//         <div className="mb-4">
//           <button
//             onClick={handleStartProcessing}
//             disabled={isProcessing}
//             className="bg-green-600 hover:bg-green-700 text-white py-1 px-3 rounded mr-2"
//           >
//             Start Processing
//           </button>
//           <button onClick={handleStopProcessing} className="bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded">
//             Stop Processing
//           </button>
//         </div>
//         <div className="mb-4">
//           <textarea
//             value={transcription}
//             onChange={handleTranscriptionChange}
//             placeholder="Transcription output will appear here"
//             rows="10"
//             className="w-full bg-gray-900 text-gray-300 p-2 rounded"
//           ></textarea>
//         </div>
//         <div>
//           <button
//             onClick={handleDownload}
//             disabled={!transcription}
//             className="bg-purple-600 hover:bg-purple-700 text-white py-1 px-3 rounded"
//           >
//             Download Transcription (VTT)
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AutoSubtitling;


// import React, { useState } from "react";
// import axios from "axios";
// import Alert from "./Alert";

// const AutoSubtitling = () => {
//   const [file, setFile] = useState(null);
//   const [language, setLanguage] = useState("en-US");
//   const [transcription, setTranscription] = useState("");
//   const [isProcessing, setIsProcessing] = useState(false);
//   const [filePath, setFilePath] = useState("");
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [alertMessage, setAlertMessage] = useState("");
//   const [alertType, setAlertType] = useState("");
//   const [alertVisible, setAlertVisible] = useState(false);

//   const handleFileChange = (e) => {
//     setFile(e.target.files[0]);
//   };

//   const handleUpload = async () => {
//     if (!file) {
//       setAlertMessage("Please choose a file first!");
//       setAlertType("error");
//       setAlertVisible(true);
//       setTimeout(() => setAlertVisible(false), 5000);
//       return;
//     }
//     const formData = new FormData();
//     formData.append("file", file);
//     try {
//       const response = await axios.post("http://127.0.0.1:5002/upload", formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });
//       setFilePath(response.data.file_path);
//       setAlertMessage("File uploaded successfully!");
//       setAlertType("success");
//       setAlertVisible(true);
//       setTimeout(() => setAlertVisible(false), 5000);
//       setIsModalOpen(false);
//     } catch (error) {
//       console.error("Error uploading file:", error);
//       setAlertMessage("Failed to upload file.");
//       setAlertType("error");
//       setAlertVisible(true);
//       setTimeout(() => setAlertVisible(false), 5000);
//     }
//   };

//   const handleStartProcessing = async () => {
//     if (!filePath) {
//       setAlertMessage("Please upload the file first.");
//       setAlertType("error");
//       setAlertVisible(true);
//       setTimeout(() => setAlertVisible(false), 5000);
//       return;
//     }
//     setIsProcessing(true);
//     setTranscription("");
//     try {
//       await axios.post("http://127.0.0.1:5002/process_audio", {
//         file_path: filePath,
//         language,
//       });
//       fetchTranscription();
//     } catch (error) {
//       console.error("Error starting transcription:", error);
//     }
//   };

//   const handleStopProcessing = () => {
//     setIsProcessing(false);
//     setAlertMessage("Stopped processing.");
//     setAlertType("warning");
//     setAlertVisible(true);
//     setTimeout(() => setAlertVisible(false), 5000);
//   };

//   const fetchTranscription = async () => {
//     try {
//       const response = await axios.get("http://127.0.0.1:5002/get_transcription");
//       const transcriptionText = response.data.transcription.join("\n");
//       setTranscription(transcriptionText);
//       setIsProcessing(false);
//     } catch (error) {
//       console.error("Error fetching transcription:", error);
//     }
//   };

//   const handleDownload = () => {
//     const blob = new Blob([transcription], { type: "text/vtt" });
//     const url = URL.createObjectURL(blob);
//     const link = document.createElement("a");
//     link.href = url;
//     link.download = "transcription.vtt";
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   return (
//     <div className="text-white" style={{ fontFamily: "Helvetica Neue, Arial, sans-serif" }}>
//       <div className="p-5 flex justify-between items-center border-b border-[#2E2E2E]">
//         <h2 className="text-xl font-normal text-center flex-grow">Auto Subtitling</h2>
//       </div>
//       <div className="p-4">
//         <div className="mb-4">
//           <button
//             onClick={() => setIsModalOpen(true)}
//             className="bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded"
//           >
//             Upload Audio
//           </button>
//         </div>
//         <div className="mb-4">
//           <button
//             onClick={handleStartProcessing}
//             disabled={isProcessing}
//             className="bg-green-600 hover:bg-green-700 text-white py-1 px-3 rounded mr-2"
//           >
//             Start Process
//           </button>
//           {/* <button onClick={handleStopProcessing} className="bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded">
//             Stop Processing
//           </button> */}
//         </div>
//         <div className="mb-4">
//           <textarea
//             value={transcription}
//             onChange={(e) => setTranscription(e.target.value)}
//             placeholder="Transcription output will appear here"
//             rows="10"
//             className="w-full bg-gray-900 text-gray-300 p-2 rounded"
//           ></textarea>
//         </div>
//         <div>
//           <button
//             onClick={handleDownload}
//             disabled={!transcription}
//             className="bg-purple-600 hover:bg-purple-700 text-white py-1 px-3 rounded"
//           >
//             Download Transcription (VTT)
//           </button>
//         </div>
//       </div>

//       {/* Modal */}
//       {isModalOpen && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
//           <div className="bg-gray-800 p-6 rounded-md max-w-sm w-full">
//             <h2 className="text-xl font-semibold text-white mb-4">Upload Audio</h2>
//             <input type="file" accept=".mp3,.wav" onChange={handleFileChange} className="w-full mb-4 text-gray-300" />
//             <label className="text-white block mb-2">Select Language:</label>
//             <select
//               value={language}
//               onChange={(e) => setLanguage(e.target.value)}
//               className="w-full mb-4 bg-gray-900 text-white py-2 px-3 rounded"
//             >
//               <option value="en-US">English (US)</option>
//               {/* <option value="hi-IN">Hindi (India)</option>
//               <option value="es">Spanish (Spain)</option> */}
//             </select>
//             <div className="flex justify-end">
//               <button
//                 onClick={handleUpload}
//                 className="bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded mr-2"
//               >
//                 Upload
//               </button>
//               <button
//                 onClick={() => setIsModalOpen(false)}
//                 className="bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded"
//               >
//                 Cancel
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Alerts */}
//       <Alert message={alertMessage} type={alertType} visible={alertVisible} setVisible={setAlertVisible} />
//     </div>
//   );
// };

// export default AutoSubtitling;




// import React, { useState } from "react";
// import axios from "axios";
// import Alert from "./Alert";

// const AutoSubtitling = () => {
//   const [file, setFile] = useState(null);
//   const [language, setLanguage] = useState("en-US");
//   const [transcription, setTranscription] = useState("");
//   const [isProcessing, setIsProcessing] = useState(false);
//   const [filePath, setFilePath] = useState("");
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [alertMessage, setAlertMessage] = useState("");
//   const [alertType, setAlertType] = useState("");
//   const [alertVisible, setAlertVisible] = useState(false);

//   const handleFileChange = (e) => {
//     setFile(e.target.files[0]);
//   };

//   const handleUpload = async () => {
//     if (!file) {
//       setAlertMessage("Please choose a file first!");
//       setAlertType("error");
//       setAlertVisible(true);
//       setTimeout(() => setAlertVisible(false), 5000);
//       return;
//     }
//     const formData = new FormData();
//     formData.append("file", file);
//     try {
//       const response = await axios.post("http://127.0.0.1:5002/upload", formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });
//       setFilePath(response.data.file_path);
//       setAlertMessage("File uploaded successfully!");
//       setAlertType("success");
//       setAlertVisible(true);
//       setTimeout(() => setAlertVisible(false), 5000);
//       setIsModalOpen(false);
//     } catch (error) {
//       console.error("Error uploading file:", error);
//       setAlertMessage("Failed to upload file.");
//       setAlertType("error");
//       setAlertVisible(true);
//       setTimeout(() => setAlertVisible(false), 5000);
//     }
//   };

//   const handleStartProcessing = async () => {
//     if (!filePath) {
//       setAlertMessage("Please upload the file first.");
//       setAlertType("error");
//       setAlertVisible(true);
//       setTimeout(() => setAlertVisible(false), 5000);
//       return;
//     }
//     setIsProcessing(true);
//     setTranscription("");
//     try {
//       await axios.post("http://127.0.0.1:5002/process_audio", {
//         file_path: filePath,
//         language,
//       });
//       fetchTranscription();
//     } catch (error) {
//       console.error("Error starting transcription:", error);
//     }
//   };

//   const fetchTranscription = async () => {
//     try {
//       const response = await axios.get("http://127.0.0.1:5002/get_transcription");
//       const transcriptionText = response.data.transcription.join("\n");
//       setTranscription(transcriptionText);
//       setIsProcessing(false);
//     } catch (error) {
//       console.error("Error fetching transcription:", error);
//     }
//   };

//   const handleDownload = () => {
//     const blob = new Blob([transcription], { type: "text/vtt" });
//     const url = URL.createObjectURL(blob);
//     const link = document.createElement("a");
//     link.href = url;
//     link.download = "transcription.vtt";
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   return (
//     <div className="text-white" style={{ fontFamily: "Helvetica Neue, Arial, sans-serif" }}>
//       <div className="p-5 flex justify-between items-center border-b border-[#2E2E2E]">
//         <h2 className="text-xl font-normal text-center flex-grow">Auto Subtitling</h2>
//       </div>
//       <div className="p-4">
//         <div className="mb-4 flex space-x-4">
//           {/* Upload Audio Button */}
//           <button
//             onClick={() => setIsModalOpen(true)}
//             className="bg-[#28603D] hover:bg-[#417155] text-white py-2 px-4 rounded-md text-sm"
//           >
//             Upload Audio
//           </button>
//           {/* Start Process Button */}
//           <button
//             onClick={handleStartProcessing}
//             disabled={isProcessing}
//             className="bg-[#28603D] hover:bg-[#417155] text-white py-2 px-4 rounded-md text-sm"
//           >
//             Start Process
//           </button>
//         </div>
//         <div className="mb-4">
//           <textarea
//             value={transcription}
//             onChange={(e) => setTranscription(e.target.value)}
//             placeholder="Transcription output will appear here"
//             rows="10"
//             className="w-full bg-gray-900 text-gray-300 p-2 rounded"
//           ></textarea>
//         </div>
//         <div>
//           <button
//             onClick={handleDownload}
//             disabled={!transcription}
//             className="bg-purple-600 hover:bg-purple-700 text-white py-1 px-3 rounded"
//           >
//             Download Transcription (VTT)
//           </button>
//         </div>
//       </div>

//       {/* Modal */}
//       {isModalOpen && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
//           <div className="bg-gray-800 p-6 rounded-md max-w-sm w-full">
//             <h2 className="text-xl font-semibold text-white mb-4">Upload Audio</h2>
//             <input type="file" accept=".mp3,.wav" onChange={handleFileChange} className="w-full mb-4 text-gray-300" />
//             <label className="text-white block mb-2">Select Language:</label>
//             <select
//               value={language}
//               onChange={(e) => setLanguage(e.target.value)}
//               className="w-full mb-4 bg-gray-900 text-white py-2 px-3 rounded"
//             >
//               <option value="en-US">English (US)</option>
//               <option value="hi-IN">Hindi (India)</option>
//               <option value="es">Spanish (Spain)</option>
//             </select>
//             <div className="flex justify-end">
//               <button
//                 onClick={handleUpload}
//                 className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded mr-2"
//               >
//                 Upload
//               </button>
//               <button
//                 onClick={() => setIsModalOpen(false)}
//                 className="bg-red-600 hover:bg-red-700 text-white py-2 px-3 rounded"
//               >
//                 Cancel
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Alerts */}
//       <Alert message={alertMessage} type={alertType} visible={alertVisible} setVisible={setAlertVisible} />
//     </div>
//   );
// };

// export default AutoSubtitling;


import React, { useState } from "react";
import axios from "axios";
import Alert from "./Alert";

const AutoSubtitling = () => {
  const [file, setFile] = useState(null);
  const [language, setLanguage] = useState("en-US");
  const [transcription, setTranscription] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [filePath, setFilePath] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("");
  const [alertVisible, setAlertVisible] = useState(false);

  const PYTHON_API_BASE = process.env.REACT_APP_API_BASE_URL_P;

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      setAlertMessage("Please choose a file first!");
      setAlertType("error");
      setAlertVisible(true);
      setTimeout(() => setAlertVisible(false), 5000);
      return;
    }
    const formData = new FormData();
    formData.append("file", file);
    try {
      const response = await axios.post(`${PYTHON_API_BASE}/uploads`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setFilePath(response.data.file_path);
      setAlertMessage("File uploaded successfully!");
      setAlertType("success");
      setAlertVisible(true);
      setTimeout(() => setAlertVisible(false), 5000);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error uploading file:", error);
      setAlertMessage("Failed to upload file.");
      setAlertType("error");
      setAlertVisible(true);
      setTimeout(() => setAlertVisible(false), 5000);
    }
  };

  const handleStartProcessing = async () => {
    if (!filePath) {
      setAlertMessage("Please upload the file first.");
      setAlertType("error");
      setAlertVisible(true);
      setTimeout(() => setAlertVisible(false), 5000);
      return;
    }
    setIsProcessing(true);
    setTranscription("");
    try {
      await axios.post(`${PYTHON_API_BASE}/process_audio`, {
        file_path: filePath,
        language,
      });
      fetchTranscription();
    } catch (error) {
      console.error("Error starting transcription:", error);
      setIsProcessing(false);
    }
  };

  const fetchTranscription = async () => {
    try {
      const response = await axios.get(`${PYTHON_API_BASE}/get_transcription`);
      const transcriptionText = response.data.transcription.join("\n");
      setTranscription(transcriptionText);
      setIsProcessing(false);
    } catch (error) {
      console.error("Error fetching transcription:", error);
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([transcription], { type: "text/vtt" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "transcription.vtt";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="text-white" style={{ fontFamily: "Helvetica Neue, Arial, sans-serif" }}>
      <div className="p-5 flex justify-between items-center border-b border-[#2E2E2E] bg-[#1E1E1E]">
        <h2 className="text-xl font-normal text-center flex-grow">Auto Subtitling</h2>
      </div>
      <div className="p-4">
        <div className="mb-4 flex space-x-4">
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-[#28603D] hover:bg-[#417155] text-white py-2 px-4 rounded-md text-sm"
          >
            Upload Audio
          </button>
          <button
            onClick={handleStartProcessing}
            disabled={isProcessing}
            className="bg-[#28603D] hover:bg-[#417155] text-white py-2 px-4 rounded-md text-sm"
          >
            Start Process
          </button>
        </div>
        <div className="mb-4">
          <textarea
            value={transcription}
            onChange={(e) => setTranscription(e.target.value)}
            placeholder="Subtitles will appear here..."
            rows="10"
            className="w-full bg-[fcfcfc] text-black p-2 rounded"
          ></textarea>
        </div>
        <div>
          <button
            onClick={handleDownload}
            disabled={!transcription}
            className="bg-[#669de3] hover:bg-[#9dc1f5] text-white py-2 px-4 rounded-md transition-all transform text-sm"
          >
            Download Transcription (VTT)
          </button>
        </div>
      </div>
      {isProcessing && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-5 fixed-loader-container">
          <div className="loader"></div>
        </div>
      )}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-gray-800 p-6 rounded-md max-w-sm w-full">
            <h2 className="text-xl font-semibold text-white mb-4">Upload Audio</h2>
            <input type="file" accept=".mp3,.wav" onChange={handleFileChange} className="w-full mb-4 text-gray-300" />
            <label className="text-white block mb-2">Select Language:</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full mb-4 bg-gray-900 text-white py-2 px-3 rounded"
            >
              <option value="en-US">English (US)</option>
              <option value="hi-IN">Hindi (India)</option>
              <option value="es">Spanish (Spain)</option>
            </select>
            <div className="flex justify-end">
              <button
                onClick={handleUpload}
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded mr-2 text-sm"
              >
                Upload
              </button>
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-red-600 hover:bg-red-700 text-white py-2 px-3 rounded text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      <Alert message={alertMessage} type={alertType} visible={alertVisible} setVisible={setAlertVisible} />
    </div>
  );
};

export default AutoSubtitling;
