// services/IAudioStorageService.ts

export interface IAudioStorageService {
    saveRecording(uri: string): Promise<string>;
    deleteRecording(uri: string): Promise<void>;
    getRecordings(): Promise<string[]>;
  }