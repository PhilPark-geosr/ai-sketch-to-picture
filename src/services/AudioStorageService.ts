// services/AudioStorageService.ts

import { IAudioStorageService } from './IAudioStorageService';

export class AudioStorageService implements IAudioStorageService {
  async saveRecording(uri: string): Promise<string> {
    console.log('로컬에 저장:', uri);
    // FileSystem 저장 로직
    return uri;
  }

  async deleteRecording(uri: string): Promise<void> {
    console.log('삭제:', uri);
  }

  async getRecordings(): Promise<string[]> {
    return [];
  }
}