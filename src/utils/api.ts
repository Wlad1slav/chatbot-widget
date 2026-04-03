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

const SESSION_STORAGE_KEY_PREFIX = "chatbot-widget-session:";
const sessionUuidMemoryCache = new Map<string, string>();

const buildPublicChatUrl = ({ apiBaseUrl }: PublicChatRequestConfig) => {
    const normalizedBaseUrl = apiBaseUrl.replace(/\/+$/, "");
    return normalizedBaseUrl;
}

const buildSessionStorageKey = (baseUrl: string) => `${SESSION_STORAGE_KEY_PREFIX}${baseUrl}`;

const getStoredSessionUuid = (baseUrl: string): string | undefined => {
    const cached = sessionUuidMemoryCache.get(baseUrl);
    if (cached) {
        return cached;
    }

    if (typeof window === "undefined") {
        return undefined;
    }

    try {
        const storedValue = window.localStorage.getItem(buildSessionStorageKey(baseUrl)) ?? undefined;
        if (!storedValue) {
            return undefined;
        }

        sessionUuidMemoryCache.set(baseUrl, storedValue);
        return storedValue;
    } catch {
        return undefined;
    }
}

const storeSessionUuid = (baseUrl: string, sessionUuid?: string) => {
    if (!sessionUuid) {
        return;
    }

    sessionUuidMemoryCache.set(baseUrl, sessionUuid);

    if (typeof window === "undefined") {
        return;
    }

    try {
        window.localStorage.setItem(buildSessionStorageKey(baseUrl), sessionUuid);
    } catch {
        // localStorage may be unavailable in private/embedded browsing modes.
    }
}

export const sendMessageToBot = async (message: string, config: PublicChatRequestConfig): Promise<string> => {
    const baseUrl = buildPublicChatUrl(config);
    const sessionUuid = getStoredSessionUuid(baseUrl);

    const response = await axios.post<ApiEnvelope<PublicCreateMessageResult>>(
        baseUrl,
        {
            text: message,
            ...(sessionUuid ? { sessionUuid } : {})
        },
        {
            withCredentials: true,
            headers: sessionUuid ? { "x-session-uuid": sessionUuid } : undefined
        }
    );

    storeSessionUuid(baseUrl, response.data.data.sessionUuid);

    return response.data.data.output.text;
}

export const getDialog = async (config: PublicChatRequestConfig): Promise<PublicChatApiMessage[]> => {
    const baseUrl = buildPublicChatUrl(config);
    const sessionUuid = getStoredSessionUuid(baseUrl);

    const response = await axios.get<ApiEnvelope<PublicChatState>>(
        baseUrl,
        {
            withCredentials: true,
            params: sessionUuid ? { sessionUuid } : undefined,
            headers: sessionUuid ? { "x-session-uuid": sessionUuid } : undefined
        }
    );

    storeSessionUuid(baseUrl, response.data.data.sessionUuid);

    return response.data.data.messages ?? [];
}
