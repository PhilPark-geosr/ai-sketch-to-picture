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
  useAudioRecorder,
  useAudioRecorderState
} from 'expo-audio'

const AudioRecordModal = forwardRef((props, ref) => {
  const [visible, setVisible] = useState(false)
  const [uri, setUri] = useState<string | null>(null)
  const [isRecording, setIsRecording] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const audioRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY)
  const audioStorageService = useAudioStorage()
  const recorderState = useAudioRecorderState(audioRecorder)
  useImperativeHandle(ref, () => ({
    open: async uri => {
      setVisible(true)
      setUri(uri)
      await audioRecorder.prepareToRecordAsync()
      audioRecorder.record()
      setIsRecording(true)
    },
    close: () => setVisible(false)
  }))

  // 로깅용, 확인되면 지울것
  useEffect(() => {
    console.log('recorderState:', recorderState)
  }, [recorderState])

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
    await audioRecorder.stop()
    const uri = audioRecorder.uri
    console.log('audioRecorder: ', uri)
    console.log('recorderState: ', recorderState.isRecording)
    setVisible(false)
    setIsPaused(false)
  }

  const onResumeHandler = async () => {
    await audioRecorder.record()
    setIsPaused(false)
  }

  const onCompleteHandler = async () => {
    await audioRecorder.stop()
    setIsRecording(false)
    setIsPaused(false)
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
              {isPaused ? (
                <Pressable
                  style={[styles.button, styles.confirmButton]}
                  onPress={onResumeHandler}>
                  <Text>재생</Text>
                </Pressable>
              ) : (
                <Pressable
                  style={[styles.button, styles.confirmButton]}
                  onPress={onPauseHandler}>
                  <Text>일시정지</Text>
                </Pressable>
              )}
              <Pressable
                style={[styles.button, styles.cancelButton]}
                onPress={onCancelHandler}>
                <Text>취소</Text>
              </Pressable>
              <Pressable
                style={[styles.button, styles.cancelButton]}
                onPress={onCompleteHandler}>
                <Text>완료</Text>
              </Pressable>
            </View>
          </View>
        ) : (
          <View style={styles.modalContent}>
            <Text style={styles.title}>녹음이 완료되었습니다!</Text>
            <Text style={styles.message}>녹음 파일을 저장하시겠습니까?</Text>
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
    marginBottom: 24,
    textAlign: 'center'
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    minWidth: 100,
    alignItems: 'center'
  },
  cancelButton: {
    backgroundColor: '#f0f0f0'
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
