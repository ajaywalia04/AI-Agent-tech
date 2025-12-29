import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

export interface Message {
    role: 'user' | 'assistant';
    content: string;
}

export const sendMessage = async (message: string, sessionId?: string) => {
    const response = await axios.post(`${API_BASE_URL}/chat/message`, {
        message,
        sessionId,
    });
    return response.data;
};

export const fetchHistory = async (sessionId: string) => {
    const response = await axios.get(`${API_BASE_URL}/chat/history/${sessionId}`);
    return response.data.history;
};
