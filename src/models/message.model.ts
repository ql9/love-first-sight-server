export interface Message {
    createdAt: number;
    text: string;
    user: {
        _id: string;
        avatar: string;
    };
}
