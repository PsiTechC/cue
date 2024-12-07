const express = require('express');
const cueSheetQueue = require('../cueSheetQueue');
const router = express.Router();

// Route to start cue sheet generation
router.post('/start-cue-sheet-generation', async (req, res) => {
  const { programName, userId } = req.body;
  console.log(`Received request to generate cue sheet for Program: ${programName}, User: ${userId}`);

  try {
    const job = await cueSheetQueue.add({ programName, userId });
    console.log(`Job created with ID: ${job.id} for Program: ${programName}, User: ${userId}`);
    res.json({ jobId: job.id }); // Return jobId to track status
  } catch (error) {
    console.error(`Error adding job to the queue: ${error.message}`);
    res.status(500).json({ message: 'Failed to add job to the queue' });
  }
});

// Route to check the status of the job
router.get('/job-status/:jobId', async (req, res) => {
  const { jobId } = req.params;
  console.log(`Received request to check job status for Job ID: ${jobId}`);

  try {
    const job = await cueSheetQueue.getJob(jobId); // Retrieve the job by ID
    if (job) {
      const status = await job.isCompleted()
        ? 'completed'
        : await job.isFailed()
        ? 'failed'
        : 'in-progress';
      
      console.log(`Job ID: ${jobId} status: ${status}`);
      res.json({ status });
    } else {
      console.error(`Job ID: ${jobId} not found`);
      res.status(404).json({ message: 'Job not found' });
    }
  } catch (error) {
    console.error(`Error fetching job status for Job ID: ${jobId} - ${error.message}`);
    res.status(500).json({ message: 'Failed to fetch job status' });
  }
});

module.exports = router;
