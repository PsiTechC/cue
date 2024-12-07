# import os
# import requests
# import uuid
# from flask import Flask, request, jsonify, render_template
# from werkzeug.utils import secure_filename
# from split_audio import split_audio_file
# from mutagen.mp3 import MP3
# from ShazamAPI import Shazam
# from flask_cors import CORS
# import time
# import re

# app = Flask(__name__)
# CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})
# app.config['UPLOAD_FOLDER'] = 'ShazamAPI/eps'
# app.config['CHUNKS_FOLDER'] = 'ShazamAPI/chunks'

# # Initialize global variables for tracking progress and video duration
# total_chunks = 0
# processed_chunks = 1
# video_duration = None  # Store video duration globally


# # Home route for rendering the HTML file
# @app.route('/')
# def index():
#     # return render_template('index.html')
#     return "Hello, World!"

# def clear_folder(folder_path):
#     for filename in os.listdir(folder_path):
#         file_path = os.path.join(folder_path, filename)
#         try:
#             if os.path.isfile(file_path) or os.path.islink(file_path):
#                 os.unlink(file_path)  # Remove the file
#                 print(f"Deleted file: {file_path}")
#             elif os.path.isdir(file_path):
#                 os.rmdir(file_path)  # Remove the directory
#                 print(f"Deleted directory: {file_path}")
#         except Exception as e:
#             print(f"Failed to delete {file_path}. Reason: {e}")

# # Function to extract chunk number for sorting
# def extract_chunk_number(filename):
#     match = re.search(r'chunk(\d+)', filename)
#     return int(match.group(1)) if match else float('inf')  # Handle non-matching filenames

# # Route to upload file with metadata and automatically split into chunks
# @app.route('/upload', methods=['POST'])
# def upload_file():
#     global total_chunks, processed_chunks, video_duration

#     # Generate a unique folder for each user's upload using UUID
#     user_id = str(uuid.uuid4())  # Create unique user-specific folder name
#     user_chunks_folder = os.path.join(app.config['CHUNKS_FOLDER'], user_id)
#     user_eps_folder = os.path.join(app.config['UPLOAD_FOLDER'], user_id)

#     # Log the folder path creation
#     print(f"Creating user-specific folder: {user_chunks_folder}")
#     print(f"Creating user-specific eps folder: {user_eps_folder}")

#     # Metadata from the form
#     tv_channel = request.form.get('tvChannel')
#     episode_number = request.form.get('episodeNumber')
#     on_air_date = request.form.get('onAirDate')
#     movie_album = request.form.get('movieAlbum')

#     if 'file' not in request.files:
#         print("No file part found in the request")
#         return jsonify({"error": "No file part"}), 400

#     file = request.files['file']
#     if file.filename == '':
#         print("No file selected")
#         return jsonify({"error": "No selected file"}), 400

#     if file:
#         filename = secure_filename(file.filename)
#         if not os.path.exists(user_eps_folder):
#             os.makedirs(user_eps_folder)  # Create user-specific folder inside eps
#         filepath = os.path.join(user_eps_folder, filename)
#         file.save(filepath)

#         # Log the saved file path
#         print(f"File saved at: {filepath}")

#         # Get the duration of the uploaded MP3 file using mutagen's MP3 class
#         try:
#             audio = MP3(filepath)
#             video_duration_in_seconds = audio.info.length
#             print(f"File duration: {video_duration_in_seconds} seconds")
#         except Exception as e:
#             print(f"Error processing MP3 file: {e}")
#             return jsonify({"error": "Error processing MP3 file"}), 500

#         # Convert the duration into HH:MM:SS format
#         minutes, seconds = divmod(int(video_duration_in_seconds), 60)
#         hours, minutes = divmod(minutes, 60)
#         video_duration = f"{str(hours).zfill(2)}:{str(minutes).zfill(2)}:{str(seconds).zfill(2)}"

#         # Automatically split audio into user-specific chunks folder after upload
#         if not os.path.exists(user_chunks_folder):
#             os.makedirs(user_chunks_folder)
#             print(f"Created directory for chunks: {user_chunks_folder}")

#         try:
#             split_audio_file(filepath, user_chunks_folder)  # Use user-specific folder for chunks
#             print(f"Audio file split into chunks in: {user_chunks_folder}")
#         except Exception as e:
#             print(f"Error splitting audio file: {e}")
#             return jsonify({"error": "Error splitting audio file"}), 500

#         # Calculate total chunks
#         total_chunks = len([f for f in os.listdir(user_chunks_folder) if f.endswith('.mp3')])
#         processed_chunks = 0  # Reset processed chunks

#         print(f"Total chunks created: {total_chunks}")

#         return jsonify({"fileName": filename, "videoDuration": video_duration, "userId": user_id})

# # Route to detect songs using the Shazam API and update chunk progress
# @app.route('/detect', methods=['POST'])
# def detect_songs():
#     global processed_chunks, video_duration
    
#     # Ensure that userId is provided
#     user_id = request.json.get('userId')
#     if not user_id:
#         return jsonify({"error": "Missing userId in request"}), 400

#     # Set user-specific chunks folder
#     user_chunks_folder = os.path.join(app.config['CHUNKS_FOLDER'], user_id)
#     user_eps_folder = os.path.join(app.config['UPLOAD_FOLDER'], user_id)
    
#     # Log the user-specific folder being processed
#     print(f"Detecting songs in folder: {user_chunks_folder}")

#     if not os.path.exists(user_chunks_folder):
#         print(f"User-specific folder {user_chunks_folder} not found")
#         return jsonify({'error': 'Chunks folder not found for user.'}), 400

#     chunk_duration = 10
#     detected_songs = []

#     # Get sorted chunk files based on chunk number
#     chunk_files = sorted([f for f in os.listdir(user_chunks_folder) if f.endswith('.mp3')], key=extract_chunk_number)

#     # Log the chunk files being processed
#     print(f"Chunks to process: {chunk_files}")

#     if not chunk_files:
#         print(f"No chunk files found in {user_chunks_folder}")
#         return jsonify({'error': 'No chunk files found for user.'}), 400

#     for chunk_filename in chunk_files:
#         chunk_number = int(chunk_filename.split('chunk')[1].split('.mp3')[0])
#         start_time = (chunk_number - 1) * chunk_duration
#         end_time = chunk_number * chunk_duration
#         chunk_result = f"chunk{str(chunk_number).zfill(2)}: "  # For logging
        

#         chunk_path = os.path.join(user_chunks_folder, chunk_filename)
        
#         # Log the chunk path being processed
#         print(f"Processing chunk: {chunk_path}")

#         try:
#             with open(chunk_path, 'rb') as fp:
#                 mp3_file_content_to_recognize = fp.read()
#                 print(f"Read chunk file: {chunk_path}")

#             print(f"Starting song recognition for chunk {chunk_filename}")
#             recognize_generator = Shazam().recognize_song(mp3_file_content_to_recognize)

#             found_song = False
#             for (offset, resp) in recognize_generator:
#                 if 'track' in resp:
#                     track = resp['track']
#                     title = track.get('title', 'Unknown')
#                     artist1 = track.get('subtitle', 'Unknown')
#                     shazam_link = track.get('share', {}).get('href', 'N/A')

#                     detected_songs.append({
#                         'title': title,
#                         'artist1': artist1,
#                         'start_time': start_time,
#                         'end_time': end_time,
#                         'shazam_link': shazam_link
#                     })
#                     found_song = True
#                     break

#             if found_song:
#                 chunk_result += "song detected"
#                 print(f"Song detected in {chunk_filename}: {title} by {artist1}")
#             else:
#                 chunk_result += "no song detected"
#                 print(f"No song detected in {chunk_filename}")

#         except Exception as e:
#             chunk_result += f"error - {str(e)}"
#             print(f"Error processing chunk {chunk_filename}: {str(e)}")

#         # Log the result for this chunk
#         print(chunk_result)

#         # Simulate processing time for each chunk
#         time.sleep(2)  # Simulate each chunk taking 2 seconds to process
#         processed_chunks += 1
#         print(f"Processed chunks (increment): {processed_chunks}")  # Check if this prints as expected

#     # Clear the user-specific folder after detection and table rendering
#     print(f"Clearing folder {user_chunks_folder} and {user_eps_folder}")
#     clear_folder(user_chunks_folder)
#     os.rmdir(user_chunks_folder)  # Remove the folder after processing

#     # Also clear the eps folder
#     clear_folder(user_eps_folder)
#     os.rmdir(user_eps_folder)

#     # Log completion of processing
#     print(f"Completed song detection for user: {user_id}")

#     return jsonify({'songs': detected_songs, 'videoDuration': video_duration})


# # Route to get total chunks for the frontend
# @app.route('/get-total-chunks', methods=['GET'])
# def get_total_chunks():
#     return jsonify({'totalChunks': total_chunks})

# # Route to get current chunk progress
# @app.route('/get-progress', methods=['GET'])
# def get_progress():
#     print(f"Processed chunks (for debug): {processed_chunks}")  
#     return jsonify({'processedChunks': processed_chunks})


# @app.route('/shorten-url', methods=['POST'])
# def shorten_url():
#     long_url = request.json.get('url')
#     custom_name = request.json.get('custom', 'Psi')  # Use custom name, default is 'Psi'
#     if not long_url:
#         print("No URL provided for shortening")
#         return jsonify({'error': 'No URL provided'}), 400

#     try:
#         # Construct the URL with the custom name
#         api_url = f"https://ulvis.net/api.php?url={long_url}&custom={custom_name}&private=1"
        
#         # Log the URL being sent to Ulvis.net
#         print(f"Sending URL to shorten: {api_url}")
        
#         # Make the GET request to Ulvis.net API
#         response = requests.get(api_url)
#         print(f"Ulvis.net response: {response.text}")  # Log the response from Ulvis
        
#         if response.status_code == 200:
#             return response.text  # Send back the shortened URL
#         else:
#             return jsonify({'error': 'Failed to shorten URL'}), response.status_code
#     except Exception as e:
#         print(f"Error shortening URL: {e}")
#         return jsonify({'error': str(e)}), 500

# if __name__ == '__main__':
#     app.run(debug=True, port=5003)



#full audio stream
# import os
# import requests
# import uuid
# from flask import Flask, request, jsonify
# from werkzeug.utils import secure_filename
# from mutagen.mp3 import MP3
# from ShazamAPI import Shazam
# from flask_cors import CORS
# import time

# app = Flask(__name__)
# CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})
# app.config['UPLOAD_FOLDER'] = 'ShazamAPI/eps'

# # Initialize global variables for tracking progress and video duration
# video_duration = None  # Store video duration globally

# # Home route for rendering the HTML file
# @app.route('/')
# def index():
#     return "Hello, World!"

# def clear_folder(folder_path):
#     for filename in os.listdir(folder_path):
#         file_path = os.path.join(folder_path, filename)
#         try:
#             if os.path.isfile(file_path) or os.path.islink(file_path):
#                 os.unlink(file_path)
#                 print(f"Deleted file: {file_path}")
#             elif os.path.isdir(file_path):
#                 os.rmdir(file_path)
#                 print(f"Deleted directory: {file_path}")
#         except Exception as e:
#             print(f"Failed to delete {file_path}. Reason: {e}")

# # Route to upload file with metadata and store it for processing
# @app.route('/upload', methods=['POST'])
# def upload_file():
#     global video_duration

#     user_id = str(uuid.uuid4())
#     user_eps_folder = os.path.join(app.config['UPLOAD_FOLDER'], user_id)

#     if 'file' not in request.files:
#         return jsonify({"error": "No file part"}), 400

#     file = request.files['file']
#     if file.filename == '':
#         return jsonify({"error": "No selected file"}), 400

#     if file:
#         filename = secure_filename(file.filename)
#         if not os.path.exists(user_eps_folder):
#             os.makedirs(user_eps_folder)
#         filepath = os.path.join(user_eps_folder, filename)
#         file.save(filepath)

#         # Get duration of the uploaded MP3 file
#         try:
#             audio = MP3(filepath)
#             video_duration_in_seconds = int(audio.info.length)
#             video_duration = f"{video_duration_in_seconds // 3600:02}:{(video_duration_in_seconds % 3600) // 60:02}:{video_duration_in_seconds % 60:02}"
#         except Exception as e:
#             return jsonify({"error": "Error processing MP3 file"}), 500

#         return jsonify({"fileName": filename, "videoDuration": video_duration, "userId": user_id})

# # Route to detect songs using the Shazam API on the whole audio file continuously
# @app.route('/detect', methods=['POST'])
# def detect_songs():
#     global video_duration
    
#     user_id = request.json.get('userId')
#     if not user_id:
#         return jsonify({"error": "Missing userId in request"}), 400

#     user_eps_folder = os.path.join(app.config['UPLOAD_FOLDER'], user_id)
#     uploaded_files = [f for f in os.listdir(user_eps_folder) if f.endswith('.mp3')]
#     if not uploaded_files:
#         return jsonify({"error": "No audio file found for detection"}), 400

#     filepath = os.path.join(user_eps_folder, uploaded_files[0])
#     detected_songs = []

#     try:
#         # Load the entire audio file for Shazam detection
#         with open(filepath, 'rb') as fp:
#             mp3_file_content_to_recognize = fp.read()
#             print(f"Starting song recognition on entire audio: {filepath}")

#             recognize_generator = Shazam().recognize_song(mp3_file_content_to_recognize)
#             for offset, resp in recognize_generator:
#                 if 'track' in resp:
#                     track = resp['track']
#                     title = track.get('title', '-')
#                     artist = track.get('subtitle', '-')
#                     shazam_link = track.get('share', {}).get('href', 'N/A')
#                     timestamp = int(offset / 1000)  # Shazam offset is usually in milliseconds

#                     # Format timestamp into HH:MM:SS
#                     formatted_time = f"{timestamp // 3600:02}:{(timestamp % 3600) // 60:02}:{timestamp % 60:02}"
                    
#                     detected_songs.append({
#                         'title': title,
#                         'artist': artist,
#                         'start_time': formatted_time,
#                         'shazam_link': shazam_link
#                     })
#                     print(f"Detected song at {formatted_time}: {title} by {artist}")

#                 else:
#                     # No song detected, use placeholder data
#                     timestamp = len(detected_songs)
#                     formatted_time = f"{timestamp // 3600:02}:{(timestamp % 3600) // 60:02}:{timestamp % 60:02}"
#                     detected_songs.append({
#                         'title': '-',
#                         'artist': '-',
#                         'start_time': formatted_time,
#                         'shazam_link': 'N/A'
#                     })

#                 # Check if we have reached or exceeded the duration of the audio file
#                 if timestamp >= int(video_duration.split(':')[2]):
#                     break

#                 time.sleep(1)  # Brief delay to prevent excessive API calls

#     except Exception as e:
#         return jsonify({"error": str(e)}), 500

#     return jsonify({'songs': detected_songs, 'videoDuration': video_duration})



# # Route to get total chunks for the frontend
# @app.route('/get-total-chunks', methods=['GET'])
# def get_total_chunks():
#     return jsonify({'totalChunks': total_chunks})

# # Route to get current chunk progress
# @app.route('/get-progress', methods=['GET'])
# def get_progress():
#     print(f"Processed chunks (for debug): {processed_chunks}")  
#     return jsonify({'processedChunks': processed_chunks})

# @app.route('/shorten-url', methods=['POST'])
# def shorten_url():
#     long_url = request.json.get('url')
    
#     if not long_url:
#         print("No URL provided for shortening")
#         return jsonify({'error': 'No URL provided'}), 400

#     try:
#         # Construct the URL with the custom name
#         api_url = f"https://ulvis.net/api.php?url={long_url}&private=1"
        
#         while True:
#             try:
#                 # Log the URL being sent to Ulvis.net
#                 print(f"Sending URL to shorten: {api_url}")

#                 # Make the GET request to Ulvis.net API
#                 response = requests.get(api_url)
#                 print(f"Ulvis.net response: {response.text}")  # Log the response from Ulvis

#                 if response.status_code == 200 and "Error:" not in response.text:
#                     return response.text  # Send back the shortened URL
#                 elif response.status_code != 200 or "Error:" in response.text:
#                     print(f"Error detected ({response.text.strip()}), pausing for 60 seconds.")
#                     time.sleep(30)  # Pause for 60 seconds if spam is detected
#                     continue
#                 else:
#                     print(f"Failed to shorten URL for {long_url}")
#                     return jsonify({'error': 'Failed to shorten URL'}), response.status_code

#             except Exception as e:
#                 print(f"Error shortening URL: {e}")
#                 return jsonify({'error': str(e)}), 500

#     except Exception as e:
#         print(f"Unexpected error: {e}")
#         return jsonify({'error': str(e)}), 500



# if __name__ == '__main__':
#     app.run(debug=True, port=5003)







# # #working without vocals implementation
# import os
# import requests
# import uuid
# from flask import Flask, request, jsonify, render_template
# from werkzeug.utils import secure_filename
# from split_audio import split_audio_file
# from mutagen.mp3 import MP3
# from ShazamAPI import Shazam
# from flask_cors import CORS
# import time
# import re

# app = Flask(__name__)
# CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})
# app.config['UPLOAD_FOLDER'] = 'ShazamAPI/eps'
# app.config['CHUNKS_FOLDER'] = 'ShazamAPI/chunks'

# # Initialize global variables for tracking progress and video duration
# total_chunks = 0
# processed_chunks = 1
# video_duration = None  # Store video duration globally


# # Home route for rendering the HTML file
# @app.route('/')
# def index():
#     # return render_template('index.html')
#     return "Hello, World!"

# def clear_folder(folder_path):
#     for filename in os.listdir(folder_path):
#         file_path = os.path.join(folder_path, filename)
#         try:
#             if os.path.isfile(file_path) or os.path.islink(file_path):
#                 os.unlink(file_path)  # Remove the file
#                 print(f"Deleted file: {file_path}")
#             elif os.path.isdir(file_path):
#                 os.rmdir(file_path)  # Remove the directory
#                 print(f"Deleted directory: {file_path}")
#         except Exception as e:
#             print(f"Failed to delete {file_path}. Reason: {e}")

# # Function to extract chunk number for sorting
# def extract_chunk_number(filename):
#     match = re.search(r'chunk(\d+)', filename)
#     return int(match.group(1)) if match else float('inf')  # Handle non-matching filenames

# # Route to upload file with metadata and automatically split into chunks
# @app.route('/upload', methods=['POST'])
# def upload_file():
#     global total_chunks, processed_chunks, video_duration

#     # Generate a unique folder for each user's upload using UUID
#     user_id = str(uuid.uuid4())  # Create unique user-specific folder name
#     user_chunks_folder = os.path.join(app.config['CHUNKS_FOLDER'], user_id)
#     user_eps_folder = os.path.join(app.config['UPLOAD_FOLDER'], user_id)

#     # Log the folder path creation
#     print(f"Creating user-specific folder: {user_chunks_folder}")
#     print(f"Creating user-specific eps folder: {user_eps_folder}")

#     # Metadata from the form
#     tv_channel = request.form.get('tvChannel')
#     episode_number = request.form.get('episodeNumber')
#     on_air_date = request.form.get('onAirDate')
#     movie_album = request.form.get('movieAlbum')

#     if 'file' not in request.files:
#         print("No file part found in the request")
#         return jsonify({"error": "No file part"}), 400

#     file = request.files['file']
#     if file.filename == '':
#         print("No file selected")
#         return jsonify({"error": "No selected file"}), 400

#     if file:
#         filename = secure_filename(file.filename)
#         if not os.path.exists(user_eps_folder):
#             os.makedirs(user_eps_folder)  # Create user-specific folder inside eps
#         filepath = os.path.join(user_eps_folder, filename)
#         file.save(filepath)

#         # Log the saved file path
#         print(f"File saved at: {filepath}")

#         # Get the duration of the uploaded MP3 file using mutagen's MP3 class
#         try:
#             audio = MP3(filepath)
#             video_duration_in_seconds = audio.info.length
#             print(f"File duration: {video_duration_in_seconds} seconds")
#         except Exception as e:
#             print(f"Error processing MP3 file: {e}")
#             return jsonify({"error": "Error processing MP3 file"}), 500

#         # Convert the duration into HH:MM:SS format
#         minutes, seconds = divmod(int(video_duration_in_seconds), 60)
#         hours, minutes = divmod(minutes, 60)
#         video_duration = f"{str(hours).zfill(2)}:{str(minutes).zfill(2)}:{str(seconds).zfill(2)}"

#         # Automatically split audio into user-specific chunks folder after upload
#         if not os.path.exists(user_chunks_folder):
#             os.makedirs(user_chunks_folder)
#             print(f"Created directory for chunks: {user_chunks_folder}")

#         try:
#             split_audio_file(filepath, user_chunks_folder)  # Use user-specific folder for chunks
#             print(f"Audio file split into chunks in: {user_chunks_folder}")
#         except Exception as e:
#             print(f"Error splitting audio file: {e}")
#             return jsonify({"error": "Error splitting audio file"}), 500

#         # Calculate total chunks
#         total_chunks = len([f for f in os.listdir(user_chunks_folder) if f.endswith('.mp3')])
#         processed_chunks = 0  # Reset processed chunks

#         print(f"Total chunks created: {total_chunks}")

#         return jsonify({"fileName": filename, "videoDuration": video_duration, "userId": user_id})

# # Route to detect songs using the Shazam API and update chunk progress
# @app.route('/detect', methods=['POST'])
# def detect_songs():
#     global processed_chunks, video_duration
    
#     # Ensure that userId is provided
#     user_id = request.json.get('userId')
#     if not user_id:
#         return jsonify({"error": "Missing userId in request"}), 400

#     # Set user-specific chunks folder
#     user_chunks_folder = os.path.join(app.config['CHUNKS_FOLDER'], user_id)
#     user_eps_folder = os.path.join(app.config['UPLOAD_FOLDER'], user_id)
    
#     # Log the user-specific folder being processed
#     print(f"Detecting songs in folder: {user_chunks_folder}")

#     if not os.path.exists(user_chunks_folder):
#         print(f"User-specific folder {user_chunks_folder} not found")
#         return jsonify({'error': 'Chunks folder not found for user.'}), 400

#     chunk_duration = 5
#     detected_songs = []

#     # Get sorted chunk files based on chunk number
#     chunk_files = sorted([f for f in os.listdir(user_chunks_folder) if f.endswith('.mp3')], key=extract_chunk_number)

#     # Log the chunk files being processed
#     print(f"Chunks to process: {chunk_files}")

#     if not chunk_files:
#         print(f"No chunk files found in {user_chunks_folder}")
#         return jsonify({'error': 'No chunk files found for user.'}), 400

#     for chunk_filename in chunk_files:
#         chunk_number = int(chunk_filename.split('chunk')[1].split('.mp3')[0])
#         start_time = (chunk_number - 1) * chunk_duration
#         end_time = chunk_number * chunk_duration
#         chunk_result = f"chunk{str(chunk_number).zfill(2)}: "  # For logging
        

#         chunk_path = os.path.join(user_chunks_folder, chunk_filename)
        
#         # Log the chunk path being processed
#         print(f"Processing chunk: {chunk_path}")

#         try:
#             with open(chunk_path, 'rb') as fp:
#                 mp3_file_content_to_recognize = fp.read()
#                 print(f"Read chunk file: {chunk_path}")

#             print(f"Starting song recognition for chunk {chunk_filename}")
#             recognize_generator = Shazam().recognize_song(mp3_file_content_to_recognize)

#             found_song = False
#             for (offset, resp) in recognize_generator:
#                 if 'track' in resp:
#                     track = resp['track']
#                     title = track.get('title', 'Unknown')
#                     artist1 = track.get('subtitle', 'Unknown')
#                     shazam_link = track.get('share', {}).get('href', 'N/A')

#                     detected_songs.append({
#                         'title': title,
#                         'artist1': artist1,
#                         'start_time': start_time,
#                         'end_time': end_time,
#                         'shazam_link': shazam_link
#                     })
#                     found_song = True
#                     break

#             if found_song:
#                 chunk_result += "song detected"
#                 print(f"Song detected in {chunk_filename}: {title} by {artist1}")
#             else:
#                 chunk_result += "no song detected"
#                 print(f"No song detected in {chunk_filename}")

#         except Exception as e:
#             chunk_result += f"error - {str(e)}"
#             print(f"Error processing chunk {chunk_filename}: {str(e)}")

#         # Log the result for this chunk
#         print(chunk_result)

#         # Simulate processing time for each chunk
#         time.sleep(5)  # Simulate each chunk taking 2 seconds to process
#         processed_chunks += 1
#         print(f"Processed chunks (increment): {processed_chunks}")  # Check if this prints as expected

#     # Clear the user-specific folder after detection and table rendering
#     print(f"Clearing folder {user_chunks_folder} and {user_eps_folder}")
#     clear_folder(user_chunks_folder)
#     os.rmdir(user_chunks_folder)  # Remove the folder after processing

#     # Also clear the eps folder
#     clear_folder(user_eps_folder)
#     os.rmdir(user_eps_folder)

#     # Log completion of processing
#     print(f"Completed song detection for user: {user_id}")

#     return jsonify({'songs': detected_songs, 'videoDuration': video_duration})


# # Route to get total chunks for the frontend
# @app.route('/get-total-chunks', methods=['GET'])
# def get_total_chunks():
#     return jsonify({'totalChunks': total_chunks})

# # Route to get current chunk progress
# @app.route('/get-progress', methods=['GET'])
# def get_progress():
#     print(f"Processed chunks (for debug): {processed_chunks}")  
#     return jsonify({'processedChunks': processed_chunks})

# @app.route('/shorten-url', methods=['POST'])
# def shorten_url():
#     long_url = request.json.get('url')
    
#     if not long_url:
#         print("No URL provided for shortening")
#         return jsonify({'error': 'No URL provided'}), 400

#     try:
#         # Construct the URL with the custom name
#         api_url = f"https://ulvis.net/api.php?url={long_url}&private=1"
        
#         while True:
#             try:
#                 # Log the URL being sent to Ulvis.net
#                 print(f"Sending URL to shorten: {api_url}")

#                 # Make the GET request to Ulvis.net API
#                 response = requests.get(api_url)
#                 print(f"Ulvis.net response: {response.text}")  # Log the response from Ulvis

#                 if response.status_code == 200 and "Error:" not in response.text:
#                     return response.text  # Send back the shortened URL
#                 elif response.status_code != 200 or "Error:" in response.text:
#                     print(f"Error detected ({response.text.strip()}), pausing for 60 seconds.")
#                     time.sleep(30)  # Pause for 60 seconds if spam is detected
#                     continue
#                 else:
#                     print(f"Failed to shorten URL for {long_url}")
#                     return jsonify({'error': 'Failed to shorten URL'}), response.status_code

#             except Exception as e:
#                 print(f"Error shortening URL: {e}")
#                 return jsonify({'error': str(e)}), 500

#     except Exception as e:
#         print(f"Unexpected error: {e}")
#         return jsonify({'error': str(e)}), 500



# if __name__ == '__main__':
#     app.run(debug=True, port=5003)




# import os
# import requests
# import uuid
# from flask import Flask, request, jsonify, render_template
# from werkzeug.utils import secure_filename
# from split_audio import split_audio_file
# from mutagen.mp3 import MP3
# from ShazamAPI import Shazam
# from flask_cors import CORS
# import time
# import re

# app = Flask(__name__)
# CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})
# app.config['UPLOAD_FOLDER'] = 'ShazamAPI/eps'
# app.config['CHUNKS_FOLDER'] = 'ShazamAPI/chunks'

# # Initialize global variables for tracking progress and video duration
# total_chunks = 0
# processed_chunks = 1
# video_duration = None  # Store video duration globally


# # Home route for rendering the HTML file
# @app.route('/')
# def index():
#     # return render_template('index.html')
#     return "Hello, World!"

# def clear_folder(folder_path):
#     for filename in os.listdir(folder_path):
#         file_path = os.path.join(folder_path, filename)
#         try:
#             if os.path.isfile(file_path) or os.path.islink(file_path):
#                 os.unlink(file_path)  # Remove the file
#                 print(f"Deleted file: {file_path}")
#             elif os.path.isdir(file_path):
#                 os.rmdir(file_path)  # Remove the directory
#                 print(f"Deleted directory: {file_path}")
#         except Exception as e:
#             print(f"Failed to delete {file_path}. Reason: {e}")

# # Function to extract chunk number for sorting
# def extract_chunk_number(filename):
#     match = re.search(r'chunk(\d+)', filename)
#     return int(match.group(1)) if match else float('inf')  # Handle non-matching filenames

# # Route to upload file with metadata and automatically split into chunks
# @app.route('/upload', methods=['POST'])
# def upload_file():
#     global total_chunks, processed_chunks, video_duration

#     # Generate a unique folder for each user's upload using UUID
#     user_id = str(uuid.uuid4())  # Create unique user-specific folder name
#     user_chunks_folder = os.path.join(app.config['CHUNKS_FOLDER'], user_id)
#     user_eps_folder = os.path.join(app.config['UPLOAD_FOLDER'], user_id)

#     # Log the folder path creation
#     print(f"Creating user-specific folder: {user_chunks_folder}")
#     print(f"Creating user-specific eps folder: {user_eps_folder}")

#     # Metadata from the form
#     tv_channel = request.form.get('tvChannel')
#     episode_number = request.form.get('episodeNumber')
#     on_air_date = request.form.get('onAirDate')
#     movie_album = request.form.get('movieAlbum')

#     if 'file' not in request.files:
#         print("No file part found in the request")
#         return jsonify({"error": "No file part"}), 400

#     file = request.files['file']
#     if file.filename == '':
#         print("No file selected")
#         return jsonify({"error": "No selected file"}), 400

#     if file:
#         filename = secure_filename(file.filename)
#         if not os.path.exists(user_eps_folder):
#             os.makedirs(user_eps_folder)  # Create user-specific folder inside eps
#         filepath = os.path.join(user_eps_folder, filename)
#         file.save(filepath)

#         # Log the saved file path
#         print(f"File saved at: {filepath}")

#         # Get the duration of the uploaded MP3 file using mutagen's MP3 class
#         try:
#             audio = MP3(filepath)
#             video_duration_in_seconds = audio.info.length
#             print(f"File duration: {video_duration_in_seconds} seconds")
#         except Exception as e:
#             print(f"Error processing MP3 file: {e}")
#             return jsonify({"error": "Error processing MP3 file"}), 500

#         # Convert the duration into HH:MM:SS format
#         minutes, seconds = divmod(int(video_duration_in_seconds), 60)
#         hours, minutes = divmod(minutes, 60)
#         video_duration = f"{str(hours).zfill(2)}:{str(minutes).zfill(2)}:{str(seconds).zfill(2)}"

#         # Automatically split audio into user-specific chunks folder after upload
#         if not os.path.exists(user_chunks_folder):
#             os.makedirs(user_chunks_folder)
#             print(f"Created directory for chunks: {user_chunks_folder}")

#         try:
#             split_audio_file(filepath, user_chunks_folder)  # Use user-specific folder for chunks
#             print(f"Audio file split into chunks in: {user_chunks_folder}")
#         except Exception as e:
#             print(f"Error splitting audio file: {e}")
#             return jsonify({"error": "Error splitting audio file"}), 500

#         # Calculate total chunks
#         total_chunks = len([f for f in os.listdir(user_chunks_folder) if f.endswith('.mp3')])
#         processed_chunks = 0  # Reset processed chunks

#         print(f"Total chunks created: {total_chunks}")

#         return jsonify({"fileName": filename, "videoDuration": video_duration, "userId": user_id})

# @app.route('/detect', methods=['POST'])
# def detect_songs():
#     global processed_chunks, video_duration
    
#     # Ensure that userId is provided
#     user_id = request.json.get('userId')
#     if not user_id:
#         return jsonify({"error": "Missing userId in request"}), 400

#     # Set user-specific chunks folder
#     user_chunks_folder = os.path.join(app.config['CHUNKS_FOLDER'], user_id)
#     user_eps_folder = os.path.join(app.config['UPLOAD_FOLDER'], user_id)
    
#     # Log the user-specific folder being processed
#     print(f"Detecting songs in folder: {user_chunks_folder}")

#     if not os.path.exists(user_chunks_folder):
#         print(f"User-specific folder {user_chunks_folder} not found")
#         return jsonify({'error': 'Chunks folder not found for user.'}), 400

#     chunk_duration = 5
#     detected_songs = []

#     # Get sorted chunk files based on chunk number
#     chunk_files = sorted([f for f in os.listdir(user_chunks_folder) if f.endswith('.mp3')], key=extract_chunk_number)

#     # Log the chunk files being processed
#     print(f"Chunks to process: {chunk_files}")

#     if not chunk_files:
#         print(f"No chunk files found in {user_chunks_folder}")
#         return jsonify({'error': 'No chunk files found for user.'}), 400

#     for chunk_filename in chunk_files:
#         chunk_number = int(chunk_filename.split('chunk')[1].split('.mp3')[0])
#         start_time = (chunk_number - 1) * chunk_duration
#         end_time = chunk_number * chunk_duration
#         chunk_result = f"chunk{str(chunk_number).zfill(2)}: "  # For logging

#         chunk_path = os.path.join(user_chunks_folder, chunk_filename)
        
#         # Log the chunk path being processed
#         print(f"Processing chunk: {chunk_path}")

#         try:
#             with open(chunk_path, 'rb') as fp:
#                 mp3_file_content_to_recognize = fp.read()
#                 print(f"Read chunk file: {chunk_path}")

#             print(f"Starting song recognition for chunk {chunk_filename}")
#             recognize_generator = Shazam().recognize_song(mp3_file_content_to_recognize)

#             found_song = False
#             for (offset, resp) in recognize_generator:
#                 if 'track' in resp:
#                     track = resp['track']
#                     title = track.get('title', 'Unknown')
#                     artist1 = track.get('subtitle', 'Unknown')
#                     shazam_link = track.get('share', {}).get('href', 'N/A')

#                     detected_songs.append({
#                         'title': title,
#                         'artist1': artist1,
#                         'start_time': start_time,
#                         'end_time': end_time,
#                         'shazam_link': shazam_link
#                     })
#                     found_song = True
#                     break

#             if found_song:
#                 chunk_result += "song detected"
#                 print(f"Song detected in {chunk_filename}: {title} by {artist1}")
#             else:
#                 # No song detected, add entry with chunk filename as title
#                 detected_songs.append({
#                     'title': chunk_filename,  # Use chunk filename for "no song detected" entries
#                     'artist1': '-',
#                     'start_time': start_time,
#                     'end_time': end_time,
#                     'shazam_link': 'N/A'
#                 })
#                 chunk_result += "no song detected"
#                 print(f"No song detected in {chunk_filename}")

#         except Exception as e:
#             chunk_result += f"error - {str(e)}"
#             print(f"Error processing chunk {chunk_filename}: {str(e)}")

#         # Log the result for this chunk
#         print(chunk_result)

#         # Simulate processing time for each chunk
#         time.sleep(5)  # Simulate each chunk taking 2 seconds to process
#         processed_chunks += 1
#         print(f"Processed chunks (increment): {processed_chunks}")

#     # Clear the user-specific folder after detection and table rendering
#     print(f"Clearing folder {user_chunks_folder} and {user_eps_folder}")
#     clear_folder(user_chunks_folder)
#     os.rmdir(user_chunks_folder)  # Remove the folder after processing

#     # Also clear the eps folder
#     clear_folder(user_eps_folder)
#     os.rmdir(user_eps_folder)

#     # Log completion of processing
#     print(f"Completed song detection for user: {user_id}")

#     return jsonify({'songs': detected_songs, 'videoDuration': video_duration})


# # Route to get total chunks for the frontend
# @app.route('/get-total-chunks', methods=['GET'])
# def get_total_chunks():
#     return jsonify({'totalChunks': total_chunks})

# # Route to get current chunk progress
# @app.route('/get-progress', methods=['GET'])
# def get_progress():
#     print(f"Processed chunks (for debug): {processed_chunks}")  
#     return jsonify({'processedChunks': processed_chunks})

# @app.route('/shorten-url', methods=['POST'])
# def shorten_url():
#     long_url = request.json.get('url')
    
#     if not long_url:
#         print("No URL provided for shortening")
#         return jsonify({'error': 'No URL provided'}), 400

#     try:
#         # Construct the URL with the custom name
#         api_url = f"https://ulvis.net/api.php?url={long_url}&private=1"
        
#         while True:
#             try:
#                 # Log the URL being sent to Ulvis.net
#                 print(f"Sending URL to shorten: {api_url}")

#                 # Make the GET request to Ulvis.net API
#                 response = requests.get(api_url)
#                 print(f"Ulvis.net response: {response.text}")  # Log the response from Ulvis

#                 if response.status_code == 200 and "Error:" not in response.text:
#                     return response.text  # Send back the shortened URL
#                 elif response.status_code != 200 or "Error:" in response.text:
#                     print(f"Error detected ({response.text.strip()}), pausing for 60 seconds.")
#                     time.sleep(30)  # Pause for 60 seconds if spam is detected
#                     continue
#                 else:
#                     print(f"Failed to shorten URL for {long_url}")
#                     return jsonify({'error': 'Failed to shorten URL'}), response.status_code

#             except Exception as e:
#                 print(f"Error shortening URL: {e}")
#                 return jsonify({'error': str(e)}), 500

#     except Exception as e:
#         print(f"Unexpected error: {e}")
#         return jsonify({'error': str(e)}), 500



# if __name__ == '__main__':
#     app.run(debug=True, port=5003)






#code with zip
# import os
# import zipfile
# import uuid
# import requests
# import csv
# from flask import Flask, request, jsonify, send_file
# from werkzeug.utils import secure_filename
# from split_audio import split_audio_file
# from mutagen.mp3 import MP3
# from ShazamAPI import Shazam
# from flask_cors import CORS
# import time
# import re

# app = Flask(__name__)
# CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})
# app.config['UPLOAD_FOLDER'] = 'ShazamAPI/eps'
# app.config['CHUNKS_FOLDER'] = 'ShazamAPI/chunks'
# app.config['RESULTS_FOLDER'] = 'ShazamAPI/results'

# # Initialize global variables for tracking progress and video duration
# total_chunks = 0
# processed_chunks = 1
# video_duration = None  # Store video duration globally

# # Create results folder if it doesn't exist
# os.makedirs(app.config['RESULTS_FOLDER'], exist_ok=True)


# # Home route for rendering the HTML file
# @app.route('/')
# def index():
#     return "Hello, World!"

# def clear_folder(folder_path):
#     for filename in os.listdir(folder_path):
#         file_path = os.path.join(folder_path, filename)
#         try:
#             if os.path.isfile(file_path) or os.path.islink(file_path):
#                 os.unlink(file_path)  # Remove the file
#                 print(f"Deleted file: {file_path}")
#             elif os.path.isdir(file_path):
#                 os.rmdir(file_path)  # Remove the directory
#                 print(f"Deleted directory: {file_path}")
#         except Exception as e:
#             print(f"Failed to delete {file_path}. Reason: {e}")


# # Function to extract chunk number for sorting
# def extract_chunk_number(filename):
#     match = re.search(r'chunk(\d+)', filename)
#     return int(match.group(1)) if match else float('inf')  # Handle non-matching filenames


# @app.route('/upload', methods=['POST'])
# def upload_file():
#     global total_chunks, processed_chunks, video_duration

#     # Generate a unique folder for each user's upload using UUID
#     user_id = str(uuid.uuid4())  # Create unique user-specific folder name
#     user_chunks_folder = os.path.join(app.config['CHUNKS_FOLDER'], user_id)
#     user_eps_folder = os.path.join(app.config['UPLOAD_FOLDER'], user_id)

#     print(f"Creating user-specific folder: {user_chunks_folder}")
#     print(f"Creating user-specific eps folder: {user_eps_folder}")

#     if 'file' not in request.files:
#         return jsonify({"error": "No file part"}), 400

#     file = request.files['file']
#     if file.filename == '':
#         return jsonify({"error": "No selected file"}), 400

#     if file:
#         filename = secure_filename(file.filename)
#         if not os.path.exists(user_eps_folder):
#             os.makedirs(user_eps_folder)
#         filepath = os.path.join(user_eps_folder, filename)
#         file.save(filepath)

#         print(f"File saved at: {filepath}")

#         # Get the duration of the uploaded MP3 file using mutagen's MP3 class
#         try:
#             audio = MP3(filepath)
#             video_duration_in_seconds = audio.info.length
#             print(f"File duration: {video_duration_in_seconds} seconds")
#         except Exception as e:
#             print(f"Error processing MP3 file: {e}")
#             return jsonify({"error": "Error processing MP3 file"}), 500

#         minutes, seconds = divmod(int(video_duration_in_seconds), 60)
#         hours, minutes = divmod(minutes, 60)
#         video_duration = f"{str(hours).zfill(2)}:{str(minutes).zfill(2)}:{str(seconds).zfill(2)}"

#         if not os.path.exists(user_chunks_folder):
#             os.makedirs(user_chunks_folder)
#             print(f"Created directory for chunks: {user_chunks_folder}")

#         try:
#             split_audio_file(filepath, user_chunks_folder)
#             print(f"Audio file split into chunks in: {user_chunks_folder}")
#         except Exception as e:
#             print(f"Error splitting audio file: {e}")
#             return jsonify({"error": "Error splitting audio file"}), 500

#         total_chunks = len([f for f in os.listdir(user_chunks_folder) if f.endswith('.mp3')])
#         processed_chunks = 0

#         print(f"Total chunks created: {total_chunks}")

#         return jsonify({"fileName": filename, "videoDuration": video_duration, "userId": user_id})


# @app.route('/detect', methods=['POST'])
# def detect_songs():
#     global processed_chunks, video_duration

#     user_id = request.json.get('userId')
#     if not user_id:
#         return jsonify({"error": "Missing userId in request"}), 400

#     user_chunks_folder = os.path.join(app.config['CHUNKS_FOLDER'], user_id)
#     user_eps_folder = os.path.join(app.config['UPLOAD_FOLDER'], user_id)
#     user_results_folder = os.path.join(app.config['RESULTS_FOLDER'], user_id)

#     os.makedirs(user_results_folder, exist_ok=True)

#     print(f"Detecting songs in folder: {user_chunks_folder}")

#     if not os.path.exists(user_chunks_folder):
#         return jsonify({'error': 'Chunks folder not found for user.'}), 400

#     chunk_duration = 10
#     detected_songs = []

#     chunk_files = sorted([f for f in os.listdir(user_chunks_folder) if f.endswith('.mp3')], key=extract_chunk_number)

#     if not chunk_files:
#         return jsonify({'error': 'No chunk files found for user.'}), 400

#     for chunk_filename in chunk_files:
#         chunk_number = int(chunk_filename.split('chunk')[1].split('.mp3')[0])
#         start_time = (chunk_number - 1) * chunk_duration
#         end_time = chunk_number * chunk_duration

#         chunk_path = os.path.join(user_chunks_folder, chunk_filename)
#         print(f"Processing chunk: {chunk_path}")

#         try:
#             with open(chunk_path, 'rb') as fp:
#                 mp3_file_content_to_recognize = fp.read()

#             recognize_generator = Shazam().recognize_song(mp3_file_content_to_recognize)

#             found_song = False
#             for (offset, resp) in recognize_generator:
#                 if 'track' in resp:
#                     track = resp['track']
#                     title = track.get('title', 'Unknown')
#                     artist1 = track.get('subtitle', 'Unknown')
#                     shazam_link = track.get('share', {}).get('href', 'N/A')

#                     detected_songs.append({
#                         'title': title,
#                         'artist1': artist1,
#                         'start_time': start_time,
#                         'end_time': end_time,
#                         'shazam_link': shazam_link
#                     })
#                     found_song = True
#                     break

#             if not found_song:
#                 detected_songs.append({
#                     'title': f"Chunk: {chunk_filename}",
#                     'artist1': '-',
#                     'start_time': start_time,
#                     'end_time': end_time,
#                     'shazam_link': '-'
#                 })
#                 os.rename(chunk_path, os.path.join(user_results_folder, chunk_filename))  # Save only "no song detected" chunks
#             else:
#                 os.remove(chunk_path)  

#         except Exception as e:
#             print(f"Error processing chunk {chunk_filename}: {str(e)}")

#     # Create CSV without the "Chunk Path" column
#     csv_file_path = os.path.join(user_results_folder, f"{user_id}_detected_songs.csv")
#     with open(csv_file_path, mode='w', newline='', encoding='utf-8') as csv_file:
#         csv_writer = csv.writer(csv_file)
#         csv_writer.writerow(["Track Title", "Artist", "TC In", "TC Out", "Music Link"])
#         for song in detected_songs:
#             tc_in = time.strftime('%H:%M:%S', time.gmtime(song['start_time']))
#             tc_out = time.strftime('%H:%M:%S', time.gmtime(song['end_time']))
#             csv_writer.writerow([
#                 song['title'],
#                 song['artist1'],
#                 tc_in,
#                 tc_out,
#                 song['shazam_link']
#             ])

#     # Create zip file
#     zip_file_path = os.path.join(app.config['RESULTS_FOLDER'], f"{user_id}.zip")
#     with zipfile.ZipFile(zip_file_path, 'w') as zipf:
#         for root, dirs, files in os.walk(user_results_folder):
#             for file in files:
#                 zipf.write(os.path.join(root, file), arcname=os.path.relpath(os.path.join(root, file), app.config['RESULTS_FOLDER']))

#     # Clear intermediate files
#     clear_folder(user_chunks_folder)
#     os.rmdir(user_chunks_folder)
#     clear_folder(user_eps_folder)
#     os.rmdir(user_eps_folder)
#     clear_folder(user_results_folder)
#     os.rmdir(user_results_folder)

#     return jsonify({'zipPath': zip_file_path})


# @app.route('/download-zip/<user_id>', methods=['GET'])
# def download_zip(user_id):
#     zip_file_path = os.path.join(app.config['RESULTS_FOLDER'], f"{user_id}.zip")
#     if os.path.exists(zip_file_path):
#         return send_file(zip_file_path, as_attachment=True)
#     else:
#         return jsonify({'error': 'Zip file not found'}), 404


# # Route to get total chunks for the frontend
# @app.route('/get-total-chunks', methods=['GET'])
# def get_total_chunks():
#     return jsonify({'totalChunks': total_chunks})

# # Route to get current chunk progress
# @app.route('/get-progress', methods=['GET'])
# def get_progress():
#     print(f"Processed chunks (for debug): {processed_chunks}")  
#     return jsonify({'processedChunks': processed_chunks})

# @app.route('/shorten-url', methods=['POST'])
# def shorten_url():
#     long_url = request.json.get('url')
    
#     if not long_url:
#         print("No URL provided for shortening")
#         return jsonify({'error': 'No URL provided'}), 400

#     try:
#         # Construct the URL with the custom name
#         api_url = f"https://ulvis.net/api.php?url={long_url}&private=1"
        
#         while True:
#             try:
#                 # Log the URL being sent to Ulvis.net
#                 print(f"Sending URL to shorten: {api_url}")

#                 # Make the GET request to Ulvis.net API
#                 response = requests.get(api_url)
#                 print(f"Ulvis.net response: {response.text}")  # Log the response from Ulvis

#                 if response.status_code == 200 and "Error:" not in response.text:
#                     return response.text  # Send back the shortened URL
#                 elif response.status_code != 200 or "Error:" in response.text:
#                     print(f"Error detected ({response.text.strip()}), pausing for 60 seconds.")
#                     time.sleep(30)  # Pause for 60 seconds if spam is detected
#                     continue
#                 else:
#                     print(f"Failed to shorten URL for {long_url}")
#                     return jsonify({'error': 'Failed to shorten URL'}), response.status_code

#             except Exception as e:
#                 print(f"Error shortening URL: {e}")
#                 return jsonify({'error': str(e)}), 500

#     except Exception as e:
#         print(f"Unexpected error: {e}")
#         return jsonify({'error': str(e)}), 500



# if __name__ == '__main__':
#     app.run(debug=True, port=5003)




#slightly optimized 
# import os
# import requests
# import uuid
# from flask import Flask, request, jsonify, render_template
# from werkzeug.utils import secure_filename
# from split_audio import split_audio_file
# from mutagen.mp3 import MP3
# from ShazamAPI import Shazam
# from flask_cors import CORS
# import time
# import re
# import shutil

# app = Flask(__name__)
# CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})
# app.config['UPLOAD_FOLDER'] = 'ShazamAPI/eps'
# app.config['CHUNKS_FOLDER'] = 'ShazamAPI/chunks'

# # Initialize global variables for tracking progress and video duration
# total_chunks = 0
# processed_chunks = 1
# video_duration = None  # Store video duration globally


# # Home route for rendering the HTML file
# @app.route('/')
# def index():
#     # return render_template('index.html')
#     return "Hello, World!"

# def clear_folder(folder_path):
#     for filename in os.listdir(folder_path):
#         file_path = os.path.join(folder_path, filename)
#         try:
#             if os.path.isfile(file_path) or os.path.islink(file_path):
#                 os.unlink(file_path)  # Remove the file
#                 print(f"Deleted file: {file_path}")
#             elif os.path.isdir(file_path):
#                 os.rmdir(file_path)  # Remove the directory
#                 print(f"Deleted directory: {file_path}")
#         except Exception as e:
#             print(f"Failed to delete {file_path}. Reason: {e}")

# # Function to extract chunk number for sorting
# def extract_chunk_number(filename):
#     match = re.search(r'chunk(\d+)', filename)
#     return int(match.group(1)) if match else float('inf')  # Handle non-matching filenames

# # Route to upload file with metadata and automatically split into chunks
# @app.route('/upload', methods=['POST'])
# def upload_file():
#     global total_chunks, processed_chunks, video_duration

#     # Generate a unique folder for each user's upload using UUID
#     user_id = str(uuid.uuid4())  # Create unique user-specific folder name
#     user_chunks_folder = os.path.join(app.config['CHUNKS_FOLDER'], user_id)
#     user_eps_folder = os.path.join(app.config['UPLOAD_FOLDER'], user_id)

#     # Log the folder path creation
#     print(f"Creating user-specific folder: {user_chunks_folder}")
#     print(f"Creating user-specific eps folder: {user_eps_folder}")

#     # Metadata from the form
#     tv_channel = request.form.get('tvChannel')
#     episode_number = request.form.get('episodeNumber')
#     on_air_date = request.form.get('onAirDate')
#     movie_album = request.form.get('movieAlbum')

#     if 'file' not in request.files:
#         print("No file part found in the request")
#         return jsonify({"error": "No file part"}), 400

#     file = request.files['file']
#     if file.filename == '':
#         print("No file selected")
#         return jsonify({"error": "No selected file"}), 400

#     if file:
#         filename = secure_filename(file.filename)
#         if not os.path.exists(user_eps_folder):
#             os.makedirs(user_eps_folder)  # Create user-specific folder inside eps
#         filepath = os.path.join(user_eps_folder, filename)
#         file.save(filepath)

#         # Log the saved file path
#         print(f"File saved at: {filepath}")

#         # Get the duration of the uploaded MP3 file using mutagen's MP3 class
#         try:
#             audio = MP3(filepath)
#             video_duration_in_seconds = audio.info.length
#             print(f"File duration: {video_duration_in_seconds} seconds")
#         except Exception as e:
#             print(f"Error processing MP3 file: {e}")
#             return jsonify({"error": "Error processing MP3 file"}), 500

#         # Convert the duration into HH:MM:SS format
#         minutes, seconds = divmod(int(video_duration_in_seconds), 60)
#         hours, minutes = divmod(minutes, 60)
#         video_duration = f"{str(hours).zfill(2)}:{str(minutes).zfill(2)}:{str(seconds).zfill(2)}"

#         # Automatically split audio into user-specific chunks folder after upload
#         if not os.path.exists(user_chunks_folder):
#             os.makedirs(user_chunks_folder)
#             print(f"Created directory for chunks: {user_chunks_folder}")

#         try:
#             split_audio_file(filepath, user_chunks_folder)  # Use user-specific folder for chunks
#             print(f"Audio file split into chunks in: {user_chunks_folder}")
#         except Exception as e:
#             print(f"Error splitting audio file: {e}")
#             return jsonify({"error": "Error splitting audio file"}), 500

#         # Calculate total chunks
#         total_chunks = len([f for f in os.listdir(user_chunks_folder) if f.endswith('.mp3')])
#         processed_chunks = 0  # Reset processed chunks

#         print(f"Total chunks created: {total_chunks}")

#         return jsonify({"fileName": filename, "videoDuration": video_duration, "userId": user_id})

# # Route to detect songs using the Shazam API and update chunk progress
# @app.route('/detect', methods=['POST'])
# def detect_songs():
#     global processed_chunks, video_duration
    
#     user_id = request.json.get('userId')
#     if not user_id:
#         return jsonify({"error": "Missing userId in request"}), 400

#     user_chunks_folder = os.path.join(app.config['CHUNKS_FOLDER'], user_id)
#     user_eps_folder = os.path.join(app.config['UPLOAD_FOLDER'], user_id)
    
#     print(f"Detecting songs in folder: {user_chunks_folder}")

#     if not os.path.exists(user_chunks_folder):
#         print(f"User-specific folder {user_chunks_folder} not found")
#         return jsonify({'error': 'Chunks folder not found for user.'}), 400

#     chunk_duration = 5
#     detected_songs = []

#     chunk_files = sorted([f for f in os.listdir(user_chunks_folder) if f.endswith('.mp3')], key=extract_chunk_number)

#     print(f"Chunks to process: {chunk_files}")

#     if not chunk_files:
#         print(f"No chunk files found in {user_chunks_folder}")
#         return jsonify({'error': 'No chunk files found for user.'}), 400

#     for chunk_filename in chunk_files:
#         chunk_number = int(chunk_filename.split('chunk')[1].split('.mp3')[0])
#         start_time = (chunk_number - 1) * chunk_duration
#         end_time = chunk_number * chunk_duration
#         chunk_result = f"chunk{str(chunk_number).zfill(2)}: "

#         chunk_path = os.path.join(user_chunks_folder, chunk_filename)
        
#         print(f"Processing chunk: {chunk_path}")

#         try:
#             with open(chunk_path, 'rb') as fp:
#                 mp3_file_content_to_recognize = fp.read()

#             print(f"Starting song recognition for chunk {chunk_filename}")
#             recognize_generator = Shazam().recognize_song(mp3_file_content_to_recognize)

#             found_song = False
#             for (offset, resp) in recognize_generator:
#                 if 'track' in resp:
#                     track = resp['track']
#                     title = track.get('title', 'Unknown')
#                     artist1 = track.get('subtitle', 'Unknown')
#                     shazam_link = track.get('share', {}).get('href', 'N/A')

#                     detected_songs.append({
#                         'title': title,
#                         'artist1': artist1,
#                         'start_time': start_time,
#                         'end_time': end_time,
#                         'shazam_link': shazam_link
#                     })
#                     found_song = True
#                     break

#             if found_song:
#                 chunk_result += "song detected"
#                 print(f"Song detected in {chunk_filename}: {title} by {artist1}")
#             else:
#                 chunk_result += "no song detected"
#                 print(f"No song detected in {chunk_filename}")

#                 # Process the chunk with enhance_background_music
#                 from test_basic import enhance_background_music
#                 enhanced_folder = os.path.join(user_chunks_folder, f"enhanced_chunk_{chunk_number}")
#                 os.makedirs(enhanced_folder, exist_ok=True)

#                 try:
#                     print(f"Enhancing background music for chunk: {chunk_path}")
#                     enhance_background_music(chunk_path, enhanced_folder)
                    
#                     # Use only the music file for further processing
#                     enhanced_music_path = os.path.join(enhanced_folder, "demucs_output/music.wav")
#                     if os.path.exists(enhanced_music_path):
#                         with open(enhanced_music_path, 'rb') as fp:
#                             mp3_file_content_to_recognize = fp.read()
#                             print(f"Starting song recognition for enhanced chunk {chunk_filename}")
#                             recognize_generator = Shazam().recognize_song(mp3_file_content_to_recognize)

#                             for (offset, resp) in recognize_generator:
#                                 if 'track' in resp:
#                                     track = resp['track']
#                                     title = track.get('title', 'Unknown')
#                                     artist1 = track.get('subtitle', 'Unknown')
#                                     shazam_link = track.get('share', {}).get('href', 'N/A')

#                                     detected_songs.append({
#                                         'title': title,
#                                         'artist1': artist1,
#                                         'start_time': start_time,
#                                         'end_time': end_time,
#                                         'shazam_link': shazam_link
#                                     })
#                                     print(f"Song detected in enhanced chunk: {title} by {artist1}")
#                                     break
#                 except Exception as e:
#                     print(f"Error enhancing background music for chunk {chunk_filename}: {e}")

#         except Exception as e:
#             chunk_result += f"error - {str(e)}"
#             print(f"Error processing chunk {chunk_filename}: {str(e)}")

#         print(chunk_result)

#         time.sleep(5)
#         processed_chunks += 1

#     print(f"Clearing folder {user_chunks_folder} and {user_eps_folder}")
#     clear_folder(user_chunks_folder)
#     shutil.rmtree(user_chunks_folder, ignore_errors=True)

#     clear_folder(user_eps_folder)
#     shutil.rmtree(user_eps_folder, ignore_errors=True)

#     print(f"Completed song detection for user: {user_id}")

#     return jsonify({'songs': detected_songs, 'videoDuration': video_duration})


# # Route to get total chunks for the frontend
# @app.route('/get-total-chunks', methods=['GET'])
# def get_total_chunks():
#     return jsonify({'totalChunks': total_chunks})

# # Route to get current chunk progress
# @app.route('/get-progress', methods=['GET'])
# def get_progress():
#     print(f"Processed chunks (for debug): {processed_chunks}")  
#     return jsonify({'processedChunks': processed_chunks})

# @app.route('/shorten-url', methods=['POST'])
# def shorten_url():
#     long_url = request.json.get('url')
    
#     if not long_url:
#         print("No URL provided for shortening")
#         return jsonify({'error': 'No URL provided'}), 400

#     try:
#         # Construct the URL with the custom name
#         api_url = f"https://ulvis.net/api.php?url={long_url}&private=1"
        
#         while True:
#             try:
#                 # Log the URL being sent to Ulvis.net
#                 print(f"Sending URL to shorten: {api_url}")

#                 # Make the GET request to Ulvis.net API
#                 response = requests.get(api_url)
#                 print(f"Ulvis.net response: {response.text}")  # Log the response from Ulvis

#                 if response.status_code == 200 and "Error:" not in response.text:
#                     return response.text  # Send back the shortened URL
#                 elif response.status_code != 200 or "Error:" in response.text:
#                     print(f"Error detected ({response.text.strip()}), pausing for 60 seconds.")
#                     time.sleep(30)  # Pause for 60 seconds if spam is detected
#                     continue
#                 else:
#                     print(f"Failed to shorten URL for {long_url}")
#                     return jsonify({'error': 'Failed to shorten URL'}), response.status_code

#             except Exception as e:
#                 print(f"Error shortening URL: {e}")
#                 return jsonify({'error': str(e)}), 500

#     except Exception as e:
#         print(f"Unexpected error: {e}")
#         return jsonify({'error': str(e)}), 500



# if __name__ == '__main__':
#     app.run(debug=True, port=5003)




#last working with shazam 25/11
# import os
# import requests
# import uuid
# from flask import Flask, request, jsonify, render_template
# from werkzeug.utils import secure_filename
# from split_audio import split_audio_file
# from mutagen.mp3 import MP3
# from ShazamAPI import Shazam
# from flask_cors import CORS
# import time
# import re
# import shutil

# app = Flask(__name__)
# CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})
# app.config['UPLOAD_FOLDER'] = 'ShazamAPI/eps'
# app.config['CHUNKS_FOLDER'] = 'ShazamAPI/chunks'

# # Initialize global variables for tracking progress and video duration
# total_chunks = 0
# processed_chunks = 1
# video_duration = None  # Store video duration globally


# # Home route for rendering the HTML file
# @app.route('/')
# def index():
#     # return render_template('index.html')
#     return "Hello, World!"

# def clear_folder(folder_path):
#     for filename in os.listdir(folder_path):
#         file_path = os.path.join(folder_path, filename)
#         try:
#             if os.path.isfile(file_path) or os.path.islink(file_path):
#                 os.unlink(file_path)  # Remove the file
#                 print(f"Deleted file: {file_path}")
#             elif os.path.isdir(file_path):
#                 os.rmdir(file_path)  # Remove the directory
#                 print(f"Deleted directory: {file_path}")
#         except Exception as e:
#             print(f"Failed to delete {file_path}. Reason: {e}")

# # Function to extract chunk number for sorting
# def extract_chunk_number(filename):
#     match = re.search(r'chunk(\d+)', filename)
#     return int(match.group(1)) if match else float('inf')  # Handle non-matching filenames

# # Route to upload file with metadata and automatically split into chunks
# @app.route('/upload', methods=['POST'])
# def upload_file():
#     global total_chunks, processed_chunks, video_duration

#     # Generate a unique folder for each user's upload using UUID
#     user_id = str(uuid.uuid4())  # Create unique user-specific folder name
#     user_chunks_folder = os.path.join(app.config['CHUNKS_FOLDER'], user_id)
#     user_eps_folder = os.path.join(app.config['UPLOAD_FOLDER'], user_id)

#     # Log the folder path creation
#     print(f"Creating user-specific folder: {user_chunks_folder}")
#     print(f"Creating user-specific eps folder: {user_eps_folder}")

#     # Metadata from the form
#     tv_channel = request.form.get('tvChannel')
#     episode_number = request.form.get('episodeNumber')
#     on_air_date = request.form.get('onAirDate')
#     movie_album = request.form.get('movieAlbum')

#     if 'file' not in request.files:
#         print("No file part found in the request")
#         return jsonify({"error": "No file part"}), 400

#     file = request.files['file']
#     if file.filename == '':
#         print("No file selected")
#         return jsonify({"error": "No selected file"}), 400

#     if file:
#         filename = secure_filename(file.filename)
#         if not os.path.exists(user_eps_folder):
#             os.makedirs(user_eps_folder)  # Create user-specific folder inside eps
#         filepath = os.path.join(user_eps_folder, filename)
#         file.save(filepath)

#         # Log the saved file path
#         print(f"File saved at: {filepath}")

#         # Get the duration of the uploaded MP3 file using mutagen's MP3 class
#         try:
#             audio = MP3(filepath)
#             video_duration_in_seconds = audio.info.length
#             print(f"File duration: {video_duration_in_seconds} seconds")
#         except Exception as e:
#             print(f"Error processing MP3 file: {e}")
#             return jsonify({"error": "Error processing MP3 file"}), 500

#         # Convert the duration into HH:MM:SS format
#         minutes, seconds = divmod(int(video_duration_in_seconds), 60)
#         hours, minutes = divmod(minutes, 60)
#         video_duration = f"{str(hours).zfill(2)}:{str(minutes).zfill(2)}:{str(seconds).zfill(2)}"

#         # Automatically split audio into user-specific chunks folder after upload
#         if not os.path.exists(user_chunks_folder):
#             os.makedirs(user_chunks_folder)
#             print(f"Created directory for chunks: {user_chunks_folder}")

#         try:
#             split_audio_file(filepath, user_chunks_folder)  # Use user-specific folder for chunks
#             print(f"Audio file split into chunks in: {user_chunks_folder}")
#         except Exception as e:
#             print(f"Error splitting audio file: {e}")
#             return jsonify({"error": "Error splitting audio file"}), 500

#         # Calculate total chunks
#         total_chunks = len([f for f in os.listdir(user_chunks_folder) if f.endswith('.mp3')])
#         processed_chunks = 0  # Reset processed chunks

#         print(f"Total chunks created: {total_chunks}")

#         return jsonify({"fileName": filename, "videoDuration": video_duration, "userId": user_id})

# # Route to detect songs using the Shazam API and update chunk progress
# @app.route('/detect', methods=['POST'])
# def detect_songs():
#     global processed_chunks, video_duration
    
#     user_id = request.json.get('userId')
#     if not user_id:
#         return jsonify({"error": "Missing userId in request"}), 400

#     user_chunks_folder = os.path.join(app.config['CHUNKS_FOLDER'], user_id)
#     user_eps_folder = os.path.join(app.config['UPLOAD_FOLDER'], user_id)
    
#     print(f"Detecting songs in folder: {user_chunks_folder}")

#     if not os.path.exists(user_chunks_folder):
#         print(f"User-specific folder {user_chunks_folder} not found")
#         return jsonify({'error': 'Chunks folder not found for user.'}), 400

#     chunk_duration = 10
#     detected_songs = []

#     chunk_files = sorted([f for f in os.listdir(user_chunks_folder) if f.endswith('.mp3')], key=extract_chunk_number)

#     print(f"Chunks to process: {chunk_files}")

#     if not chunk_files:
#         print(f"No chunk files found in {user_chunks_folder}")
#         return jsonify({'error': 'No chunk files found for user.'}), 400

#     for chunk_filename in chunk_files:
#         chunk_number = int(chunk_filename.split('chunk')[1].split('.mp3')[0])
#         start_time = (chunk_number - 1) * chunk_duration
#         end_time = chunk_number * chunk_duration
#         chunk_result = f"chunk{str(chunk_number).zfill(2)}: "

#         chunk_path = os.path.join(user_chunks_folder, chunk_filename)
        
#         print(f"Processing chunk: {chunk_path}")

#         try:
#             with open(chunk_path, 'rb') as fp:
#                 mp3_file_content_to_recognize = fp.read()

#             print(f"Starting song recognition for chunk {chunk_filename}")
#             recognize_generator = Shazam().recognize_song(mp3_file_content_to_recognize)

#             found_song = False
#             for (offset, resp) in recognize_generator:
#                 if 'track' in resp:
#                     track = resp['track']
#                     title = track.get('title', 'Unknown')
#                     artist1 = track.get('subtitle', 'Unknown')
#                     shazam_link = track.get('share', {}).get('href', 'N/A')

#                     detected_songs.append({
#                         'title': title,
#                         'artist1': artist1,
#                         'start_time': start_time,
#                         'end_time': end_time,
#                         'shazam_link': shazam_link
#                     })
#                     found_song = True
#                     break

#             if found_song:
#                 chunk_result += "song detected"
#                 print(f"Song detected in {chunk_filename}: {title} by {artist1}")
#             else:
#                 chunk_result += "no song detected"
#                 print(f"No song detected in {chunk_filename}")

#                 # Process the chunk with enhance_background_music
#                 from test_basic import enhance_background_music
#                 try:
#                     print(f"Enhancing background music for chunk: {chunk_path}")
#                     enhanced_music_path = enhance_background_music(chunk_path, user_chunks_folder)

#                     if enhanced_music_path:
#                         print(f"Retrying song detection with enhanced music: {enhanced_music_path}")
#                         with open(enhanced_music_path, 'rb') as fp:
#                             mp3_file_content_to_recognize = fp.read()
#                         recognize_generator = Shazam().recognize_song(mp3_file_content_to_recognize)

#                         for (offset, resp) in recognize_generator:
#                             if 'track' in resp:
#                                 track = resp['track']
#                                 title = track.get('title', 'Unknown')
#                                 artist1 = track.get('subtitle', 'Unknown')
#                                 shazam_link = track.get('share', {}).get('href', 'N/A')

#                                 detected_songs.append({
#                                     'title': title,
#                                     'artist1': artist1,
#                                     'start_time': start_time,
#                                     'end_time': end_time,
#                                     'shazam_link': shazam_link
#                                 })
#                                 print(f"Song detected in enhanced chunk: {title} by {artist1}")
#                                 break
#                 except Exception as e:
#                     print(f"Error enhancing background music for chunk {chunk_filename}: {e}")

#         except Exception as e:
#             chunk_result += f"error - {str(e)}"
#             print(f"Error processing chunk {chunk_filename}: {str(e)}")

#         print(chunk_result)

#         time.sleep(5)
#         processed_chunks += 1

#     print(f"Clearing folder {user_chunks_folder} and {user_eps_folder}")
#     clear_folder(user_chunks_folder)
#     shutil.rmtree(user_chunks_folder, ignore_errors=True)

#     clear_folder(user_eps_folder)
#     shutil.rmtree(user_eps_folder, ignore_errors=True)

#     print(f"Completed song detection for user: {user_id}")

#     return jsonify({'songs': detected_songs, 'videoDuration': video_duration})


# # Route to get total chunks for the frontend
# @app.route('/get-total-chunks', methods=['GET'])
# def get_total_chunks():
#     return jsonify({'totalChunks': total_chunks})

# # Route to get current chunk progress
# @app.route('/get-progress', methods=['GET'])
# def get_progress():
#     print(f"Processed chunks (for debug): {processed_chunks}")  
#     return jsonify({'processedChunks': processed_chunks})

# @app.route('/shorten-url', methods=['POST'])
# def shorten_url():
#     long_url = request.json.get('url')
    
#     if not long_url:
#         print("No URL provided for shortening")
#         return jsonify({'error': 'No URL provided'}), 400

#     try:
#         # Construct the URL with the custom name
#         api_url = f"https://ulvis.net/api.php?url={long_url}&private=1"
        
#         while True:
#             try:
#                 # Log the URL being sent to Ulvis.net
#                 print(f"Sending URL to shorten: {api_url}")

#                 # Make the GET request to Ulvis.net API
#                 response = requests.get(api_url)
#                 print(f"Ulvis.net response: {response.text}")  # Log the response from Ulvis

#                 if response.status_code == 200 and "Error:" not in response.text:
#                     return response.text  # Send back the shortened URL
#                 elif response.status_code != 200 or "Error:" in response.text:
#                     print(f"Error detected ({response.text.strip()}), pausing for 60 seconds.")
#                     time.sleep(30)  # Pause for 60 seconds if spam is detected
#                     continue
#                 else:
#                     print(f"Failed to shorten URL for {long_url}")
#                     return jsonify({'error': 'Failed to shorten URL'}), response.status_code

#             except Exception as e:
#                 print(f"Error shortening URL: {e}")
#                 return jsonify({'error': str(e)}), 500

#     except Exception as e:
#         print(f"Unexpected error: {e}")
#         return jsonify({'error': str(e)}), 500



# if __name__ == '__main__':
#     app.run(debug=True, port=5003)




#working AUDD
# import os
# import requests
# import uuid
# from flask import Flask, request, jsonify, render_template
# from werkzeug.utils import secure_filename
# from split_audio import split_audio_file
# from mutagen.mp3 import MP3
# from ShazamAPI import Shazam
# from flask_cors import CORS
# import time
# import re
# import shutil

# app = Flask(__name__)
# CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})
# app.config['UPLOAD_FOLDER'] = 'ShazamAPI/eps'
# app.config['CHUNKS_FOLDER'] = 'ShazamAPI/chunks'

# # Initialize global variables for tracking progress and video duration
# total_chunks = 0
# processed_chunks = 1
# video_duration = None  # Store video duration globally


# # Home route for rendering the HTML file
# @app.route('/')
# def index():
#     # return render_template('index.html')
#     return "Hello, World!"

# def clear_folder(folder_path):
#     for filename in os.listdir(folder_path):
#         file_path = os.path.join(folder_path, filename)
#         try:
#             if os.path.isfile(file_path) or os.path.islink(file_path):
#                 os.unlink(file_path)  # Remove the file
#                 print(f"Deleted file: {file_path}")
#             elif os.path.isdir(file_path):
#                 os.rmdir(file_path)  # Remove the directory
#                 print(f"Deleted directory: {file_path}")
#         except Exception as e:
#             print(f"Failed to delete {file_path}. Reason: {e}")

# # Function to extract chunk number for sorting
# def extract_chunk_number(filename):
#     match = re.search(r'chunk(\d+)', filename)
#     return int(match.group(1)) if match else float('inf')  # Handle non-matching filenames

# # Route to upload file with metadata and automatically split into chunks
# @app.route('/upload', methods=['POST'])
# def upload_file():
#     global total_chunks, processed_chunks, video_duration

#     # Generate a unique folder for each user's upload using UUID
#     user_id = str(uuid.uuid4())  # Create unique user-specific folder name
#     user_chunks_folder = os.path.join(app.config['CHUNKS_FOLDER'], user_id)
#     user_eps_folder = os.path.join(app.config['UPLOAD_FOLDER'], user_id)

#     # Log the folder path creation
#     print(f"Creating user-specific folder: {user_chunks_folder}")
#     print(f"Creating user-specific eps folder: {user_eps_folder}")

#     # Metadata from the form
#     tv_channel = request.form.get('tvChannel')
#     episode_number = request.form.get('episodeNumber')
#     on_air_date = request.form.get('onAirDate')
#     movie_album = request.form.get('movieAlbum')

#     if 'file' not in request.files:
#         print("No file part found in the request")
#         return jsonify({"error": "No file part"}), 400

#     file = request.files['file']
#     if file.filename == '':
#         print("No file selected")
#         return jsonify({"error": "No selected file"}), 400

#     if file:
#         filename = secure_filename(file.filename)
#         if not os.path.exists(user_eps_folder):
#             os.makedirs(user_eps_folder)  # Create user-specific folder inside eps
#         filepath = os.path.join(user_eps_folder, filename)
#         file.save(filepath)

#         # Log the saved file path
#         print(f"File saved at: {filepath}")

#         # Get the duration of the uploaded MP3 file using mutagen's MP3 class
#         try:
#             audio = MP3(filepath)
#             video_duration_in_seconds = audio.info.length
#             print(f"File duration: {video_duration_in_seconds} seconds")
#         except Exception as e:
#             print(f"Error processing MP3 file: {e}")
#             return jsonify({"error": "Error processing MP3 file"}), 500

#         # Convert the duration into HH:MM:SS format
#         minutes, seconds = divmod(int(video_duration_in_seconds), 60)
#         hours, minutes = divmod(minutes, 60)
#         video_duration = f"{str(hours).zfill(2)}:{str(minutes).zfill(2)}:{str(seconds).zfill(2)}"

#         # Automatically split audio into user-specific chunks folder after upload
#         if not os.path.exists(user_chunks_folder):
#             os.makedirs(user_chunks_folder)
#             print(f"Created directory for chunks: {user_chunks_folder}")

#         try:
#             split_audio_file(filepath, user_chunks_folder)  # Use user-specific folder for chunks
#             print(f"Audio file split into chunks in: {user_chunks_folder}")
#         except Exception as e:
#             print(f"Error splitting audio file: {e}")
#             return jsonify({"error": "Error splitting audio file"}), 500

#         # Calculate total chunks
#         total_chunks = len([f for f in os.listdir(user_chunks_folder) if f.endswith('.mp3')])
#         processed_chunks = 0  # Reset processed chunks

#         print(f"Total chunks created: {total_chunks}")

#         return jsonify({"fileName": filename, "videoDuration": video_duration, "userId": user_id})

# # Route to detect songs using the AudD API and update chunk progress
# @app.route('/detect', methods=['POST'])
# def detect_songs():
#     global processed_chunks, video_duration

#     # Ensure that userId is provided
#     user_id = request.json.get('userId')
#     if not user_id:
#         return jsonify({"error": "Missing userId in request"}), 400

#     # Set user-specific chunks folder
#     user_chunks_folder = os.path.join(app.config['CHUNKS_FOLDER'], user_id)
#     user_eps_folder = os.path.join(app.config['UPLOAD_FOLDER'], user_id)

#     # Log the user-specific folder being processed
#     print(f"Detecting songs in folder: {user_chunks_folder}")

#     if not os.path.exists(user_chunks_folder):
#         print(f"User-specific folder {user_chunks_folder} not found")
#         return jsonify({'error': 'Chunks folder not found for user.'}), 400

#     chunk_duration = 10
#     detected_songs = []

#     # Get sorted chunk files based on chunk number
#     chunk_files = sorted([f for f in os.listdir(user_chunks_folder) if f.endswith('.mp3')], key=extract_chunk_number)

#     # Log the chunk files being processed
#     print(f"Chunks to process: {chunk_files}")

#     if not chunk_files:
#         print(f"No chunk files found in {user_chunks_folder}")
#         return jsonify({'error': 'No chunk files found for user.'}), 400

#     # AudD API key
#     api_key = "7edca807001a9e700b4a69800f548d8c"  # Replace with your actual API key

#     for chunk_filename in chunk_files:
#         chunk_number = int(chunk_filename.split('chunk')[1].split('.mp3')[0])
#         start_time = (chunk_number - 1) * chunk_duration
#         end_time = chunk_number * chunk_duration
#         chunk_result = f"chunk{str(chunk_number).zfill(2)}: "  # For logging

#         chunk_path = os.path.join(user_chunks_folder, chunk_filename)

#         # Log the chunk path being processed
#         print(f"Processing chunk: {chunk_path}")

#         try:
#             # Use the AudD API to recognize the song
#             with open(chunk_path, 'rb') as audio_file:
#                 files = {'file': audio_file}
#                 data = {'api_token': api_key}
#                 response = requests.post("https://api.audd.io/", data=data, files=files)

#                 if response.status_code == 200:
#                     result = response.json()
#                     if 'result' in result and result['result']:
#                         song_info = result['result']
#                         detected_songs.append({
#                             'title': song_info.get('title', 'Unknown'),
#                             'artist1': song_info.get('artist', 'Unknown'),
#                             'album': song_info.get('album', 'Unknown'),
#                             'release_date': song_info.get('release_date', 'Unknown'),
#                             'spotify_url': song_info.get('spotify', {}).get('external_urls', {}).get('spotify', 'N/A'),
#                             'start_time': start_time,
#                             'end_time': end_time
#                         })
#                         print(f"Song detected in {chunk_filename}: {song_info.get('title', 'Unknown')} by {song_info.get('artist', 'Unknown')}")
#                         chunk_result += "song detected"
#                     else:
#                         print(f"No song detected in {chunk_filename}")
#                         chunk_result += "no song detected"
#                 else:
#                     print(f"Error: Failed to recognize the song. HTTP Status Code: {response.status_code}")
#                     chunk_result += f"error - HTTP {response.status_code}"

#         except Exception as e:
#             chunk_result += f"error - {str(e)}"
#             print(f"Error processing chunk {chunk_filename}: {str(e)}")

#         # Log the result for this chunk
#         print(chunk_result)

#         # Simulate processing time for each chunk
#         time.sleep(2)  # Simulate each chunk taking 2 seconds to process
#         processed_chunks += 1
#         print(f"Processed chunks (increment): {processed_chunks}")

#     # Clear the user-specific folder after detection and table rendering
#     print(f"Clearing folder {user_chunks_folder} and {user_eps_folder}")
#     clear_folder(user_chunks_folder)
#     os.rmdir(user_chunks_folder)  # Remove the folder after processing

#     # Also clear the eps folder
#     clear_folder(user_eps_folder)
#     os.rmdir(user_eps_folder)

#     # Log completion of processing
#     print(f"Completed song detection for user: {user_id}")

#     return jsonify({'songs': detected_songs, 'videoDuration': video_duration})


# # Route to get total chunks for the frontend
# @app.route('/get-total-chunks', methods=['GET'])
# def get_total_chunks():
#     return jsonify({'totalChunks': total_chunks})

# # Route to get current chunk progress
# @app.route('/get-progress', methods=['GET'])
# def get_progress():
#     print(f"Processed chunks (for debug): {processed_chunks}")  
#     return jsonify({'processedChunks': processed_chunks})

# @app.route('/shorten-url', methods=['POST'])
# def shorten_url():
#     long_url = request.json.get('url')
    
#     if not long_url:
#         print("No URL provided for shortening")
#         return jsonify({'error': 'No URL provided'}), 400

#     try:
#         # Construct the URL with the custom name
#         api_url = f"https://ulvis.net/api.php?url={long_url}&private=1"
        
#         while True:
#             try:
#                 # Log the URL being sent to Ulvis.net
#                 print(f"Sending URL to shorten: {api_url}")

#                 # Make the GET request to Ulvis.net API
#                 response = requests.get(api_url)
#                 print(f"Ulvis.net response: {response.text}")  # Log the response from Ulvis

#                 if response.status_code == 200 and "Error:" not in response.text:
#                     return response.text  # Send back the shortened URL
#                 elif response.status_code != 200 or "Error:" in response.text:
#                     print(f"Error detected ({response.text.strip()}), pausing for 60 seconds.")
#                     time.sleep(30)  # Pause for 60 seconds if spam is detected
#                     continue
#                 else:
#                     print(f"Failed to shorten URL for {long_url}")
#                     return jsonify({'error': 'Failed to shorten URL'}), response.status_code

#             except Exception as e:
#                 print(f"Error shortening URL: {e}")
#                 return jsonify({'error': str(e)}), 500

#     except Exception as e:
#         print(f"Unexpected error: {e}")
#         return jsonify({'error': str(e)}), 500



# if __name__ == '__main__':
#     app.run(debug=True, port=5003)





import os
import requests
import uuid
from flask import Flask, request, jsonify, render_template
from werkzeug.utils import secure_filename
from split_audio import split_audio_file
from mutagen.mp3 import MP3
from ShazamAPI import Shazam
from flask_cors import CORS
import time
import re
from dotenv import load_dotenv

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
app.config['UPLOAD_FOLDER'] = 'ShazamAPI/eps'
app.config['CHUNKS_FOLDER'] = 'ShazamAPI/chunks'

# Initialize global variables for tracking progress and video duration
total_chunks = 0
processed_chunks = 1
video_duration = None  # Store video duration globally

load_dotenv()
AUDD_API_KEY = os.getenv("AUDD_API_KEY")

if not AUDD_API_KEY:
    raise ValueError("API Key not found in environment variables!")


# Home route for rendering the HTML file
@app.route('/')
def index():
    # return render_template('index.html')
    return "Hello, World!"

def clear_folder(folder_path):
    for filename in os.listdir(folder_path):
        file_path = os.path.join(folder_path, filename)
        try:
            if os.path.isfile(file_path) or os.path.islink(file_path):
                os.unlink(file_path)  # Remove the file
                print(f"Deleted file: {file_path}")
            elif os.path.isdir(file_path):
                os.rmdir(file_path)  # Remove the directory
                print(f"Deleted directory: {file_path}")
        except Exception as e:
            print(f"Failed to delete {file_path}. Reason: {e}")

# Function to extract chunk number for sorting
def extract_chunk_number(filename):
    match = re.search(r'chunk(\d+)', filename)
    return int(match.group(1)) if match else float('inf')  # Handle non-matching filenames

# Route to upload file with metadata and automatically split into chunks
@app.route('/upload', methods=['POST'])
def upload_file():
    global total_chunks, processed_chunks, video_duration

    # Generate a unique folder for each user's upload using UUID
    user_id = str(uuid.uuid4())  # Create unique user-specific folder name
    user_chunks_folder = os.path.join(app.config['CHUNKS_FOLDER'], user_id)
    user_eps_folder = os.path.join(app.config['UPLOAD_FOLDER'], user_id)

    # Log the folder path creation
    print(f"Creating user-specific folder: {user_chunks_folder}")
    print(f"Creating user-specific eps folder: {user_eps_folder}")

    # Metadata from the form
    tv_channel = request.form.get('tvChannel')
    episode_number = request.form.get('episodeNumber')
    on_air_date = request.form.get('onAirDate')
    movie_album = request.form.get('movieAlbum')

    if 'file' not in request.files:
        print("No file part found in the request")
        return jsonify({"error": "No file part"}), 400

    file = request.files['file']
    if file.filename == '':
        print("No file selected")
        return jsonify({"error": "No selected file"}), 400

    if file:
        filename = secure_filename(file.filename)
        if not os.path.exists(user_eps_folder):
            os.makedirs(user_eps_folder)  # Create user-specific folder inside eps
        filepath = os.path.join(user_eps_folder, filename)
        file.save(filepath)

        # Log the saved file path
        print(f"File saved at: {filepath}")

        # Get the duration of the uploaded MP3 file using mutagen's MP3 class
        try:
            audio = MP3(filepath)
            video_duration_in_seconds = audio.info.length
            print(f"File duration: {video_duration_in_seconds} seconds")
        except Exception as e:
            print(f"Error processing MP3 file: {e}")
            return jsonify({"error": "Error processing MP3 file"}), 500

        # Convert the duration into HH:MM:SS format
        minutes, seconds = divmod(int(video_duration_in_seconds), 60)
        hours, minutes = divmod(minutes, 60)
        video_duration = f"{str(hours).zfill(2)}:{str(minutes).zfill(2)}:{str(seconds).zfill(2)}"

        # Automatically split audio into user-specific chunks folder after upload
        if not os.path.exists(user_chunks_folder):
            os.makedirs(user_chunks_folder)
            print(f"Created directory for chunks: {user_chunks_folder}")

        try:
            split_audio_file(filepath, user_chunks_folder)  # Use user-specific folder for chunks
            print(f"Audio file split into chunks in: {user_chunks_folder}")
        except Exception as e:
            print(f"Error splitting audio file: {e}")
            return jsonify({"error": "Error splitting audio file"}), 500

        # Calculate total chunks
        total_chunks = len([f for f in os.listdir(user_chunks_folder) if f.endswith('.mp3')])
        processed_chunks = 0  # Reset processed chunks

        print(f"Total chunks created: {total_chunks}")

        return jsonify({"fileName": filename, "videoDuration": video_duration, "userId": user_id})
def shorten_url_internal(long_url):
    """
    Internal helper function to shorten URLs using the ulvis.net API.
    """
    try:
        # Construct the URL with the ulvis.net API
        api_url = f"https://ulvis.net/api.php?url={long_url}&private=1"
        print(f"Sending URL to shorten: {api_url}")

        response = requests.get(api_url)

        # Check if the response is valid
        if response.status_code == 200 and "Error:" not in response.text:
            shortened_url = response.text.strip()
            print(f"Shortened URL: {shortened_url}")
            return shortened_url
        else:
            print(f"Failed to shorten URL. Response: {response.text}")
            return long_url  # Return the original URL if shortening fails

    except Exception as e:
        print(f"Exception during URL shortening: {str(e)}")
        return long_url  # Return the original URL in case of an error

@app.route('/detect', methods=['POST'])
def detect_songs():
    global processed_chunks, video_duration

    # Ensure that userId is provided
    user_id = request.json.get('userId')
    if not user_id:
        return jsonify({"error": "Missing userId in request"}), 400

    # Set user-specific chunks folder
    user_chunks_folder = os.path.join(app.config['CHUNKS_FOLDER'], user_id)
    user_eps_folder = os.path.join(app.config['UPLOAD_FOLDER'], user_id)

    print(f"Detecting songs in folder: {user_chunks_folder}")

    if not os.path.exists(user_chunks_folder):
        print(f"User-specific folder {user_chunks_folder} not found")
        return jsonify({'error': 'Chunks folder not found for user.'}), 400

    chunk_duration = 10
    detected_songs = []

    # Get sorted chunk files based on chunk number
    chunk_files = sorted([f for f in os.listdir(user_chunks_folder) if f.endswith('.mp3')], key=extract_chunk_number)

    print(f"Chunks to process: {chunk_files}")

    if not chunk_files:
        print(f"No chunk files found in {user_chunks_folder}")
        return jsonify({'error': 'No chunk files found for user.'}), 400

    for chunk_filename in chunk_files:
        chunk_number = int(chunk_filename.split('chunk')[1].split('.mp3')[0])
        start_time = (chunk_number - 1) * chunk_duration
        end_time = chunk_number * chunk_duration
        chunk_result = f"chunk{str(chunk_number).zfill(2)}: "

        chunk_path = os.path.join(user_chunks_folder, chunk_filename)
        print(f"Processing chunk: {chunk_path}")

        try:
            # First attempt song detection with Shazam
            with open(chunk_path, 'rb') as fp:
                mp3_file_content_to_recognize = fp.read()

            print(f"Starting song recognition for chunk {chunk_filename} using Shazam")
            recognize_generator = Shazam().recognize_song(mp3_file_content_to_recognize)

            found_song = False
            for (offset, resp) in recognize_generator:
                if 'track' in resp:
                    track = resp['track']
                    title = track.get('title', 'Unknown')
                    artist = track.get('subtitle', 'Unknown')
                    shazam_link = track.get('share', {}).get('href', 'N/A')

                    # Shorten the URL if detected by Shazam
                    shortened_url = shorten_url_internal(shazam_link) if shazam_link else shazam_link

                    detected_songs.append({
                        'title': title,
                        'artist': artist,
                        'song_link': shortened_url,
                        'start_time': start_time,
                        'end_time': end_time,
                        'detected_with': 'Shazam'
                    })
                    print(f"Song detected in {chunk_filename} by Shazam: {title} by {artist}")
                    chunk_result += "song detected with Shazam"
                    found_song = True
                    break

            if not found_song:
                print(f"No song detected in {chunk_filename} with Shazam. Falling back to AudD.")
                # Fall back to AudD API
                from test_basic import recognize_song  # Import the AudD function
                try:
                    audd_result = recognize_song(chunk_path, AUDD_API_KEY)
                    if audd_result:
                        title, artist, audd_link = audd_result
                        detected_songs.append({
                            'title': title,
                            'artist': artist,
                            'song_link': audd_link,  # Keep the original AudD URL
                            'start_time': start_time,
                            'end_time': end_time,
                            'detected_with': 'AudD'
                        })
                        print(f"Song detected in {chunk_filename} by AudD: {title} by {artist}")
                        chunk_result += "song detected with AudD"
                    else:
                        print(f"No song detected in {chunk_filename} with AudD.")
                        chunk_result += "no song detected"
                except Exception as e:
                    print(f"Error using AudD for chunk {chunk_filename}: {e}")

        except Exception as e:
            chunk_result += f"error - {str(e)}"
            print(f"Error processing chunk {chunk_filename}: {str(e)}")

        print(chunk_result)
        time.sleep(2)  # Simulate processing time for each chunk
        processed_chunks += 1
        print(f"Processed chunks (increment): {processed_chunks}")

    # Clear the user-specific folder after detection
    clear_folder(user_chunks_folder)
    os.rmdir(user_chunks_folder)
    clear_folder(user_eps_folder)
    os.rmdir(user_eps_folder)

    print(f"Completed song detection for user: {user_id}")
    return jsonify({'songs': detected_songs, 'videoDuration': video_duration})


# Route to get total chunks for the frontend
@app.route('/get-total-chunks', methods=['GET'])
def get_total_chunks():
    return jsonify({'totalChunks': total_chunks})

# Route to get current chunk progress
@app.route('/get-progress', methods=['GET'])
def get_progress():
    print(f"Processed chunks (for debug): {processed_chunks}")  
    return jsonify({'processedChunks': processed_chunks})






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

@app.route("/uploads", methods=["POST"])
def uploads_file():
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

if __name__ == '__main__':
    app.run(debug=True, port=5003)



