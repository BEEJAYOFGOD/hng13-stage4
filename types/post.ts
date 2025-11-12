import { Timestamp } from "firebase/firestore";

export interface Post {
    id: string;
    userId: string;
    displayName: string;
    content?: string;
    imageUrl?: string;
    createdAt: Timestamp;
}

export interface UserProfile {
    uid: string;
    email: string;
    displayName: string;
    bio?: string;
    createdAt: Timestamp;
}
