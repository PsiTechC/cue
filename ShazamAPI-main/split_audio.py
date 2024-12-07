import os
from pydub import AudioSegment

def split_audio_file(input_file, output_dir, chunk_length_ms=10000):
    audio = AudioSegment.from_mp3(input_file)
    total_chunks = len(audio) // chunk_length_ms
    for i in range(total_chunks + 1):
        start = i * chunk_length_ms
        end = start + chunk_length_ms
        chunk = audio[start:end]
        chunk_name = f"chunk{str(i + 1).zfill(2)}.mp3"
        chunk_path = os.path.join(output_dir, chunk_name)
        chunk.export(chunk_path, format="mp3")
        # print(f"Exported {chunk_name}")


# from pydub import AudioSegment
# import os

# def split_audio_file(input_path, output_folder, chunk_duration_ms=10000, overlap_duration_ms=2000):
#     """
#     Splits an audio file into chunks with optional overlap.

#     :param input_path: Path to the input audio file
#     :param output_folder: Folder to save the audio chunks
#     :param chunk_duration_ms: Duration of each chunk in milliseconds (default: 10,000ms or 10 seconds)
#     :param overlap_duration_ms: Overlap duration between chunks in milliseconds (default: 2,000ms or 2 seconds)
#     """
#     # Load the audio file
#     audio = AudioSegment.from_file(input_path)

#     # Calculate the start and end times for chunks
#     chunk_start = 0
#     chunk_end = chunk_duration_ms

#     chunk_number = 1
#     while chunk_start < len(audio):
#         # Extract chunk
#         chunk = audio[chunk_start:chunk_end]

#         # Save the chunk
#         chunk_filename = f"chunk{chunk_number:02d}.mp3"
#         chunk_path = os.path.join(output_folder, chunk_filename)
#         chunk.export(chunk_path, format="mp3")
#         print(f"Exported {chunk_filename}")

#         # Move the start time forward, subtracting the overlap
#         chunk_start += chunk_duration_ms - overlap_duration_ms
#         chunk_end = chunk_start + chunk_duration_ms
#         chunk_number += 1
