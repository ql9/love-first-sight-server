export interface User {
    name: string;
    email: { type: string; unique: true };
    intro: string;
    birthday: Date;
    gender: string;
    lookingFor: string;
    from: string;
    height: number;
    superLike: number;
    university: string;
    drinking: string;
    smoking: string;
    hobbies: Array<string>;
    kids: boolean;
    avatar: string;
    youLiked: Array<string>;
    images: Array<string>;
    matches: Array<string>;
    messages: Array<string>;
    availableUsers: Array<string>;
    nthUser: number;
    report: number;
    coordinates: { lat: number; long: number };
}
