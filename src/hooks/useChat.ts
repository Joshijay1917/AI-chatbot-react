import { useState } from 'react';
import { sendToBackend } from '../services/api';

export const useChat = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const askAI = async (message: string) => {
        setLoading(true);
        setError(null);
        try {
            const reply = await sendToBackend(message);
            setLoading(false);
            return reply;
        } catch (err) {
            setLoading(false);
            setError("Failed to get response");
            return "I am having trouble connecting right now.";
        }
    };

    return { askAI, loading, error };
};