// services/IAudioStorageService.ts

export interface IAudioStorageService {
  saveRecording(uri: string): Promise<Response>
  deleteRecording(uri: string): Promise<void>
  getRecordings(): Promise<string[]>
}
