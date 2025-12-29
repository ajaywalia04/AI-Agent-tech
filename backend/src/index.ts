import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';
import { createSession, saveMessage, getHistory } from './db';
import { generateReply } from './llm';

const app = express();
const port = process.env.PORT || 3001;

console.log('OPENROUTER_API_KEY set:', !!process.env.OPENROUTER_API_KEY);
if (process.env.OPENROUTER_API_KEY) {
    console.log('Key starts with:', process.env.OPENROUTER_API_KEY.substring(0, 10) + '...');
}

app.use(cors());
app.use(express.json());

// Routes
app.post('/chat/message', async (req, res) => {
    const { message, sessionId: providedSessionId } = req.body;

    if (!message || typeof message !== 'string' || message.trim() === '') {
        return res.status(400).json({ error: 'Message is required and cannot be empty.' });
    }

    // Truncate very long messages
    const sanitizedMessage = message.slice(0, 1000);

    const sessionId = providedSessionId || uuidv4();

    try {
        // Ensure session exists
        createSession(sessionId);

        // Save user message
        saveMessage(sessionId, 'user', sanitizedMessage);

        // Get history for context
        const history = getHistory(sessionId);

        // Generate AI reply
        const reply = await generateReply(history.slice(0, -1), sanitizedMessage);

        // Save AI reply
        saveMessage(sessionId, 'assistant', reply);

        res.json({ reply, sessionId });
    } catch (error: any) {
        console.error('Chat Error:', error.message);
        res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
});

// Fetch history for a session
app.get('/chat/history/:sessionId', (req, res) => {
    const { sessionId } = req.params;
    try {
        const history = getHistory(sessionId);
        res.json({ history });
    } catch (error: any) {
        res.status(500).json({ error: 'Failed to fetch history.' });
    }
});

app.listen(port, () => {
    console.log(`Backend server running at http://localhost:${port}`);
});
