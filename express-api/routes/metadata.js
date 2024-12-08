
// const express = require('express');
// const multer = require('multer');
// const { exec } = require('child_process');
// const path = require('path');
// const fs = require('fs');
// const ffmpeg = require('fluent-ffmpeg');

// const router = express.Router();
// const upload = multer({ dest: 'uploads/' });

// const sanitizeKey = (key) => key.replace(/[^a-zA-Z0-9_]/g, '');

// router.post('/upload', upload.single('video'), (req, res) => {
//     const videoPath = req.file.path;
//     exec(`ffprobe -v quiet -print_format json -show_format -show_streams "${videoPath}"`, (error, stdout) => {
//         if (error) {
//             console.error(`Error executing ffprobe: ${error}`);
//             return res.status(500).json({ error: 'Failed to extract metadata' });
//         }

//         try {
//             const metadata = JSON.parse(stdout);
//             metadata.filename = req.file.filename;
//             metadata.originalname = req.file.originalname;
//             res.json(metadata);
//         } catch (parseError) {
//             console.error('Error parsing ffprobe output:', parseError);
//             res.status(500).json({ error: 'Error parsing metadata' });
//         }
//     });
// });

// router.post('/save', (req, res) => {
//     const { filename, customProperties } = req.body;
//     const originalFilePath = path.join(__dirname, '../uploads/', filename);
//     const updatedFilePath = path.join(__dirname, '../uploads/', `updated_${filename}.mp4`);

//     console.log("Original file path:", originalFilePath);
//     console.log("Does the original file exist?", fs.existsSync(originalFilePath));

//     if (!fs.existsSync(originalFilePath)) {
//         return res.status(404).json({ error: 'Video file not found' });
//     }

//     // Apply each metadata option separately
//     const ffmpegCommand = ffmpeg(originalFilePath).output(updatedFilePath);

//     Object.entries(customProperties).forEach(([key, value]) => {
//         const sanitizedKey = sanitizeKey(key);
//         ffmpegCommand.outputOption('-metadata', `${sanitizedKey}=${value}`);
//     });

//     ffmpegCommand
//         .outputOptions('-map_metadata 0') // Copy all metadata from input
//         .outputOptions('-c:v libx264') // Force re-encoding to apply metadata
//         .outputOptions('-c:a aac')    // Re-encode audio to ensure compatibility with .mp4
//         .on('end', () => {
//             console.log("Metadata applied, now verifying with ffprobe...");

//             exec(`ffprobe -v quiet -print_format json -show_format -show_streams "${updatedFilePath}"`, (error, stdout) => {
//                 if (error) {
//                     console.error(`Error verifying metadata: ${error}`);
//                     return res.status(500).json({ error: 'Failed to verify metadata in updated file' });
//                 }

//                 try {
//                     const updatedMetadata = JSON.parse(stdout);
//                     console.log("Updated metadata:", updatedMetadata);

//                     const metadataCheck = Object.entries(customProperties).every(([key, value]) =>
//                         updatedMetadata.format?.tags?.[sanitizeKey(key)] === value
//                     );

//                     if (!metadataCheck) {
//                         console.error("Verification failed: Metadata not found as expected.");
//                         return res.status(500).json({ error: 'Metadata embedding verification failed' });
//                     }

//                     res.status(200).json({
//                         message: 'Metadata saved and verified successfully',
//                         downloadPath: `/api/metadata/download/${path.basename(updatedFilePath)}`
//                     });
//                 } catch (parseError) {
//                     console.error('Error parsing ffprobe verification output:', parseError);
//                     res.status(500).json({ error: 'Failed to parse verification metadata' });
//                 }
//             });
//         })
//         .on('error', (error) => {
//             console.error('Error updating metadata:', error);
//             res.status(500).json({ error: 'Failed to save metadata' });
//         })
//         .run();
// });

// router.get('/download/:filename', (req, res) => {
//     const filePath = path.join(__dirname, '../uploads/', req.params.filename);
//     if (fs.existsSync(filePath)) {
//         res.download(filePath);
//     } else {
//         res.status(404).json({ error: 'File not found' });
//     }
// });

// module.exports = router;


const express = require('express');
const multer = require('multer');
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const ffmpeg = require('fluent-ffmpeg');

const router = express.Router();
const uploadDir = path.join('/tmp', 'uploads');

// Ensure the /tmp/uploads directory exists
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const upload = multer({ dest: uploadDir });

const sanitizeKey = (key) => key.replace(/[^a-zA-Z0-9_]/g, '');

router.post('/upload', upload.single('video'), (req, res) => {
    const videoPath = req.file.path;
    exec(`ffprobe -v quiet -print_format json -show_format -show_streams "${videoPath}"`, (error, stdout) => {
        if (error) {
            console.error(`Error executing ffprobe: ${error}`);
            return res.status(500).json({ error: 'Failed to extract metadata' });
        }

        try {
            const metadata = JSON.parse(stdout);
            metadata.filename = req.file.filename;
            metadata.originalname = req.file.originalname;
            res.json(metadata);
        } catch (parseError) {
            console.error('Error parsing ffprobe output:', parseError);
            res.status(500).json({ error: 'Error parsing metadata' });
        }
    });
});

router.post('/save', (req, res) => {
    const { filename, customProperties } = req.body;
    const originalFilePath = path.join(uploadDir, filename);
    const updatedFilePath = path.join(uploadDir, `updated_${filename}.mp4`);

    console.log("Original file path:", originalFilePath);
    console.log("Does the original file exist?", fs.existsSync(originalFilePath));

    if (!fs.existsSync(originalFilePath)) {
        return res.status(404).json({ error: 'Video file not found' });
    }

    // Apply each metadata option separately
    const ffmpegCommand = ffmpeg(originalFilePath).output(updatedFilePath);

    Object.entries(customProperties).forEach(([key, value]) => {
        const sanitizedKey = sanitizeKey(key);
        ffmpegCommand.outputOption('-metadata', `${sanitizedKey}=${value}`);
    });

    ffmpegCommand
        .outputOptions('-map_metadata 0') // Copy all metadata from input
        .outputOptions('-c:v libx264') // Force re-encoding to apply metadata
        .outputOptions('-c:a aac')    // Re-encode audio to ensure compatibility with .mp4
        .on('end', () => {
            console.log("Metadata applied, now verifying with ffprobe...");

            exec(`ffprobe -v quiet -print_format json -show_format -show_streams "${updatedFilePath}"`, (error, stdout) => {
                if (error) {
                    console.error(`Error verifying metadata: ${error}`);
                    return res.status(500).json({ error: 'Failed to verify metadata in updated file' });
                }

                try {
                    const updatedMetadata = JSON.parse(stdout);
                    console.log("Updated metadata:", updatedMetadata);

                    const metadataCheck = Object.entries(customProperties).every(([key, value]) =>
                        updatedMetadata.format?.tags?.[sanitizeKey(key)] === value
                    );

                    if (!metadataCheck) {
                        console.error("Verification failed: Metadata not found as expected.");
                        return res.status(500).json({ error: 'Metadata embedding verification failed' });
                    }

                    res.status(200).json({
                        message: 'Metadata saved and verified successfully',
                        downloadPath: `/api/metadata/download/${path.basename(updatedFilePath)}`
                    });

                    // Clean up the uploads directory after task completion
                    cleanUploadsDirectory();
                } catch (parseError) {
                    console.error('Error parsing ffprobe verification output:', parseError);
                    res.status(500).json({ error: 'Failed to parse verification metadata' });
                }
            });
        })
        .on('error', (error) => {
            console.error('Error updating metadata:', error);
            res.status(500).json({ error: 'Failed to save metadata' });
        })
        .run();
});

router.get('/download/:filename', (req, res) => {
    const filePath = path.join(uploadDir, req.params.filename);
    if (fs.existsSync(filePath)) {
        res.download(filePath, (err) => {
            if (!err) {
                console.log(`File downloaded: ${filePath}`);
                // Clean up after successful download
                fs.unlinkSync(filePath);
            }
        });
    } else {
        res.status(404).json({ error: 'File not found' });
    }
});

// Utility function to clean up the uploads directory
const cleanUploadsDirectory = () => {
    fs.readdir(uploadDir, (err, files) => {
        if (err) {
            console.error("Error reading uploads directory:", err);
            return;
        }

        files.forEach((file) => {
            const filePath = path.join(uploadDir, file);
            fs.unlink(filePath, (err) => {
                if (err) {
                    console.error(`Error deleting file: ${filePath}`, err);
                } else {
                    console.log(`Deleted file: ${filePath}`);
                }
            });
        });
    });
};

module.exports = router;
