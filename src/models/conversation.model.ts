export interface Conversation {
    participants: Array<string>;
    state: boolean;
    users: Array<{ userId: string; name: string; avatar: string }>;
    matchedAt: number;
}
