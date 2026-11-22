import { IDataRepository } from "./types";
import { FileDataRepository } from "./file-repository";

// Export singleton instance. Can be swapped with a DatabaseRepository, SupabaseRepository, etc. later without touching UI!
export const repository: IDataRepository = new FileDataRepository();

export * from "./types";
