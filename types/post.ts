import { Timestamp } from "firebase/firestore";

export interface Post {
    id: string;
    userId: string;
    displayName: string;
    userPhoto?: string;
    content: string;
    imageUrl?: string;
    createdAt: Timestamp;
}

export interface UserProfile {
    uid: string;
    email: string;
    displayName: string;
    photoURL?: string;
    bio?: string;
    createdAt: Timestamp;
}
