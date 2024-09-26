import dotenv from 'dotenv';
import OpenAI from "openai";
import express from 'express';

dotenv.config();
const router = express.Router();
const openai = new OpenAI({apiKey: process.env.OPENAI_API_KEY});

router.get('/start-thread', async (req, res) => {
  try {
    const thread = await openai.beta.threads.create();
    console.log(thread);
    res.json(thread.id)
  } catch (err) {
    res.status(500).send('There has been starting the ai chat', err);
  }
});

router.post('/send-message', async (req, res) => {
  try {
    const { threadId, content } = req.body;
    console.log(threadId, content);
    const message = await openai.beta.threads.messages.create(
      threadId,
      {
        role: "user",
        content: content
      }
    );
    res.json(message.id);
  } catch (err) {
    res.status(500).send('There has been issue starting the ai chat', err);
  }
});

router.post('/run', async (req, res) => {
  try {
    const { threadId } = req.body;
    console.log(req.body.threadId)
    let run = await openai.beta.threads.runs.createAndPoll(
      threadId,
      { 
        assistant_id: process.env.ASSISTANT_ID,
        instructions: "You are an expert on social infrastructure support resources in Vancouver Canada. Use the data provided in the files to suggest a resource by it's name as well as why you are making the suggestion."
      }
    );
    console.log(JSON.stringify(run));
    res.json(run);
  } catch (err) {
    res.status(500).send('There has been issue reading ai chat', err);
  }
});

router.post('/poll', async (req, res) => {
  try {
    const { threadId, runId } = req.body;
    console.log(req.body.threadId)
    let run = await openai.beta.threads.runs.poll(
      threadId,
      runId
    );
    console.log(JSON.stringify(run));
    res.json(run);
  } catch (err) {
    res.status(500).send('There has been issue reading ai chat', err);
  }
});

router.post('/messages', async (req, res) => {
  try {
    const { threadId, runStatus } = req.body;
    if (runStatus === 'completed') {
      const messages = await openai.beta.threads.messages.list(
        threadId
      );
      res.json(messages.data.reverse());
    } else {
      console.log(runStatus);
      res.json('loading');
    }
  } catch (err) {
    res.status(500).send('There has been an issue polling', err)
  }
});

export default router;
