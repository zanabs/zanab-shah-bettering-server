import OpenAI from "openai";
import express from 'express';
import path from 'path';
import fs from 'fs/promises'; 
import { fileURLToPath } from 'url';

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const categoryPath = path.join(__dirname, '../data/categories.json');
const foodPath = path.join(__dirname, '../data/free-and-low-cost-food-programs.geojson')
const shelterPath = path.join(__dirname, '../data/homeless-shelter-locations.geojson')
const gardenPath = path.join(__dirname, '../data/community-gardens-and-food-trees.geojson')
const culturePath = path.join(__dirname, '../data/cultural-spaces.geojson')
const mentalHealthPath = path.join(__dirname, '../data/mental-health-providers.geojson')
const dentalPath = path.join(__dirname, '../data/dental-providers.geojson')
const gbvPath=path.join(__dirname, '../data/gender-based-violence-support.geojson')

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

router.get('/run', async (req, res) => {
  try {
    const { threadId } = req.body;
    console.log(threadId);
    let run = await openai.beta.threads.runs.createAndPoll(
      threadId,
      { 
        assistant_id: 'asst_QSF3E29HDBMTVbeybOmEtGPs',
        instructions: "The user has a premium account."
      }
    );
    console.log(JSON.stringify(run));
    res.json(run);
  } catch (err) {
    res.status(500).send('There has been issue reading ai chat', err);
  }
});

router.get('/messages', async (req, res) => {
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
