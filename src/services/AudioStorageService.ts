// services/AudioStorageService.ts

import { IAudioStorageService } from './IAudioStorageService'
import { STT_SERVER_URL } from '@env'
export class AudioStorageService implements IAudioStorageService {
  async saveRecording(uri: string): Promise<Response> {
    console.log('로컬에 저장:', uri)

    const form = new FormData()
    form.append('file', {
      uri: uri,
      type: 'audio/m4a',
      name: 'reording.m4a'
    } as any)

    return fetch(`${STT_SERVER_URL}/voice-to-prompt`, {
      method: 'POST',
      body: form
    })
  }

  async deleteRecording(uri: string): Promise<void> {
    console.log('삭제:', uri)
  }

  async getRecordings(): Promise<string[]> {
    return []
  }
}
