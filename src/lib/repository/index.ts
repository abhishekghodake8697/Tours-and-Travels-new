import { IDataRepository } from "./types";
import { FirestoreRepository } from "./firestore-repository";

// Singleton backed by Firestore — works on Vercel and any serverless runtime.
export const repository: IDataRepository = new FirestoreRepository();

export * from "./types";
