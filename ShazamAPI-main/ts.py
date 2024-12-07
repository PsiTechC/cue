# google ts
# from json import loads
# from random import randint
# import requests
# from multiprocessing import Process, Manager
# from pydub import AudioSegment
# import os

# # Constants
# ENDPOINT = "https://www.google.com/speech-api/full-duplex/v1/"
# API_KEY = "AIzaSyBOti4mM-6x9WDnZIjIeyEU21OpBXqWBgw"
# USER_AGENT = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.71 Safari/537.36"
# AUDIO_FOLDER = "/Users/sanketkapoor/Documents/cue/ShazamAPI-main/ShazamAPI/songs"


# # Helper function to generate a random unique pair ID
# def __gen_pair():
#     r = ''
#     for i in range(16):
#         r += hex(randint(0, 15))[2:]
#     return r.upper()


# # Function to send the audio data to Google Speech API
# def __send_audio(data: bytes, pair: str, session):
#     parameters = {
#         'key': API_KEY,
#         'pair': pair,
#         'output': 'json',
#         'lang': 'en-US',  # Change this for different languages
#         'pFilter': '2',
#         'maxAlternatives': '1',
#         'app': 'chromium',
#         'endpoint': '1'
#     }

#     headers = {'Content-Type': 'audio/x-flac; rate=48000'}
#     response = session.post(ENDPOINT + 'up', params=parameters, data=data, headers=headers)

#     return response


# # Function to receive the transcription results from the API
# def __recv_reply(pair: str, session, result_buf):
#     parameters = {
#         'key': API_KEY,
#         'pair': pair,
#         'output': 'json'
#     }

#     response = session.get(ENDPOINT + 'down', params=parameters)
#     result_buf['r'] = response.text


# # Function to orchestrate the upload and download processes
# def __ts_start(data: bytes):
#     pair = __gen_pair()

#     # Start a session for API communication
#     session = requests.session()
#     session.headers.update({'User-Agent': USER_AGENT})

#     manager = Manager()
#     result_buf = manager.dict()

#     # Start the upload and download processes in parallel
#     uploadProc = Process(target=__send_audio, args=(data, pair, session))
#     downloadProc = Process(target=__recv_reply, args=(pair, session, result_buf))
#     downloadProc.start()
#     uploadProc.start()

#     uploadProc.join()
#     downloadProc.join()

#     return result_buf


# # Main transcription function
# def transcribe(data: bytes):
#     x = __ts_start(data)

#     print("Raw Response:", x['r'])  # Debugging step
#     try:
#         # Split responses and parse each one
#         responses = x['r'].strip().split("\n")
#         transcription_results = []

#         for response in responses:
#             if not response.strip():  # Skip empty lines
#                 continue
#             try:
#                 json_response = loads(response)
#                 if 'result' in json_response and json_response['result']:
#                     # Extract transcription details
#                     alternatives = json_response['result'][0]['alternative']
#                     transcription_results.append({
#                         "transcript": alternatives[0].get('transcript', 'Unknown'),
#                         "confidence": alternatives[0].get('confidence', 0.0),
#                     })
#             except Exception as e:
#                 print(f"Error parsing response part: {response}, Error: {e}")
#                 continue

#         if not transcription_results:
#             raise ValueError("No transcription result found.")

#         # Combine all transcriptions
#         combined_transcript = " ".join([result["transcript"] for result in transcription_results])
#         average_confidence = (
#             sum(result["confidence"] for result in transcription_results) / len(transcription_results)
#         )

#         return combined_transcript, average_confidence
#     except Exception as e:
#         print(f"Error processing response: {e}")
#         return "Error: Could not transcribe audio", 0.0


# # Function to add a new audio file and convert it to FLAC
# def add_and_convert_audio(file_path, output_folder):
#     if not os.path.exists(file_path):
#         raise FileNotFoundError(f"The file {file_path} does not exist.")

#     # Convert the provided audio file to FLAC format
#     if file_path.lower().endswith(('.mp3', '.wav', '.ogg')):  # Check for supported formats
#         audio = AudioSegment.from_file(file_path)
#         flac_file_path = os.path.join(output_folder, os.path.splitext(os.path.basename(file_path))[0] + ".flac")
#         audio.export(flac_file_path, format="flac")
#         print(f"Converted {file_path} to {flac_file_path}")
#         return flac_file_path
#     else:
#         raise ValueError("Unsupported audio file format. Please provide an MP3, WAV, or OGG file.")


# # Script entry point
# if __name__ == "__main__":
#     try:
#         # Path to the new audio file you want to add
#         new_audio_file = "ShazamAPI/songs/sampleAudio.mp3"

#         # Convert the new audio file to FLAC and save it in the folder
#         flac_file = add_and_convert_audio(new_audio_file, AUDIO_FOLDER)

#         # Transcribe the FLAC file
#         with open(flac_file, "rb") as f:
#             audio_data = f.read()

#         # Call the transcribe function and print the results
#         transcript, confidence = transcribe(audio_data)
#         print(f"\nFile: {flac_file}")
#         print(f"Transcript: {transcript}")
#         print(f"Confidence: {confidence}")
#     except Exception as e:
#         print(f"Error: {e}")






# import sys
# import os
# import tempfile
# from pydub import AudioSegment
# from PyQt5.QtWidgets import (
#     QApplication,
#     QWidget,
#     QVBoxLayout,
#     QHBoxLayout,
#     QPushButton,
#     QTextEdit,
#     QFileDialog,
#     QLabel,
#     QComboBox,
#     QProgressBar,
# )
# from PyQt5.QtCore import Qt, QThread, pyqtSignal
# from PyQt5.QtGui import QFont
# from flask import Flask, request, jsonify
# from flask_cors import CORS
# import whisper

# app = Flask(__name__)
# CORS(app, resources={r"/*": {"origins": "http://localhost:3001"}})
# app.config["TS_FOLDER"] = tempfile.gettempdir()

# # Global variable to store transcription result
# transcription_result = []

# # class WhisperSpeechProcessorThread(QThread):
# #     sentence_ready = pyqtSignal(str)
# #     progress_update = pyqtSignal(int)
# #     processing_complete = pyqtSignal()

# #     def __init__(self, audio_file_path):
# #         super().__init__()
# #         self.audio_file_path = audio_file_path
# #         self.model = whisper.load_model("base")  # Load the Whisper model (use "base" or other sizes)

# #     def run(self):
# #         global transcription_result
# #         transcription_result.clear()
# #         try:
# #             audio_file_path = convert_to_wav(self.audio_file_path)
# #             result = self.model.transcribe(audio_file_path)
# #             text = result["text"]
# #             transcription_result.append(text)
# #             self.sentence_ready.emit(text)
# #             self.progress_update.emit(100)
# #             self.processing_complete.emit()

# #         except Exception as e:
# #             self.sentence_ready.emit(f"An error occurred: {str(e)}")


# class WhisperSpeechProcessorThread(QThread):
#     sentence_ready = pyqtSignal(str)
#     progress_update = pyqtSignal(int)
#     processing_complete = pyqtSignal()

#     def __init__(self, audio_file_path):
#         super().__init__()
#         self.audio_file_path = audio_file_path
#         self.model = whisper.load_model("base")  # Load the Whisper model

#     def run(self):
#         global transcription_result
#         transcription_result.clear()
#         try:
#             audio_file_path = convert_to_wav(self.audio_file_path)
#             result = self.model.transcribe(audio_file_path, task="transcribe", verbose=True)
            
#             # Prepare WEBVTT output
#             webvtt_output = "WEBVTT\n\n"
#             previous_start = None  # Track previous segment to avoid duplicates
            
#             for segment in result["segments"]:
#                 start_time = self.format_timestamp(segment["start"])
#                 end_time = self.format_timestamp(segment["end"])
#                 text = segment["text"].strip()
                
#                 # Skip empty texts or duplicate timestamps
#                 if text and (start_time != previous_start):
#                     webvtt_output += f"{start_time} --> {end_time}\n{text}\n\n"
#                     previous_start = start_time  # Update to current start for the next check

#             transcription_result.append(webvtt_output.strip())
#             self.sentence_ready.emit(webvtt_output.strip())
#             self.progress_update.emit(100)
#             self.processing_complete.emit()

#         except Exception as e:
#             self.sentence_ready.emit(f"An error occurred: {str(e)}")

#     def format_timestamp(self, seconds):
#         # Convert seconds to HH:MM:SS.mmm format
#         hours = int(seconds // 3600)
#         minutes = int((seconds % 3600) // 60)
#         seconds = int(seconds % 60)
#         milliseconds = int((seconds % 1) * 1000)
#         return f"{hours:02}:{minutes:02}:{seconds:02}.{milliseconds:03}"


# def convert_to_wav(file_path):
#     # Check file extension and convert if needed
#     file_ext = os.path.splitext(file_path)[-1].lower()
#     if file_ext not in ['.wav', '.flac', '.aiff', '.aif']:
#         wav_path = os.path.join(tempfile.gettempdir(), "converted_audio.wav")
#         audio = AudioSegment.from_file(file_path)
#         audio.export(wav_path, format="wav")
#         return wav_path
#     return file_path

# class GoogleSpeechApp(QWidget):
#     # Existing code for PyQt GUI here (no changes needed)
#     pass

# @app.route("/upload", methods=["POST"])
# def upload_file():
#     if "file" not in request.files:
#         return jsonify({"error": "No file part"}), 400
#     file = request.files["file"]
#     if file.filename == "":
#         return jsonify({"error": "No selected file"}), 400
#     if file:
#         file_path = os.path.join(app.config["TS_FOLDER"], file.filename)
#         file.save(file_path)
#         return jsonify({"message": "File uploaded successfully", "file_path": file_path}), 200

# # @app.route("/process_audio", methods=["POST"])
# # def process_audio():
# #     data = request.get_json()
# #     file_path = data.get("file_path")

# #     if not file_path or not os.path.exists(file_path):
# #         return jsonify({"error": "Invalid or missing file path"}), 400

# #     global transcription_result
# #     transcription_result.clear()

# #     try:
# #         audio_file_path = convert_to_wav(file_path)
# #         model = whisper.load_model("base")  # Load the Whisper model
# #         result = model.transcribe(audio_file_path)
# #         text = result["text"]
# #         transcription_result.append(text)
# #         return jsonify({"message": "Processing complete", "transcription": transcription_result}), 200
# #     except Exception as e:
# #         return jsonify({"error": f"An error occurred: {str(e)}"}), 500


# @app.route("/process_audio", methods=["POST"])
# def process_audio():
#     data = request.get_json()
#     file_path = data.get("file_path")

#     if not file_path or not os.path.exists(file_path):
#         return jsonify({"error": "Invalid or missing file path"}), 400

#     global transcription_result
#     transcription_result.clear()

#     try:
#         audio_file_path = convert_to_wav(file_path)
#         model = whisper.load_model("base")
#         result = model.transcribe(audio_file_path, task="transcribe", verbose=True)
        
#         # Format into WEBVTT
#         webvtt_output = "WEBVTT\n\n"
#         previous_start = None
#         for segment in result["segments"]:
#             start_time = format_timestamp(segment["start"])
#             end_time = format_timestamp(segment["end"])
#             text = segment["text"].strip()
            
#             if text and (start_time != previous_start):
#                 webvtt_output += f"{start_time} --> {end_time}\n{text}\n\n"
#                 previous_start = start_time

#         transcription_result.append(webvtt_output.strip())
#         return jsonify({"message": "Processing complete", "transcription": webvtt_output.strip()}), 200
#     except Exception as e:
#         return jsonify({"error": f"An error occurred: {str(e)}"}), 500

# def format_timestamp(seconds):
#     hours = int(seconds // 3600)
#     minutes = int((seconds % 3600) // 60)
#     seconds = int(seconds % 60)
#     milliseconds = int((seconds % 1) * 1000)
#     return f"{hours:02}:{minutes:02}:{seconds:02}.{milliseconds:03}"



# @app.route("/get_transcription", methods=["GET"])
# def get_transcription():
#     return jsonify({"transcription": transcription_result})


# if __name__ == "__main__":
#     app.run(debug=True, port=5002)




# import sys
# import os
# import tempfile
# from pydub import AudioSegment
# from PyQt5.QtWidgets import (
#     QApplication,
#     QWidget,
#     QVBoxLayout,
#     QHBoxLayout,
#     QPushButton,
#     QTextEdit,
#     QFileDialog,
#     QLabel,
#     QComboBox,
#     QProgressBar,
# )
# from PyQt5.QtCore import Qt, QThread, pyqtSignal
# from PyQt5.QtGui import QFont
# from flask import Flask, request, jsonify
# from flask_cors import CORS
# import whisper

# app = Flask(__name__)
# CORS(app, resources={r"/*": {"origins": "http://localhost:3001"}})
# app.config["TS_FOLDER"] = tempfile.gettempdir()

# # Global variable to store transcription result
# transcription_result = []

# class WhisperSpeechProcessorThread(QThread):
#     sentence_ready = pyqtSignal(str)
#     progress_update = pyqtSignal(int)
#     processing_complete = pyqtSignal()

#     def __init__(self, audio_file_path):
#         super().__init__()
#         self.audio_file_path = audio_file_path
#         self.model = whisper.load_model("base")  # Load the Whisper model

#     def run(self):
#         global transcription_result
#         transcription_result.clear()
#         try:
#             audio_file_path = convert_to_wav(self.audio_file_path)
#             result = self.model.transcribe(audio_file_path, task="transcribe", verbose=True)
            
#             # Prepare WEBVTT output
#             webvtt_output = "WEBVTT\n\n"
#             previous_start = None  # Track previous segment to avoid duplicates
            
#             for segment in result["segments"]:
#                 start_time = self.format_timestamp(segment["start"])
#                 end_time = self.format_timestamp(segment["end"])
#                 text = segment["text"].strip()
                
#                 # Skip empty texts or duplicate timestamps
#                 if text and (start_time != previous_start):
#                     webvtt_output += f"{start_time} --> {end_time}\n{text}\n\n"
#                     previous_start = start_time  # Update to current start for the next check

#             transcription_result.append(webvtt_output.strip())
#             self.sentence_ready.emit(webvtt_output.strip())
#             self.progress_update.emit(100)
#             self.processing_complete.emit()

#         except Exception as e:
#             self.sentence_ready.emit(f"An error occurred: {str(e)}")

#     def format_timestamp(self, seconds):
#         # Convert seconds to HH:MM:SS.mmm format
#         hours = int(seconds // 3600)
#         minutes = int((seconds % 3600) // 60)
#         seconds = int(seconds % 60)
#         milliseconds = int((seconds % 1) * 1000)
#         return f"{hours:02}:{minutes:02}:{seconds:02}.{milliseconds:03}"


# def convert_to_wav(file_path):
#     # Check file extension and convert if needed
#     file_ext = os.path.splitext(file_path)[-1].lower()
#     if file_ext not in ['.wav', '.flac', '.aiff', '.aif']:
#         wav_path = os.path.join(tempfile.gettempdir(), "converted_audio.wav")
#         audio = AudioSegment.from_file(file_path)
#         audio.export(wav_path, format="wav")
#         return wav_path
#     return file_path

# class GoogleSpeechApp(QWidget):
#     # Existing code for PyQt GUI here (no changes needed)
#     pass

# @app.route("/upload", methods=["POST"])
# def upload_file():
#     if "file" not in request.files:
#         return jsonify({"error": "No file part"}), 400
#     file = request.files["file"]
#     if file.filename == "":
#         return jsonify({"error": "No selected file"}), 400
#     if file:
#         file_path = os.path.join(app.config["TS_FOLDER"], file.filename)
#         file.save(file_path)
#         return jsonify({"message": "File uploaded successfully", "file_path": file_path}), 200



# @app.route("/process_audio", methods=["POST"])
# def process_audio():
#     data = request.get_json()
#     file_path = data.get("file_path")

#     if not file_path or not os.path.exists(file_path):
#         return jsonify({"error": "Invalid or missing file path"}), 400

#     global transcription_result
#     transcription_result.clear()

#     try:
#         audio_file_path = convert_to_wav(file_path)
#         model = whisper.load_model("base")
#         result = model.transcribe(audio_file_path, task="transcribe", verbose=True)
        
#         # Format into WEBVTT
#         webvtt_output = "WEBVTT\n\n"
#         previous_start = None
#         for segment in result["segments"]:
#             start_time = format_timestamp(segment["start"])
#             end_time = format_timestamp(segment["end"])
#             text = segment["text"].strip()
            
#             if text and (start_time != previous_start):
#                 webvtt_output += f"{start_time} --> {end_time}\n{text}\n\n"
#                 previous_start = start_time

#         transcription_result.append(webvtt_output.strip())
#         return jsonify({"message": "Processing complete", "transcription": webvtt_output.strip()}), 200
#     except Exception as e:
#         return jsonify({"error": f"An error occurred: {str(e)}"}), 500

# def format_timestamp(seconds):
#     hours = int(seconds // 3600)
#     minutes = int((seconds % 3600) // 60)
#     seconds = int(seconds % 60)
#     milliseconds = int((seconds % 1) * 1000)
#     return f"{hours:02}:{minutes:02}:{seconds:02}.{milliseconds:03}"



# @app.route("/get_transcription", methods=["GET"])
# def get_transcription():
#     return jsonify({"transcription": transcription_result})


# if __name__ == "__main__":
#     app.run(debug=True, port=5002)



# import sys
# import os
# import tempfile
# from pydub import AudioSegment
# from PyQt5.QtWidgets import (
#     QApplication,
#     QWidget,
#     QVBoxLayout,
#     QHBoxLayout,
#     QPushButton,
#     QTextEdit,
#     QFileDialog,
#     QLabel,
#     QComboBox,
#     QProgressBar,
# )
# from PyQt5.QtCore import Qt, QThread, pyqtSignal
# from PyQt5.QtGui import QFont
# from flask import Flask, request, jsonify
# from flask_cors import CORS
# import whisper

# app = Flask(__name__)
# CORS(app, resources={r"/*": {"origins": "http://localhost:3001"}})
# app.config["TS_FOLDER"] = tempfile.gettempdir()

# # Global variable to store transcription result
# transcription_result = []

# class WhisperSpeechProcessorThread(QThread):
#     sentence_ready = pyqtSignal(str)
#     progress_update = pyqtSignal(int)
#     processing_complete = pyqtSignal()

#     def __init__(self, audio_file_path, language=None):
#         super().__init__()
#         self.audio_file_path = audio_file_path
#         self.language = language
#         self.model = whisper.load_model("base")  # Load the Whisper model

#     def run(self):
#         global transcription_result
#         transcription_result.clear()
#         try:
#             audio_file_path = convert_to_wav(self.audio_file_path)
#             result = self.model.transcribe(audio_file_path, task="transcribe", language=self.language, verbose=True)
            
#             # Prepare WEBVTT output
#             webvtt_output = "WEBVTT\n\n"
#             previous_start = None  # Track previous segment to avoid duplicates
            
#             for segment in result["segments"]:
#                 start_time = self.format_timestamp(segment["start"])
#                 end_time = self.format_timestamp(segment["end"])
#                 text = segment["text"].strip()
                
#                 # Skip empty texts or duplicate timestamps
#                 if text and (start_time != previous_start):
#                     webvtt_output += f"{start_time} --> {end_time}\n{text}\n\n"
#                     previous_start = start_time  # Update to current start for the next check

#             transcription_result.append(webvtt_output.strip())
#             self.sentence_ready.emit(webvtt_output.strip())
#             self.progress_update.emit(100)
#             self.processing_complete.emit()

#         except Exception as e:
#             self.sentence_ready.emit(f"An error occurred: {str(e)}")

#     def format_timestamp(self, seconds):
#         hours = int(seconds // 3600)
#         minutes = int((seconds % 3600) // 60)
#         seconds = int(seconds % 60)
#         milliseconds = int((seconds % 1) * 1000)
#         return f"{hours:02}:{minutes:02}:{seconds:02}.{milliseconds:03}"


# def convert_to_wav(file_path):
#     file_ext = os.path.splitext(file_path)[-1].lower()
#     if file_ext not in ['.wav', '.flac', '.aiff', '.aif']:
#         wav_path = os.path.join(tempfile.gettempdir(), "converted_audio.wav")
#         audio = AudioSegment.from_file(file_path)
#         audio.export(wav_path, format="wav")
#         return wav_path
#     return file_path

# class GoogleSpeechApp(QWidget):
#     # Existing code for PyQt GUI here (no changes needed)
#     pass

# @app.route("/upload", methods=["POST"])
# def upload_file():
#     if "file" not in request.files:
#         return jsonify({"error": "No file part"}), 400
#     file = request.files["file"]
#     if file.filename == "":
#         return jsonify({"error": "No selected file"}), 400
#     if file:
#         file_path = os.path.join(app.config["TS_FOLDER"], file.filename)
#         file.save(file_path)
#         return jsonify({"message": "File uploaded successfully", "file_path": file_path}), 200

# # @app.route("/process_audio", methods=["POST"])
# # def process_audio():
# #     data = request.get_json()
# #     file_path = data.get("file_path")
# #     language = data.get("language")  # Accept language parameter from the frontend

# #     if not file_path or not os.path.exists(file_path):
# #         return jsonify({"error": "Invalid or missing file path"}), 400

# #     global transcription_result
# #     transcription_result.clear()

# #     try:
# #         audio_file_path = convert_to_wav(file_path)
# #         model = whisper.load_model("base")
        
# #         # Transcribe with specified language
# #         result = model.transcribe(audio_file_path, task="transcribe", language=language, verbose=True)
        
# #         # Format into WEBVTT
# #         webvtt_output = "WEBVTT\n\n"
# #         previous_start = None
# #         for segment in result["segments"]:
# #             start_time = format_timestamp(segment["start"])
# #             end_time = format_timestamp(segment["end"])
# #             text = segment["text"].strip()
            
# #             if text and (start_time != previous_start):
# #                 webvtt_output += f"{start_time} --> {end_time}\n{text}\n\n"
# #                 previous_start = start_time

# #         transcription_result.append(webvtt_output.strip())
# #         return jsonify({"message": "Processing complete", "transcription": webvtt_output.strip()}), 200
# #     except Exception as e:
# #         return jsonify({"error": f"An error occurred: {str(e)}"}), 500


# @app.route("/process_audio", methods=["POST"])
# def process_audio():
#     data = request.get_json()
#     file_path = data.get("file_path")
#     language_code = data.get("language", "en")  # Get language from frontend, default to English

#     if not file_path or not os.path.exists(file_path):
#         return jsonify({"error": "Invalid or missing file path"}), 400

#     # Mapping of user-provided language codes to Whisper-compatible codes
#     supported_languages = {
#         "en-US": "en",      # English
#         "hi-IN": "hi",      # Hindi
#         "es-ES": "es",      # Spanish
#         # Add other language mappings here as needed
#     }

#     whisper_language = supported_languages.get(language_code)
#     if not whisper_language:
#         return jsonify({"error": f"Unsupported language: {language_code}"}), 400

#     # Log the selected language
#     print(f"Selected language for transcription: {whisper_language}")

#     global transcription_result
#     transcription_result.clear()

#     try:
#         audio_file_path = convert_to_wav(file_path)
#         model = whisper.load_model("base")

#         # Transcribe with the specified language, enforcing language restriction
#         result = model.transcribe(audio_file_path, language=whisper_language, task="transcribe", verbose=True)
        
#         # Format into WEBVTT
#         webvtt_output = "WEBVTT\n\n"
#         previous_start = None
#         for segment in result["segments"]:
#             start_time = format_timestamp(segment["start"])
#             end_time = format_timestamp(segment["end"])
#             text = segment["text"].strip()
            
#             # Add each segment to the VTT output
#             if text and (start_time != previous_start):
#                 webvtt_output += f"{start_time} --> {end_time}\n{text}\n\n"
#                 previous_start = start_time

#         transcription_result.append(webvtt_output.strip())
#         return jsonify({"message": "Processing complete", "transcription": webvtt_output.strip()}), 200
#     except Exception as e:
#         return jsonify({"error": f"An error occurred: {str(e)}"}), 500


# def format_timestamp(seconds):
#     hours = int(seconds // 3600)
#     minutes = int((seconds % 3600) // 60)
#     seconds = int(seconds % 60)
#     milliseconds = int((seconds % 1) * 1000)
#     return f"{hours:02}:{minutes:02}:{seconds:02}.{milliseconds:03}"

# @app.route("/get_transcription", methods=["GET"])
# def get_transcription():
#     return jsonify({"transcription": transcription_result})

# if __name__ == "__main__":
#     app.run(debug=True, port=5002)





# import sys
# import os
# import tempfile
# from pydub import AudioSegment
# from PyQt5.QtWidgets import (
#     QApplication,
#     QWidget,
#     QVBoxLayout,
#     QHBoxLayout,
#     QPushButton,
#     QTextEdit,
#     QFileDialog,
#     QLabel,
#     QComboBox,
#     QProgressBar,
# )
# from PyQt5.QtCore import Qt, QThread, pyqtSignal
# from PyQt5.QtGui import QFont
# from flask import Flask, request, jsonify
# from flask_cors import CORS
# import whisper

# app = Flask(__name__)
# CORS(app, resources={r"/*": {"origins": "http://localhost:3001"}})
# app.config["TS_FOLDER"] = tempfile.gettempdir()

# # Global variable to store transcription result
# transcription_result = []

# class WhisperSpeechProcessorThread(QThread):
#     sentence_ready = pyqtSignal(str)
#     progress_update = pyqtSignal(int)
#     processing_complete = pyqtSignal()

#     def __init__(self, audio_file_path, language=None):
#         super().__init__()
#         self.audio_file_path = audio_file_path
#         self.language = language
#         self.model = whisper.load_model("base")  # Load the Whisper model

#     def run(self):
#         global transcription_result
#         transcription_result.clear()
#         try:
#             audio_file_path = convert_to_wav(self.audio_file_path)
#             result = self.model.transcribe(audio_file_path, task="transcribe", language=self.language, verbose=True)
            
#             # Prepare WEBVTT output
#             webvtt_output = "WEBVTT\n\n"
#             previous_start = None  # Track previous segment to avoid duplicates
            
#             for segment in result["segments"]:
#                 start_time = self.format_timestamp(segment["start"])
#                 end_time = self.format_timestamp(segment["end"])
#                 text = segment["text"].strip()
                
#                 # Skip empty texts or duplicate timestamps
#                 if text and (start_time != previous_start):
#                     webvtt_output += f"{start_time} --> {end_time}\n{text}\n\n"
#                     previous_start = start_time  # Update to current start for the next check

#             transcription_result.append(webvtt_output.strip())
#             self.sentence_ready.emit(webvtt_output.strip())
#             self.progress_update.emit(100)
#             self.processing_complete.emit()

#         except Exception as e:
#             self.sentence_ready.emit(f"An error occurred: {str(e)}")

#     def format_timestamp(self, seconds):
#         hours = int(seconds // 3600)
#         minutes = int((seconds % 3600) // 60)
#         seconds = int(seconds % 60)
#         milliseconds = int((seconds % 1) * 1000)
#         return f"{hours:02}:{minutes:02}:{seconds:02}.{milliseconds:03}"


# def convert_to_wav(file_path):
#     file_ext = os.path.splitext(file_path)[-1].lower()
#     if file_ext not in ['.wav', '.flac', '.aiff', '.aif']:
#         wav_path = os.path.join(tempfile.gettempdir(), "converted_audio.wav")
#         audio = AudioSegment.from_file(file_path)
#         audio.export(wav_path, format="wav")
#         return wav_path
#     return file_path

# class GoogleSpeechApp(QWidget):
#     # Existing code for PyQt GUI here (no changes needed)
#     pass

# @app.route("/upload", methods=["POST"])
# def upload_file():
#     if "file" not in request.files:
#         return jsonify({"error": "No file part"}), 400
#     file = request.files["file"]
#     if file.filename == "":
#         return jsonify({"error": "No selected file"}), 400
#     if file:
#         file_path = os.path.join(app.config["TS_FOLDER"], file.filename)
#         file.save(file_path)
#         return jsonify({"message": "File uploaded successfully", "file_path": file_path}), 200


# @app.route("/process_audio", methods=["POST"])
# def process_audio():
#     data = request.get_json()
#     file_path = data.get("file_path")
#     language_code = data.get("language", "en")  # Get language from frontend, default to English

#     if not file_path or not os.path.exists(file_path):
#         return jsonify({"error": "Invalid or missing file path"}), 400

#     # Mapping of user-provided language codes to Whisper-compatible codes
#     supported_languages = {
#         "en-US": "en",      # English
#         "hi-IN": "hi",      # Hindi
#         "es-ES": "es",      # Spanish
#         # Add other language mappings here as needed
#     }

#     whisper_language = supported_languages.get(language_code)
#     if not whisper_language:
#         return jsonify({"error": f"Unsupported language: {language_code}"}), 400

#     # Log the selected language
#     print(f"Selected language for transcription: {whisper_language}")

#     global transcription_result
#     transcription_result.clear()

#     try:
#         audio_file_path = convert_to_wav(file_path)
#         model = whisper.load_model("base")

#         # Transcribe with the specified language, enforcing language restriction
#         result = model.transcribe(audio_file_path, language=whisper_language, task="transcribe", verbose=True)
        
#         # Format into WEBVTT
#         webvtt_output = "WEBVTT\n\n"
#         previous_start = None
#         for segment in result["segments"]:
#             start_time = format_timestamp(segment["start"])
#             end_time = format_timestamp(segment["end"])
#             text = segment["text"].strip()
            
#             # Add each segment to the VTT output
#             if text and (start_time != previous_start):
#                 webvtt_output += f"{start_time} --> {end_time}\n{text}\n\n"
#                 previous_start = start_time

#         transcription_result.append(webvtt_output.strip())
#         return jsonify({"message": "Processing complete", "transcription": webvtt_output.strip()}), 200
#     except Exception as e:
#         return jsonify({"error": f"An error occurred: {str(e)}"}), 500


# def format_timestamp(seconds):
#     hours = int(seconds // 3600)
#     minutes = int((seconds % 3600) // 60)
#     seconds = int(seconds % 60)
#     milliseconds = int((seconds % 1) * 1000)
#     return f"{hours:02}:{minutes:02}:{seconds:02}.{milliseconds:03}"

# @app.route("/get_transcription", methods=["GET"])
# def get_transcription():
#     return jsonify({"transcription": transcription_result})

# if __name__ == "__main__":
#     app.run(debug=True, port=5002)






# import sys
# import os
# import tempfile
# from pydub import AudioSegment
# from PyQt5.QtWidgets import (
#     QApplication,
#     QWidget,
#     QVBoxLayout,
#     QHBoxLayout,
#     QPushButton,
#     QTextEdit,
#     QFileDialog,
#     QLabel,
#     QComboBox,
#     QProgressBar,
# )
# from PyQt5.QtCore import Qt, QThread, pyqtSignal
# from PyQt5.QtGui import QFont
# from flask import Flask, request, jsonify
# from flask_cors import CORS
# import whisper

# app = Flask(__name__)
# CORS(app, resources={r"/*": {"origins": "http://localhost:3001"}})
# app.config["TS_FOLDER"] = tempfile.gettempdir()

# # Global variable to store transcription result
# transcription_result = []

# class WhisperSpeechProcessorThread(QThread):
#     sentence_ready = pyqtSignal(str)
#     progress_update = pyqtSignal(int)
#     processing_complete = pyqtSignal()

#     def __init__(self, audio_file_path, language=None):
#         super().__init__()
#         self.audio_file_path = audio_file_path
#         self.language = language
#         self.model = whisper.load_model("large")  # Load the Whisper model

#     def run(self):
#         global transcription_result
#         transcription_result.clear()
#         try:
#             audio_file_path = convert_to_wav(self.audio_file_path)

#             # Log the language selection
#             print(f"Transcribing in language: {self.language}")

#             # Perform transcription, ensuring the specified language is used strictly
#             result = self.model.transcribe(audio_file_path, task="transcribe", language=self.language, verbose=True)
            
#             # Prepare WEBVTT output
#             webvtt_output = "WEBVTT\n\n"
#             previous_start = None  # Track previous segment to avoid duplicates
            
#             for segment in result["segments"]:
#                 start_time = self.format_timestamp(segment["start"])
#                 end_time = self.format_timestamp(segment["end"])
#                 text = segment["text"].strip()
                
#                 # Skip empty texts or duplicate timestamps
#                 if text and (start_time != previous_start):
#                     webvtt_output += f"{start_time} --> {end_time}\n{text}\n\n"
#                     previous_start = start_time  # Update to current start for the next check

#             transcription_result.append(webvtt_output.strip())
#             self.sentence_ready.emit(webvtt_output.strip())
#             self.progress_update.emit(100)
#             self.processing_complete.emit()

#         except Exception as e:
#             self.sentence_ready.emit(f"An error occurred: {str(e)}")

#     def format_timestamp(self, seconds):
#         hours = int(seconds // 3600)
#         minutes = int((seconds % 3600) // 60)
#         seconds = int(seconds % 60)
#         milliseconds = int((seconds % 1) * 1000)
#         return f"{hours:02}:{minutes:02}:{seconds:02}.{milliseconds:03}"

# def convert_to_wav(file_path):
#     file_ext = os.path.splitext(file_path)[-1].lower()
#     if file_ext not in ['.wav', '.flac', '.aiff', '.aif']:
#         wav_path = os.path.join(tempfile.gettempdir(), "converted_audio.wav")
#         audio = AudioSegment.from_file(file_path)
#         audio.export(wav_path, format="wav")
#         return wav_path
#     return file_path

# class GoogleSpeechApp(QWidget):
#     # Existing code for PyQt GUI here (no changes needed)
#     pass

# @app.route("/upload", methods=["POST"])
# def upload_file():
#     if "file" not in request.files:
#         return jsonify({"error": "No file part"}), 400
#     file = request.files["file"]
#     if file.filename == "":
#         return jsonify({"error": "No selected file"}), 400
#     if file:
#         file_path = os.path.join(app.config["TS_FOLDER"], file.filename)
#         file.save(file_path)
#         return jsonify({"message": "File uploaded successfully", "file_path": file_path}), 200

# @app.route("/process_audio", methods=["POST"])
# def process_audio():
#     data = request.get_json()
#     file_path = data.get("file_path")
#     language_code = data.get("language", "en")  # Get language from frontend, default to English

#     if not file_path or not os.path.exists(file_path):
#         return jsonify({"error": "Invalid or missing file path"}), 400

#     # Mapping of user-provided language codes to Whisper-compatible codes
#     supported_languages = {
#         "en-US": "en",      # English
#         "hi-IN": "hi",      # Hindi
#         "es-ES": "es",      # Spanish
#         # Add other language mappings here as needed
#     }

#     whisper_language = supported_languages.get(language_code)
#     if not whisper_language:
#         return jsonify({"error": f"Unsupported language: {language_code}"}), 400

#     # Log the selected language
#     print(f"Selected language for transcription: {whisper_language}")

#     global transcription_result
#     transcription_result.clear()

#     try:
#         audio_file_path = convert_to_wav(file_path)
#         model = whisper.load_model("base")

#         # Transcribe with the specified language, enforcing language restriction
#         result = model.transcribe(audio_file_path, language=whisper_language, task="transcribe", verbose=True)
        
#         # Format into WEBVTT
#         webvtt_output = "WEBVTT\n\n"
#         previous_start = None
#         for segment in result["segments"]:
#             start_time = format_timestamp(segment["start"])
#             end_time = format_timestamp(segment["end"])
#             text = segment["text"].strip()
            
#             # Add each segment to the VTT output
#             if text and (start_time != previous_start):
#                 webvtt_output += f"{start_time} --> {end_time}\n{text}\n\n"
#                 previous_start = start_time

#         transcription_result.append(webvtt_output.strip())
#         return jsonify({"message": "Processing complete", "transcription": webvtt_output.strip()}), 200
#     except Exception as e:
#         return jsonify({"error": f"An error occurred: {str(e)}"}), 500

# def format_timestamp(seconds):
#     hours = int(seconds // 3600)
#     minutes = int((seconds % 3600) // 60)
#     seconds = int(seconds % 60)
#     milliseconds = int((seconds % 1) * 1000)
#     return f"{hours:02}:{minutes:02}:{seconds:02}.{milliseconds:03}"

# @app.route("/get_transcription", methods=["GET"])
# def get_transcription():
#     return jsonify({"transcription": transcription_result})

# if __name__ == "__main__":
#     app.run(debug=True, port=5002)



# import sys
# import os
# import tempfile
# from pydub import AudioSegment
# from PyQt5.QtWidgets import (
#     QApplication,
#     QWidget,
#     QVBoxLayout,
#     QHBoxLayout,
#     QPushButton,
#     QTextEdit,
#     QFileDialog,
#     QLabel,
#     QComboBox,
#     QProgressBar,
# )
# from PyQt5.QtCore import Qt, QThread, pyqtSignal
# from PyQt5.QtGui import QFont
# from flask import Flask, request, jsonify
# from flask_cors import CORS
# import whisper
# import subprocess

# app = Flask(__name__)
# CORS(app, resources={r"/*": {"origins": "http://localhost:3001"}})
# app.config["TS_FOLDER"] = tempfile.gettempdir()

# # Global variable to store transcription result
# transcription_result = []

# class WhisperSpeechProcessorThread(QThread):
#     sentence_ready = pyqtSignal(str)
#     progress_update = pyqtSignal(int)
#     processing_complete = pyqtSignal()

#     def __init__(self, audio_file_path, language=None):
#         super().__init__()
#         self.audio_file_path = audio_file_path
#         self.language = language
#         self.model = None  # Model will be assigned based on the language

#     def run(self):
#         global transcription_result
#         transcription_result.clear()
#         try:
#             audio_file_path = convert_to_wav(self.audio_file_path)

#             # Select model based on the language
#             if self.language == "hi":
#                 print("Using Vakyansh model for Hindi transcription")
#                 transcription = self.transcribe_with_vakyansh(audio_file_path)
#             else:
#                 print(f"Transcribing in language: {self.language}")
#                 self.model = whisper.load_model("large")
#                 transcription = self.model.transcribe(audio_file_path, task="transcribe", language=self.language, verbose=True)

#             # Prepare WEBVTT output
#             webvtt_output = "WEBVTT\n\n"
#             previous_start = None  # Track previous segment to avoid duplicates

#             for segment in transcription["segments"]:
#                 start_time = self.format_timestamp(segment["start"])
#                 end_time = self.format_timestamp(segment["end"])
#                 text = segment["text"].strip()

#                 # Skip empty texts or duplicate timestamps
#                 if text and (start_time != previous_start):
#                     webvtt_output += f"{start_time} --> {end_time}\n{text}\n\n"
#                     previous_start = start_time  # Update to current start for the next check

#             transcription_result.append(webvtt_output.strip())
#             self.sentence_ready.emit(webvtt_output.strip())
#             self.progress_update.emit(100)
#             self.processing_complete.emit()

#         except Exception as e:
#             self.sentence_ready.emit(f"An error occurred: {str(e)}")

#     def transcribe_with_vakyansh(self, audio_file_path):
#         # Assuming Vakyansh CLI or API integration is available
#         result = subprocess.run(["/path/to/vakyansh-cli", "--file", audio_file_path, "--lang", "hi"], capture_output=True, text=True)
#         if result.returncode != 0:
#             raise Exception(f"Vakyansh transcription failed: {result.stderr}")
#         return {"segments": self.parse_vakyansh_output(result.stdout)}

#     def parse_vakyansh_output(self, output):
#         # Parse Vakyansh output into segments
#         segments = []
#         lines = output.split('\n')
#         for line in lines:
#             parts = line.split('||')  # Replace with actual delimiter if different
#             if len(parts) == 3:
#                 start, end, text = parts
#                 segments.append({"start": float(start), "end": float(end), "text": text})
#         return segments

#     def format_timestamp(self, seconds):
#         hours = int(seconds // 3600)
#         minutes = int((seconds % 3600) // 60)
#         seconds = int(seconds % 60)
#         milliseconds = int((seconds % 1) * 1000)
#         return f"{hours:02}:{minutes:02}:{seconds:02}.{milliseconds:03}"


# def convert_to_wav(file_path):
#     file_ext = os.path.splitext(file_path)[-1].lower()
#     if file_ext not in ['.wav', '.flac', '.aiff', '.aif']:
#         wav_path = os.path.join(tempfile.gettempdir(), "converted_audio.wav")
#         audio = AudioSegment.from_file(file_path)
#         audio.export(wav_path, format="wav")
#         return wav_path
#     return file_path

# class GoogleSpeechApp(QWidget):
#     # Existing code for PyQt GUI here (no changes needed)
#     pass

# @app.route("/upload", methods=["POST"])
# def upload_file():
#     if "file" not in request.files:
#         return jsonify({"error": "No file part"}), 400
#     file = request.files["file"]
#     if file.filename == "":
#         return jsonify({"error": "No selected file"}), 400
#     if file:
#         file_path = os.path.join(app.config["TS_FOLDER"], file.filename)
#         file.save(file_path)
#         return jsonify({"message": "File uploaded successfully", "file_path": file_path}), 200

# @app.route("/process_audio", methods=["POST"])
# def process_audio():
#     data = request.get_json()
#     file_path = data.get("file_path")
#     language_code = data.get("language", "en")  # Get language from frontend, default to English

#     if not file_path or not os.path.exists(file_path):
#         return jsonify({"error": "Invalid or missing file path"}), 400

#     # Mapping of user-provided language codes to Whisper-compatible codes
#     supported_languages = {
#         "en-US": "en",      # English
#         "hi-IN": "hi",      # Hindi
#         "es-ES": "es",      # Spanish
#         # Add other language mappings here as needed
#     }

#     whisper_language = supported_languages.get(language_code)
#     if not whisper_language:
#         return jsonify({"error": f"Unsupported language: {language_code}"}), 400

#     # Log the selected language
#     print(f"Selected language for transcription: {whisper_language}")

#     global transcription_result
#     transcription_result.clear()

#     try:
#         audio_file_path = convert_to_wav(file_path)
#         if whisper_language == "hi":
#             result = WhisperSpeechProcessorThread(audio_file_path, language=whisper_language).transcribe_with_vakyansh(audio_file_path)
#         else:
#             model = whisper.load_model("base")
#             result = model.transcribe(audio_file_path, language=whisper_language, task="transcribe", verbose=True)
        
#         # Format into WEBVTT
#         webvtt_output = "WEBVTT\n\n"
#         previous_start = None
#         for segment in result["segments"]:
#             start_time = format_timestamp(segment["start"])
#             end_time = format_timestamp(segment["end"])
#             text = segment["text"].strip()
            
#             # Add each segment to the VTT output
#             if text and (start_time != previous_start):
#                 webvtt_output += f"{start_time} --> {end_time}\n{text}\n\n"
#                 previous_start = start_time

#         transcription_result.append(webvtt_output.strip())
#         return jsonify({"message": "Processing complete", "transcription": webvtt_output.strip()}), 200
#     except Exception as e:
#         return jsonify({"error": f"An error occurred: {str(e)}"}), 500

# def format_timestamp(seconds):
#     hours = int(seconds // 3600)
#     minutes = int((seconds % 3600) // 60)
#     seconds = int(seconds % 60)
#     milliseconds = int((seconds % 1) * 1000)
#     return f"{hours:02}:{minutes:02}:{seconds:02}.{milliseconds:03}"

# @app.route("/get_transcription", methods=["GET"])
# def get_transcription():
#     return jsonify({"transcription": transcription_result})

# if __name__ == "__main__":
#     app.run(debug=True, port=5003)




# #working with only english
# import sys
# import os
# import tempfile
# from pydub import AudioSegment
# from PyQt5.QtWidgets import (
#     QApplication,
#     QWidget,
#     QVBoxLayout,
#     QHBoxLayout,
#     QPushButton,
#     QTextEdit,
#     QFileDialog,
#     QLabel,
#     QComboBox,
#     QProgressBar,
# )
# from PyQt5.QtCore import Qt, QThread, pyqtSignal
# from PyQt5.QtGui import QFont
# from flask import Flask, request, jsonify
# from flask_cors import CORS
# import whisper

# app = Flask(__name__)
# CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})
# app.config["TS_FOLDER"] = tempfile.gettempdir()

# # Global variable to store transcription result
# transcription_result = []

# class WhisperSpeechProcessorThread(QThread):
#     sentence_ready = pyqtSignal(str)
#     progress_update = pyqtSignal(int)
#     processing_complete = pyqtSignal()

#     def __init__(self, audio_file_path, language=None):
#         super().__init__()
#         self.audio_file_path = audio_file_path
#         self.language = language
#         self.model = whisper.load_model("base")  # Load the Whisper model

#     def run(self):
#         global transcription_result
#         transcription_result.clear()
#         try:
#             audio_file_path = convert_to_wav(self.audio_file_path)

#             # Log the language selection
#             print(f"Transcribing in language: {self.language}")

#             # Perform transcription, ensuring the specified language is used strictly
#             result = self.model.transcribe(audio_file_path, task="transcribe", language=self.language, verbose=True)
            
#             # Prepare WEBVTT output
#             webvtt_output = "WEBVTT\n\n"
#             previous_start = None  # Track previous segment to avoid duplicates
            
#             for segment in result["segments"]:
#                 start_time = self.format_timestamp(segment["start"])
#                 end_time = self.format_timestamp(segment["end"])
#                 text = segment["text"].strip()
                
#                 # Skip empty texts or duplicate timestamps
#                 if text and (start_time != previous_start):
#                     webvtt_output += f"{start_time} --> {end_time}\n{text}\n\n"
#                     previous_start = start_time  # Update to current start for the next check

#             transcription_result.append(webvtt_output.strip())
#             self.sentence_ready.emit(webvtt_output.strip())
#             self.progress_update.emit(100)
#             self.processing_complete.emit()

#         except Exception as e:
#             self.sentence_ready.emit(f"An error occurred: {str(e)}")

#     def format_timestamp(self, seconds):
#         hours = int(seconds // 3600)
#         minutes = int((seconds % 3600) // 60)
#         seconds = int(seconds % 60)
#         milliseconds = int((seconds % 1) * 1000)
#         return f"{hours:02}:{minutes:02}:{seconds:02}.{milliseconds:03}"

# def convert_to_wav(file_path):
#     file_ext = os.path.splitext(file_path)[-1].lower()
#     if file_ext not in ['.wav', '.flac', '.aiff', '.aif']:
#         wav_path = os.path.join(tempfile.gettempdir(), "converted_audio.wav")
#         audio = AudioSegment.from_file(file_path)
#         audio.export(wav_path, format="wav")
#         return wav_path
#     return file_path

# class GoogleSpeechApp(QWidget):
#     # Existing code for PyQt GUI here (no changes needed)
#     pass

# @app.route("/upload", methods=["POST"])
# def upload_file():
#     if "file" not in request.files:
#         return jsonify({"error": "No file part"}), 400
#     file = request.files["file"]
#     if file.filename == "":
#         return jsonify({"error": "No selected file"}), 400
#     if file:
#         file_path = os.path.join(app.config["TS_FOLDER"], file.filename)
#         file.save(file_path)
#         return jsonify({"message": "File uploaded successfully", "file_path": file_path}), 200

# @app.route("/process_audio", methods=["POST"])
# def process_audio():
#     data = request.get_json()
#     file_path = data.get("file_path")
#     language_code = data.get("language", "en")  # Get language from frontend, default to English

#     if not file_path or not os.path.exists(file_path):
#         return jsonify({"error": "Invalid or missing file path"}), 400

#     # Mapping of user-provided language codes to Whisper-compatible codes
#     supported_languages = {
#         "en-US": "en",      # English
#         "hi-IN": "hi",      # Hindi
#         "es-ES": "es",      # Spanish
#         # Add other language mappings here as needed
#     }

#     whisper_language = supported_languages.get(language_code)
#     if not whisper_language:
#         return jsonify({"error": f"Unsupported language: {language_code}"}), 400

#     # Log the selected language
#     print(f"Selected language for transcription: {whisper_language}")

#     global transcription_result
#     transcription_result.clear()

#     try:
#         audio_file_path = convert_to_wav(file_path)
#         model = whisper.load_model("base")

#         # Transcribe with the specified language, enforcing language restriction
#         result = model.transcribe(audio_file_path, language=whisper_language, task="transcribe", verbose=True)
        
#         # Format into WEBVTT
#         webvtt_output = "\n"
#         previous_start = None
#         for segment in result["segments"]:
#             start_time = format_timestamp(segment["start"])
#             end_time = format_timestamp(segment["end"])
#             text = segment["text"].strip()
            
#             # Add each segment to the VTT output
#             if text and (start_time != previous_start):
#                 webvtt_output += f"{start_time} --> {end_time}\n{text}\n\n"
#                 previous_start = start_time

#         transcription_result.append(webvtt_output.strip())
#         return jsonify({"message": "Processing complete", "transcription": webvtt_output.strip()}), 200
#     except Exception as e:
#         return jsonify({"error": f"An error occurred: {str(e)}"}), 500

# def format_timestamp(seconds):
#     hours = int(seconds // 3600)
#     minutes = int((seconds % 3600) // 60)
#     seconds = int(seconds % 60)
#     milliseconds = int((seconds % 1) * 1000)
#     return f"{hours:02}:{minutes:02}:{seconds:02}.{milliseconds:03}"

# @app.route("/get_transcription", methods=["GET"])
# def get_transcription():
#     return jsonify({"transcription": transcription_result})

# if __name__ == "__main__":
#     app.run(debug=True, port=5002)



# #test with 11 labs
# import sys
# import os
# import tempfile
# import requests
# from pydub import AudioSegment
# from PyQt5.QtWidgets import (
#     QWidget,
# )
# from PyQt5.QtCore import  QThread, pyqtSignal
# from flask import Flask, request, jsonify
# from flask_cors import CORS
# import whisper

# app = Flask(__name__)
# CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})
# app.config["TS_FOLDER"] = tempfile.gettempdir()

# # Global variable to store transcription result
# transcription_result = []

# # Eleven Labs API credentials (replace with your actual API key)
# ELEVEN_LABS_API_KEY = "AIzaSyBuZGV_qCaDZyxe4kQ-OGK3qFcVS5H-QNw"
# ELEVEN_LABS_URL = "https://api.elevenlabs.io/v1/speech-to-text"

# class WhisperSpeechProcessorThread(QThread):
#     sentence_ready = pyqtSignal(str)
#     progress_update = pyqtSignal(int)
#     processing_complete = pyqtSignal()

#     def __init__(self, audio_file_path, language=None):
#         super().__init__()
#         self.audio_file_path = audio_file_path
#         self.language = language
#         self.model = whisper.load_model("base")  # Load the Whisper model

#     def run(self):
#         global transcription_result
#         transcription_result.clear()
#         try:
#             audio_file_path = convert_to_wav(self.audio_file_path)

#             # Log the language selection
#             print(f"Transcribing in language: {self.language}")

#             # Perform transcription, ensuring the specified language is used strictly
#             result = self.model.transcribe(audio_file_path, task="transcribe", language=self.language, verbose=True)
            
#             # Prepare WEBVTT output
#             webvtt_output = "WEBVTT\n\n"
#             previous_start = None  # Track previous segment to avoid duplicates
            
#             for segment in result["segments"]:
#                 start_time = self.format_timestamp(segment["start"])
#                 end_time = self.format_timestamp(segment["end"])
#                 text = segment["text"].strip()
                
#                 # Skip empty texts or duplicate timestamps
#                 if text and (start_time != previous_start):
#                     webvtt_output += f"{start_time} --> {end_time}\n{text}\n\n"
#                     previous_start = start_time  # Update to current start for the next check

#             transcription_result.append(webvtt_output.strip())
#             self.sentence_ready.emit(webvtt_output.strip())
#             self.progress_update.emit(100)
#             self.processing_complete.emit()

#         except Exception as e:
#             self.sentence_ready.emit(f"An error occurred: {str(e)}")

#     def format_timestamp(self, seconds):
#         hours = int(seconds // 3600)
#         minutes = int((seconds % 3600) // 60)
#         seconds = int(seconds % 60)
#         milliseconds = int((seconds % 1) * 1000)
#         return f"{hours:02}:{minutes:02}:{seconds:02}.{milliseconds:03}"

# def convert_to_wav(file_path):
#     file_ext = os.path.splitext(file_path)[-1].lower()
#     if file_ext not in ['.wav', '.flac', '.aiff', '.aif']:
#         wav_path = os.path.join(tempfile.gettempdir(), "converted_audio.wav")
#         audio = AudioSegment.from_file(file_path)
#         audio.export(wav_path, format="wav")
#         return wav_path
#     return file_path

# class GoogleSpeechApp(QWidget):
#     # Existing code for PyQt GUI here (no changes needed)
#     pass

# @app.route("/upload", methods=["POST"])
# def upload_file():
#     if "file" not in request.files:
#         return jsonify({"error": "No file part"}), 400
#     file = request.files["file"]
#     if file.filename == "":
#         return jsonify({"error": "No selected file"}), 400
#     if file:
#         file_path = os.path.join(app.config["TS_FOLDER"], file.filename)
#         file.save(file_path)
#         return jsonify({"message": "File uploaded successfully", "file_path": file_path}), 200

# @app.route("/process_audio", methods=["POST"])
# def process_audio():
#     data = request.get_json()
#     file_path = data.get("file_path")
#     language_code = data.get("language", "en")  # Get language from frontend, default to English

#     if not file_path or not os.path.exists(file_path):
#         return jsonify({"error": "Invalid or missing file path"}), 400

#     # Mapping of user-provided language codes to Whisper-compatible codes
#     supported_languages = {
#         "en-US": "en",      # English
#         "hi-IN": "hi",      # Hindi
#         "es-ES": "es",      # Spanish
#     }

#     whisper_language = supported_languages.get(language_code)
#     if not whisper_language:
#         return jsonify({"error": f"Unsupported language: {language_code}"}), 400

#     # Log the selected language
#     print(f"Selected language for transcription: {whisper_language}")

#     global transcription_result
#     transcription_result.clear()

#     try:
#         audio_file_path = convert_to_wav(file_path)
        
#         # If language is not English, use Eleven Labs API
#         if whisper_language != "en":
#             transcription_result = eleven_labs_transcribe(audio_file_path, whisper_language)
#         else:
#             # If language is English, use Whisper
#             model = whisper.load_model("base")
#             result = model.transcribe(audio_file_path, language=whisper_language, task="transcribe", verbose=True)
            
#             # Format into WEBVTT
#             webvtt_output = "\n"
#             previous_start = None
#             for segment in result["segments"]:
#                 start_time = format_timestamp(segment["start"])
#                 end_time = format_timestamp(segment["end"])
#                 text = segment["text"].strip()
                
#                 # Add each segment to the VTT output
#                 if text and (start_time != previous_start):
#                     webvtt_output += f"{start_time} --> {end_time}\n{text}\n\n"
#                     previous_start = start_time

#             transcription_result.append(webvtt_output.strip())

#         return jsonify({"message": "Processing complete", "transcription": transcription_result[-1]}), 200
#     except Exception as e:
#         return jsonify({"error": f"An error occurred: {str(e)}"}), 500

# def eleven_labs_transcribe(file_path, language):
#     """
#     This function uses the Eleven Labs API to transcribe non-English audio.
#     """
#     headers = {
#         "Authorization": f"Bearer {ELEVEN_LABS_API_KEY}",
#         "Content-Type": "application/json"
#     }

#     with open(file_path, "rb") as audio_file:
#         proxies = {
#         "http": "http://your.proxy.server:port",
#         "https": "http://your.proxy.server:port",
#          }
#     response = requests.post(ELEVEN_LABS_URL, headers=headers, files={"audio": audio_file}, proxies=proxies, verify=False)


    
#     if response.status_code != 200:
#         raise Exception(f"Error from Eleven Labs: {response.text}")

#     result = response.json()
#     webvtt_output = "WEBVTT\n\n"
#     previous_start = None

#     for segment in result["segments"]:
#         start_time = format_timestamp(segment["start"])
#         end_time = format_timestamp(segment["end"])
#         text = segment["text"].strip()

#         if text and (start_time != previous_start):
#             webvtt_output += f"{start_time} --> {end_time}\n{text}\n\n"
#             previous_start = start_time

#     return [webvtt_output.strip()]

# def format_timestamp(seconds):
#     hours = int(seconds // 3600)
#     minutes = int((seconds % 3600) // 60)
#     seconds = int(seconds % 60)
#     milliseconds = int((seconds % 1) * 1000)
#     return f"{hours:02}:{minutes:02}:{seconds:02}.{milliseconds:03}"

# @app.route("/get_transcription", methods=["GET"])
# def get_transcription():
#     return jsonify({"transcription": transcription_result})

# if __name__ == "__main__":
#     app.run(debug=True, port=5002)


import sys
import os
import tempfile
import requests
from pydub import AudioSegment
from PyQt5.QtWidgets import QWidget
from PyQt5.QtCore import QThread, pyqtSignal
from flask import Flask, request, jsonify
from flask_cors import CORS
import whisper

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})
app.config["TS_FOLDER"] = tempfile.gettempdir()

# Global variable to store transcription result
transcription_result = []

# Eleven Labs API credentials (replace with your actual API key)
ELEVEN_LABS_API_KEY = "AIzaSyBuZGV_qCaDZyxe4kQ-OGK3qFcVS5H-QNw"
ELEVEN_LABS_URL = "https://api.elevenlabs.io/v1/speech-to-text"

class WhisperSpeechProcessorThread(QThread):
    sentence_ready = pyqtSignal(str)
    progress_update = pyqtSignal(int)
    processing_complete = pyqtSignal()

    def __init__(self, audio_file_path, language=None):
        super().__init__()
        self.audio_file_path = audio_file_path
        self.language = language
        self.model = whisper.load_model("base")  # Load the Whisper model

    def run(self):
        global transcription_result
        transcription_result.clear()
        try:
            audio_file_path = convert_to_wav(self.audio_file_path)

            # Log the language selection
            print(f"Transcribing in language: {self.language}")

            # Perform transcription, ensuring the specified language is used strictly
            result = self.model.transcribe(audio_file_path, task="transcribe", language=self.language, verbose=True)
            
            # Prepare WEBVTT output
            webvtt_output = "WEBVTT\n\n"
            previous_start = None  # Track previous segment to avoid duplicates
            
            for segment in result["segments"]:
                start_time = self.format_timestamp(segment["start"])
                end_time = self.format_timestamp(segment["end"])
                text = segment["text"].strip()
                
                # Skip empty texts or duplicate timestamps
                if text and (start_time != previous_start):
                    webvtt_output += f"{start_time} --> {end_time}\n{text}\n\n"
                    previous_start = start_time  # Update to current start for the next check

            transcription_result.append(webvtt_output.strip())
            self.sentence_ready.emit(webvtt_output.strip())
            self.progress_update.emit(100)
            self.processing_complete.emit()

        except Exception as e:
            self.sentence_ready.emit(f"An error occurred: {str(e)}")

    def format_timestamp(self, seconds):
        hours = int(seconds // 3600)
        minutes = int((seconds % 3600) // 60)
        seconds = int(seconds % 60)
        milliseconds = int((seconds % 1) * 1000)
        return f"{hours:02}:{minutes:02}:{seconds:02}.{milliseconds:03}"

def convert_to_wav(file_path):
    file_ext = os.path.splitext(file_path)[-1].lower()
    if file_ext not in ['.wav', '.flac', '.aiff', '.aif']:
        wav_path = os.path.join(tempfile.gettempdir(), "converted_audio.wav")
        audio = AudioSegment.from_file(file_path)
        audio.export(wav_path, format="wav")
        return wav_path
    return file_path

class GoogleSpeechApp(QWidget):
    # Existing code for PyQt GUI here (no changes needed)
    pass

@app.route("/upload", methods=["POST"])
def upload_file():
    if "file" not in request.files:
        return jsonify({"error": "No file part"}), 400
    file = request.files["file"]
    if file.filename == "":
        return jsonify({"error": "No selected file"}), 400
    if file:
        file_path = os.path.join(app.config["TS_FOLDER"], file.filename)
        file.save(file_path)
        return jsonify({"message": "File uploaded successfully", "file_path": file_path}), 200

@app.route("/process_audio", methods=["POST"])
def process_audio():
    data = request.get_json()
    file_path = data.get("file_path")
    language_code = data.get("language", "en")  # Get language from frontend, default to English

    if not file_path or not os.path.exists(file_path):
        return jsonify({"error": "Invalid or missing file path"}), 400

    # Mapping of user-provided language codes to Whisper-compatible codes
    supported_languages = {
        "en-US": "en",      # English
        "hi-IN": "hi",      # Hindi
        "es-ES": "es",      # Spanish
    }

    whisper_language = supported_languages.get(language_code)
    if not whisper_language:
        return jsonify({"error": f"Unsupported language: {language_code}"}), 400

    # Log the selected language
    print(f"Selected language for transcription: {whisper_language}")

    global transcription_result
    transcription_result.clear()

    try:
        # Ensure the file remains available in the correct path
        audio_file_path = convert_to_wav(file_path)

        # If language is not English, use Eleven Labs API
        if whisper_language != "en":
            transcription_result = eleven_labs_transcribe(audio_file_path, whisper_language)
        else:
            # If language is English, use Whisper
            model = whisper.load_model("base")
            result = model.transcribe(audio_file_path, language=whisper_language, task="transcribe", verbose=True)
            
            # Format into WEBVTT
            webvtt_output = "\n"
            previous_start = None
            for segment in result["segments"]:
                start_time = format_timestamp(segment["start"])
                end_time = format_timestamp(segment["end"])
                text = segment["text"].strip()
                
                # Add each segment to the VTT output
                if text and (start_time != previous_start):
                    webvtt_output += f"{start_time} --> {end_time}\n{text}\n\n"
                    previous_start = start_time

            transcription_result.append(webvtt_output.strip())

        return jsonify({"message": "Processing complete", "transcription": transcription_result[-1]}), 200
    except Exception as e:
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500

def eleven_labs_transcribe(file_path, language):
    """
    This function uses the Eleven Labs API to transcribe non-English audio.
    """
    headers = {
        "Authorization": f"Bearer {ELEVEN_LABS_API_KEY}",
        "Content-Type": "application/json"
    }

    try:
        # Open the file in binary mode and manually manage the file pointer
        audio_file = open(file_path, "rb")
        audio_file.seek(0)  # Reset the file pointer to the beginning
        
        # Send the request with SSL verification disabled
        response = requests.post(
            ELEVEN_LABS_URL, 
            headers=headers, 
            files={"audio": audio_file}, 
            verify=False  # Disable SSL verification for testing
        )

        # Close the file after the request is complete
        audio_file.close()

        if response.status_code != 200:
            raise Exception(f"Error from Eleven Labs: {response.text}")

        result = response.json()
        webvtt_output = "WEBVTT\n\n"
        previous_start = None

        for segment in result["segments"]:
            start_time = format_timestamp(segment["start"])
            end_time = format_timestamp(segment["end"])
            text = segment["text"].strip()

            if text and (start_time != previous_start):
                webvtt_output += f"{start_time} --> {end_time}\n{text}\n\n"
                previous_start = start_time

        return [webvtt_output.strip()]

    except Exception as e:
        raise Exception(f"An error occurred while processing audio: {str(e)}")

def format_timestamp(seconds):
    hours = int(seconds // 3600)
    minutes = int((seconds % 3600) // 60)
    seconds = int(seconds % 60)
    milliseconds = int((seconds % 1) * 1000)
    return f"{hours:02}:{minutes:02}:{seconds:02}.{milliseconds:03}"

@app.route("/get_transcription", methods=["GET"])
def get_transcription():
    return jsonify({"transcription": transcription_result})

if __name__ == "__main__":
    app.run(debug=True, port=5002)
