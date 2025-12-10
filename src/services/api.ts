export interface ChatResponse {
    success: boolean;
    data: string;
    error?: string;
}

const API_URL = import.meta.env.VITE_API_URL;

export const sendToBackend = async (message: string): Promise<string> => {
    try {
        const response = await fetch(`${API_URL}/ai/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message }),
        });

        if (!response.ok) {
            // Handle 503 or 500 errors gracefully
            throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }

        const data: ChatResponse = await response.json();
        console.log("Res:", data);
        return data.data;

    } catch (error) {
        console.error("API Call Failed:", error);
        throw error; // Re-throw so the component knows it failed
    }
};