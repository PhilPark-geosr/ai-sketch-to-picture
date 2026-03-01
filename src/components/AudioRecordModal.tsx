import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState
} from 'react'
import { View, Text, Modal, Pressable, StyleSheet, Alert } from 'react-native'
import { useAudioStorage } from '../services/AudioStorageContext'
import {
  AudioModule,
  RecordingPresets,
  setAudioModeAsync,
  useAudioPlayer,
  useAudioPlayerStatus,
  useAudioRecorder,
  useAudioRecorderState
} from 'expo-audio'
import { Ionicons } from '@expo/vector-icons'
const AudioRecordModal = forwardRef((props, ref) => {
  const [visible, setVisible] = useState(false)
  const [uri, setUri] = useState<string | null>(null)
  const [isRecording, setIsRecording] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const audioRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY)
  const audioStorageService = useAudioStorage()
  const recorderState = useAudioRecorderState(audioRecorder)
  const player = useAudioPlayer(uri ?? null)
  const playerStatus = useAudioPlayerStatus(player)
  useImperativeHandle(ref, () => ({
    open: async (passedUri?: string) => {
      setVisible(true)
      await audioRecorder.prepareToRecordAsync()
      audioRecorder.record()
      setIsRecording(true)
    },
    close: () => setVisible(false)
  }))

  useEffect(() => {
    ;(async () => {
      const status = await AudioModule.requestRecordingPermissionsAsync()
      if (!status.granted) {
        Alert.alert('Permission to access microphone was denied')
      }

      setAudioModeAsync({
        playsInSilentMode: true,
        allowsRecording: true
      })
    })()
  }, [])

  const onSaveHandler = async () => {
    try {
      const result = await audioStorageService.saveRecording(uri)
      console.log('saveRecording result: ', result)
      const { prompt_en, stt_text } = await result.json()
      console.log('saveRecording data: ', prompt_en, stt_text)
    } catch (error) {
      console.error('saveRecording error: ', error)
    }
    setVisible(false) // ← 저장 완료 후 실행됨!
  }

  const onPauseHandler = async () => {
    await audioRecorder.pause()
    setIsPaused(true)
  }

  const onCancelHandler = async () => {
    try {
      await audioRecorder.stop()
    } catch (error) {
      console.warn('stop 실패:', error)
    } finally {
      setVisible(false)
      setIsPaused(false)
    }
  }

  const onResumeHandler = async () => {
    await audioRecorder.record()
    setIsPaused(false)
  }

  const onCompleteHandler = async () => {
    try {
      await audioRecorder.stop()
      setUri(audioRecorder.uri ?? null)
    } catch (error) {
      console.warn('stop 실패:', error)
    } finally {
      setIsRecording(false)
      setIsPaused(false)
    }
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade">
      <View style={styles.modalOverlay}>
        {isRecording ? (
          <View style={styles.modalContent}>
            <Text style={styles.title}>녹음 중</Text>
            <View style={styles.buttonContainer}>
              <Pressable
                style={[styles.button, styles.cancelButton]}
                onPress={onCancelHandler}>
                <Ionicons
                  name="trash-outline"
                  size={24}
                  color="#666"
                />
              </Pressable>
              {isPaused ? (
                <Pressable
                  style={[styles.button, styles.resumeButton]}
                  onPress={onResumeHandler}>
                  <Ionicons
                    name="play"
                    size={24}
                    color="white"
                  />
                </Pressable>
              ) : (
                <Pressable
                  style={[styles.button, styles.confirmButton]}
                  onPress={onPauseHandler}>
                  <Ionicons
                    name="pause"
                    size={24}
                    color="white"
                  />
                </Pressable>
              )}

              <Pressable
                style={[styles.button, styles.confirmButton]}
                onPress={onCompleteHandler}>
                <Ionicons
                  name="checkmark"
                  size={24}
                  color="white"
                />
              </Pressable>
            </View>
          </View>
        ) : (
          <View style={styles.modalContent}>
            <Text style={styles.title}>녹음이 완료되었습니다!</Text>
            <Text style={styles.message}>녹음 파일을 저장하시겠습니까?</Text>
            {uri && (
              <View style={styles.playbackContainer}>
                <Pressable
                  style={[styles.button, styles.playButton]}
                  onPress={async () => {
                    if (playerStatus.playing) {
                      player.pause()
                    } else {
                      const atEnd =
                        playerStatus.didJustFinish ||
                        playerStatus.currentTime >= playerStatus.duration - 0.1

                      if (atEnd) {
                        await player.seekTo(0)
                      }
                      player.play()
                    }
                  }}>
                  <Text style={styles.playButtonText}>
                    {playerStatus.playing ? '일시정지' : '재생'}
                  </Text>
                </Pressable>
                <Text style={styles.durationText}>
                  {playerStatus.isLoaded
                    ? `${Math.floor(playerStatus.currentTime)} / ${Math.floor(playerStatus.duration)}초`
                    : '로딩중..'}
                </Text>
              </View>
            )}
            <View style={styles.buttonContainer}>
              <Pressable
                style={[styles.button, styles.cancelButton]}
                onPress={() => setVisible(false)}>
                <Text style={styles.cancelText}>취소</Text>
              </Pressable>
              <Pressable
                style={[styles.button, styles.confirmButton]}
                onPress={onSaveHandler}>
                <Text style={styles.confirmText}>저장</Text>
              </Pressable>
            </View>
          </View>
        )}
      </View>
    </Modal>
  )
})

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    width: '80%',
    maxWidth: 320,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333'
  },
  message: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
    textAlign: 'center'
  },
  playbackContainer: {
    marginBottom: 20,
    alignItems: 'center',
    gap: 8
  },
  playButton: {
    backgroundColor: '#2196F3'
  },
  playButtonText: {
    color: 'white',
    fontWeight: '600'
  },
  durationText: {
    fontSize: 12,
    color: '#888'
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    minWidth: 60,
    alignItems: 'center'
  },
  cancelButton: {
    backgroundColor: '#f0f0f0'
  },
  resumeButton: {
    backgroundColor: '#2196F3'
  },
  confirmButton: {
    backgroundColor: '#4CAF50'
  },
  cancelText: {
    color: '#666',
    fontWeight: '600'
  },
  confirmText: {
    color: 'white',
    fontWeight: '600'
  }
})

export default AudioRecordModal
