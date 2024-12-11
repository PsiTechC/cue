
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CSVLink } from 'react-csv';
import { useNavigate } from 'react-router-dom';
import Alert from './Alert';
import eLogo from '../Assets/e-logo.svg';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const PYTHON_API_BASE = process.env.REACT_APP_API_BASE_URL_P;

const CueSheetGenerator = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [processingMessageVisible, setProcessingMessageVisible] = useState(false);
  const [loadingText, setLoadingText] = useState('');
  const [progress, setProgress] = useState(0);
  const [detectedSongs, setDetectedSongs] = useState([]);
  const [disableButtons, setDisableButtons] = useState(false);
  const [totalChunks, setTotalChunks] = useState(0);
  const [intervalId, setIntervalId] = useState(null);
  const [showTable, setShowTable] = useState(false);
  const [fileName, setFileName] = useState('');
  const [shortenedUrls, setShortenedUrls] = useState({});
  const [allLinksShortened, setAllLinksShortened] = useState(false);
  const [showButtons, setShowButtons] = useState(false);
  const [userId, setUserId] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('');
  const [alertVisible, setAlertVisible] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [videoDuration, setVideoDuration] = useState(null);


  const [formData, setFormData] = useState({
    tvChannel: '',
    programName: '',
    episodeNumber: '',
    onAirDate: '',
    movieAlbum: '',
  });

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
    }

    const savedFormData = JSON.parse(localStorage.getItem('formData'));
    const savedSongs = JSON.parse(localStorage.getItem('detectedSongs'));
    const savedFileName = localStorage.getItem('fileName');
    const savedShortenedUrls = JSON.parse(localStorage.getItem('shortenedUrls'));

    if (savedFormData) setFormData(savedFormData);
    if (savedSongs) {
      setDetectedSongs(savedSongs);
      setShowTable(true);
      setAllLinksShortened(true);
      setShowButtons(true);
    }
    if (savedFileName) setFileName(savedFileName);
    if (savedShortenedUrls) setShortenedUrls(savedShortenedUrls);
  }, [navigate]);

  useEffect(() => {
    if (detectedSongs.length > 0) {
      localStorage.setItem('detectedSongs', JSON.stringify(detectedSongs));
    }
    if (Object.keys(formData).length > 0) {
      localStorage.setItem('formData', JSON.stringify(formData));
    }
    if (fileName) {
      localStorage.setItem('fileName', fileName);
    }
    if (Object.keys(shortenedUrls).length > 0) {
      localStorage.setItem('shortenedUrls', JSON.stringify(shortenedUrls));
    }
  }, [detectedSongs, formData, fileName, shortenedUrls]);

  const resetTableAndLoader = () => {
    setDetectedSongs([]);
    setProgress(0);
    setShowTable(false);
    setAllLinksShortened(false);
    setShowButtons(false);
    localStorage.removeItem('detectedSongs');
    localStorage.removeItem('formData');
    localStorage.removeItem('fileName');
    localStorage.removeItem('shortenedUrls');
  };

  const handleFileUpload = async () => {
    const fileInput = document.getElementById('file').files[0];
    if (!fileInput) {
      setAlertMessage('Please select an audio file before uploading.');
      setAlertType('warning');
      setAlertVisible(true);
      setTimeout(() => setAlertVisible(false), 5000);
      return;
    }

    setIsUploading(true);
    const form = document.getElementById('metadataForm');
    const formData = new FormData(form);

    try {
      const response = await axios.post(`${PYTHON_API_BASE}/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const { fileName, userId } = response.data;
      setFileName(fileName);
      setUserId(userId);
      document.getElementById('programName').value = fileName;
      setAlertMessage('File uploaded successfully');
      setAlertType('success');
      setAlertVisible(true);
      setTimeout(() => setAlertVisible(false), 5000);
    } catch (error) {
      console.error('Error uploading file:', error);
      setAlertMessage('An error occurred during the upload.');
      setAlertType('error');
      setAlertVisible(true);
      setTimeout(() => setAlertVisible(false), 5000);
    } finally {
      setIsUploading(false); // Hide loader
    }
  };

  const handleProcessAudio = async () => {
    resetTableAndLoader();
    setDisableButtons(true);
    setProcessingMessageVisible(true); // Start showing the loader

    // Display sequential loading messages
    const messages = [
      "Your audio is in progress, this may take some time...",
      "Processing frames of your audio...",
      "Analyzing sound patterns for track detection...",
      "Detecting music tracks...",
      "Matching detected patterns with the database...",
      "Cross-checking detected songs for reliability...",
      "Optimizing the results for better accuracy...",
      "Finalizing the detected tracks...",
      "Generating the cue sheet for the audio file...",
      "Wrapping up the process, almost done...",
    ];

    let messageIndex = 0;
    const displayNextMessage = () => {
      if (messageIndex < messages.length) {
        setLoadingText(messages[messageIndex]);
        messageIndex++;
        setTimeout(displayNextMessage, 10000);
      }
    };
    displayNextMessage();

    // Simulate progress bar growth over 18 minutes (1080 seconds)
    const progressInterval = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 95) {
          clearInterval(progressInterval);
          return 95; // Cap at 95% until table is ready
        }
        return prevProgress + (95 / 150); // Incremental increase
      });
    }, 1000); // Update every second

    setTimeout(async () => {
      try {
        const response = await axios.post(`${PYTHON_API_BASE}/detect`, { userId });

        setDetectedSongs(response.data.songs);
        setAllLinksShortened(true);
        setVideoDuration(response.data.videoDuration);
        setShowTable(true);
        setShowButtons(true);
        setProcessingMessageVisible(false);
        setDisableButtons(false);
        clearInterval(progressInterval);
      } catch (error) {
        console.error("Error processing audio:", error);
        setDisableButtons(false);
        setProcessingMessageVisible(false);
        clearInterval(progressInterval);
      }
    }, 100);
  };


  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };



  const formatTime = (timeInSeconds) => {
    if (timeInSeconds === undefined || timeInSeconds === null || isNaN(timeInSeconds)) {
      return "00:00:00"; // Default to "00:00:00" if the time is invalid
    }
    return new Date(timeInSeconds * 1000).toISOString().substr(11, 8);
  };

  const renderTable = () => {
    return (
      <div className="overflow-x-auto ml-5">
        <table className="w-full border-collapse mt-5">
          <thead>
            <tr className="text-black">
              <th className="border px-4 py-2 bg-gray-200">TV Channel</th>
              <th className="border px-4 py-2 bg-gray-200">Program Name</th>
              <th className="border px-4 py-2 bg-gray-200">Episode Number</th>
              <th className="border px-4 py-2 bg-gray-200">On-Air Date</th>
              <th className="border px-4 py-2 bg-gray-200">Track Title</th>
              <th className="border px-4 py-2 bg-gray-200">Artist 1</th>
              <th className="border px-4 py-2 bg-gray-200">Copyright Link</th>
              <th className="border px-4 py-2 bg-gray-200">Video File Name</th>
              <th className="border px-4 py-2 bg-gray-200">Video Duration</th>
              <th className="border px-4 py-2 bg-gray-200">TC In</th>
              <th className="border px-4 py-2 bg-gray-200">TC Out</th>
              <th className="border px-4 py-2 bg-gray-200">Movie / Album Name</th>
            </tr>
          </thead>
          <tbody>
            {detectedSongs.map((song, index) => (
              <tr key={index}>
                <td className="border px-4 py-2">{formData.tvChannel || ''}</td>
                <td className="border px-4 py-2">{formData.programName || fileName}</td>
                <td className="border px-4 py-2">{formData.episodeNumber || ''}</td>
                <td className="border px-4 py-2">{formData.onAirDate || ''}</td>
                <td className="border px-4 py-2">{song.title}</td>
                <td className="border px-4 py-2">{song.artist1}</td>
                <td className="border px-4 py-2">
                  <a href={song.song_link} target="_blank" rel="noopener noreferrer">{song.song_link}</a>
                </td>


                <td className="border px-4 py-2">{fileName}</td>
                <td className="border px-4 py-2">{videoDuration}</td>
                <td className="border px-4 py-2">{formatTime(song.start_time)}</td>
                <td className="border px-4 py-2">{formatTime(song.end_time)}</td>
                <td className="border px-4 py-2">{formData.movieAlbum || ''}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const csvData = detectedSongs.map((song) => ({
    'TV Channel': formData.tvChannel || '',
    'Program Name': formData.programName || fileName,
    'Episode Number': formData.episodeNumber || '',
    'On-Air Date': formData.onAirDate || '',
    'Track Title': song.title,
    'Artist 1': song.artist1,
    'Copyright Link': song.song_link,
    'Video File Name': fileName,
    'Video Duration': videoDuration,
    'TC In': formatTime(song.start_time),
    'TC Out': formatTime(song.end_time),
    'Movie / Album Name': formData.movieAlbum || ''
  }));


  const csvFileName = `${formData.programName || fileName}_cue-sheet.csv`;

  const handleSave = async () => {
    try {
      const tableData = detectedSongs.map((song) => ({
        'TV Channel': formData.tvChannel || '',
        'Program Name': formData.programName || fileName,
        'Episode Number': formData.episodeNumber || '',
        'On-Air Date': formData.onAirDate || '',
        'Track Title': song.title,
        'Artist 1': song.artist1,
        'Copyright Link': shortenedUrls[song.title],
        'Video File Name': fileName,
        'Video Duration': song.videoDuration,
        'TC In': new Date(song.start_time * 1000).toISOString().substr(11, 8),
        'TC Out': new Date(song.end_time * 1000).toISOString().substr(11, 8),
        'Movie / Album Name': formData.movieAlbum || ''
      }));

      const response = await axios.post(`${API_BASE_URL}/save-table`, { tableData }, {
        headers: {
          Authorization: localStorage.getItem('token'),
        },
      });

      setAlertMessage('Table saved successfully!');
      setAlertType('success');
      setAlertVisible(true);
      setTimeout(() => setAlertVisible(false), 5000);
    } catch (error) {
      console.error('Error saving table:', error);
      setAlertMessage('Failed to save table.');
      setAlertType('error');
      setAlertVisible(true);
      setTimeout(() => setAlertVisible(false), 5000);
    }
  };

  return (
    <div id="modalBlur" className="bg-[#171717]  text-gray-300 min-h-screen">
      {/* Header with border similar to MySheets */}
      <div className="p-5 flex justify-between items-center border-b border-[#2E2E2E] bg-[#1E1E1E]">
        <h2 className="text-xl font-normal text-center flex-grow text-white">Create Cue-Sheet</h2>
      </div>

      <div className="mt-5 flex justify-start space-x-4 text-white ml-5 text-sm">
        <button
          onClick={() => setIsModalOpen(true)}
          className={`py-2 px-4 rounded-md transition-all transform ${disableButtons ? 'bg-[#3d3d3d] text-white cursor-not-allowed' : 'bg-[#28603D] hover:bg-[#417155] hover:scale-102'
            }`}
          disabled={disableButtons}
        >
          Fill Details
        </button>

        <button
          id="detectButton"
          onClick={handleProcessAudio}
          className={`py-2 px-4 rounded-md transition-all transform ${disableButtons ? 'bg-[#3d3d3d] text-white cursor-not-allowed' : 'bg-[#28603D] hover:bg-[#417155] hover:scale-102'
            }`}
          disabled={disableButtons}
        >
          Start Process
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed z-50 inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center text-black">
          <div className="bg-gray-200 w-1/2 p-5 rounded-md shadow-lg">
            <div className="modal-header flex justify-between items-center border-b pb-3">
              <h3 className="text-xl">Upload Audio file</h3>
              <button className="text-gray-600 hover:text-black text-xl" onClick={() => setIsModalOpen(false)}>
                &times;
              </button>
            </div>
            <div className="modal-body py-5">
              <form id="metadataForm" encType="multipart/form-data">
                <label className="block mb-2" htmlFor="tvChannel">TV Channel:</label>
                <input className="w-full mb-4 p-2 border rounded-md" type="text" id="tvChannel" name="tvChannel" onChange={handleInputChange} />

                <label className="block mb-2" htmlFor="programName">Program Name:</label>
                <input className="w-full mb-4 p-2 border rounded-md" type="text" id="programName" name="programName" onChange={handleInputChange} />

                <label className="block mb-2" htmlFor="episodeNumber">Episode Number:</label>
                <input className="w-full mb-4 p-2 border rounded-md" type="number" id="episodeNumber" name="episodeNumber" onChange={handleInputChange} />

                <label className="block mb-2" htmlFor="onAirDate">On-Air Date:</label>
                <input className="w-full mb-4 p-2 border rounded-md" type="date" id="onAirDate" name="onAirDate" onChange={handleInputChange} />

                <label className="block mb-2" htmlFor="movieAlbum">Movie/Album Name:</label>
                <input className="w-full mb-4 p-2 border rounded-md" type="text" id="movieAlbum" name="movieAlbum" onChange={handleInputChange} />

                <label className="block mb-2" htmlFor="file">Upload MP3 File:</label>
                <input className="w-full mb-4 p-2 border rounded-md" type="file" id="file" name="file" accept=".mp3" required />

                <div className="text-center">
                  <button
                    type="button"
                    id="uploadButton"
                    className="bg-green-600 hover:bg-green-500 text-white py-2 px-4 rounded-md transition-all transform"
                    onClick={handleFileUpload}
                  >
                    Upload File
                  </button>
                </div>
              </form>
            </div>
            <div className="modal-footer flex justify-end pt-3 border-t">
              <button onClick={() => setIsModalOpen(false)} className="bg-gray-300 hover:bg-gray-400 text-gray-700 py-1 px-4 rounded-md">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      {isUploading && (
        <div className="fixed-loader-container">
          <div className="loader"></div>
        </div>
      )}

      {processingMessageVisible && (
        <div id="loadingContainer" className="loading-container mt-20 opacity-100 mx-4">
          <div className="loading-text text-lg text-center mb-2">{loadingText}</div>
          <div className="progress-bar bg-gray-700 rounded-lg w-full mx-4 h-4">
            <div className="progress-bar-fill bg-[#417155] h-full rounded-lg" style={{ width: `${progress}%`, transition: 'width 1s ease' }}></div>
          </div>
        </div>
      )}

      {allLinksShortened && showTable && renderTable()}

      <div className="flex justify-center items-center mt-5 space-x-4">
  {detectedSongs.length > 0 && allLinksShortened && showButtons && (
    <>
      <CSVLink
        data={csvData}
        filename={csvFileName}
        className="bg-[#28603D] hover:bg-[#417155] py-2 px-4 rounded-md transition-all transform flex items-center justify-center"
      >
        <img src={eLogo} alt="Download CSV" className="h-5 w-5" />
      </CSVLink>

      <button
        onClick={handleSave}
        className="bg-[#669de3] hover:bg-[#9dc1f5] text-white py-1.5 px-4 rounded-md ml-4 transition-all transform"
      >
        Save
      </button>
    </>
  )}
</div>

      <Alert message={alertMessage} type={alertType} visible={alertVisible} setVisible={setAlertVisible} />
    </div>
  );
};

export default CueSheetGenerator;




