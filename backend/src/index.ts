import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';
import { createSession, saveMessage, getHistory } from './db';
import { generateReply } from './llm';
import path from 'path';

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Serve static files from the React app
const frontendPath = path.join(__dirname, '../../frontend/dist');
app.use(express.static(frontendPath));

// API Routes
app.post('/chat/message', async (req, res) => {
    const { message, sessionId: providedSessionId } = req.body;

    if (!message || typeof message !== 'string' || message.trim() === '') {
        return res.status(400).json({ error: 'Message is required and cannot be empty.' });
    }

    const sanitizedMessage = message.slice(0, 1000);
    const sessionId = providedSessionId || uuidv4();

    try {
        createSession(sessionId);
        saveMessage(sessionId, 'user', sanitizedMessage);
        const history = getHistory(sessionId);

        // Generate AI reply (exclude the message we just saved to get clean history)
        const reply = await generateReply(history.slice(0, -1), sanitizedMessage);

        saveMessage(sessionId, 'assistant', reply);

        res.json({ reply, sessionId });
    } catch (error: any) {
        console.error('Chat Error:', error.message);
        res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
});

app.get('/chat/history/:sessionId', (req, res) => {
    const { sessionId } = req.params;
    try {
        const history = getHistory(sessionId);
        res.json({ history });
    } catch (error: any) {
        res.status(500).json({ error: 'Failed to fetch history.' });
    }
});

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
    if (frontendPath) {
        res.sendFile(path.join(frontendPath, 'index.html'));
    } else {
        res.status(404).send('Frontend not found');
    }
});

app.listen(port, () => {
    console.log(`Server running at port ${port}`);
});
