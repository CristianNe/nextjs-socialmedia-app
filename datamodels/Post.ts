import { Timestamp } from "firebase/firestore";

export interface Post {
    title: String,
    slug: String,
    uid: String,
    username: String,
    published: boolean,
    content: String,
    createdAt: Timestamp,
    updatedAt: Timestamp,
    heartCount: Number
};