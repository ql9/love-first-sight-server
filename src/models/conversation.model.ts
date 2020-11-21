export interface Conversation {
    participants: Array<string>;
    state: boolean;
    users: Array<{ userId: string; name: string; avatar: string }>;
}

export interface InformationConversion {
    conversationId: string;
    lastModified: number;
    text: string;
    name: string;
    avatar: string;
}
