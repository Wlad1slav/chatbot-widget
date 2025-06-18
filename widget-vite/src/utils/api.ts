import axios from "axios"

export const sendMessageToBot = async (message: string, url: string): Promise<string> => {
    const response = await axios.post<{ output: string }>(url, { message });
    return response.data.output;
}

export const getDialoge = async (url: string) => {
    const response = await axios.get<{
        propertyName: string[];
    }>(url);

    const messagesData: {
        type: 'ai' | 'human';
        data: { content: string; }
    }[] = [];

    for (const messageStringJson of response.data.propertyName) {
        const message = JSON.parse(messageStringJson)
        messagesData.push(message);
    } 

    return messagesData.reverse();
}