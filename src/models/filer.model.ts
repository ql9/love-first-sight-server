export interface Filter {
    userId: string;
    preUserId: string;
    gender: string;
    distance: number;
    age: { from: number; to: number };
    height: { from: number; to: number };
    lookingFor: string;
    drinking: string;
    smoking: string;
    kids: string;
    from: string;
    university: string;
}
