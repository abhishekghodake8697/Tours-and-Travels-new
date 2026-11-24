import { IDataRepository } from "./types";
import { GitHubRepository } from "./github-repository";

// Singleton backed by GitHub JSON files — zero database dependency.
// Writes commit to GitHub; reads are cached with the 'site-data' tag.
export const repository: IDataRepository = new GitHubRepository();

export * from "./types";
