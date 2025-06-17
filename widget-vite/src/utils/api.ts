import axios from "axios"

export const sendMessageToBot = async (message: string, url: string): Promise<string> => {
    const response = await axios.post<{output: string}>(url, {message});
    return response.data.output;
}