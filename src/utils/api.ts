import axios from "axios"

type ApiEnvelope<T> = {
    data: T;
    message?: string;
}

export type PublicChatApiMessage = {
    id: number;
    text: string;
    type: "INPUT" | "OUTPUT";
    sentAt: string;
    usage: number;
    executionTimeMs?: number | null;
    toolOutput?: unknown;
}

type PublicChatState = {
    sessionUuid: string;
    createdAt: string;
    messages: PublicChatApiMessage[];
}

type PublicCreateMessageResult = {
    sessionUuid: string;
    input: PublicChatApiMessage;
    output: PublicChatApiMessage;
}

export type PublicChatRequestConfig = {
    apiBaseUrl: string;
}

const buildPublicChatUrl = ({ apiBaseUrl }: PublicChatRequestConfig) => {
    console.log({apiBaseUrl});
    
    const normalizedBaseUrl = apiBaseUrl.replace(/\/+$/, "");
    return normalizedBaseUrl;
}

export const sendMessageToBot = async (message: string, config: PublicChatRequestConfig): Promise<string> => {
    const response = await axios.post<ApiEnvelope<PublicCreateMessageResult>>(
        buildPublicChatUrl(config),
        { text: message },
        { withCredentials: true }
    );

    return response.data.data.output.text;
}

export const getDialog = async (config: PublicChatRequestConfig): Promise<PublicChatApiMessage[]> => {
    const response = await axios.get<ApiEnvelope<PublicChatState>>(
        buildPublicChatUrl(config),
        { withCredentials: true }
    );

    return response.data.data.messages ?? [];
}
