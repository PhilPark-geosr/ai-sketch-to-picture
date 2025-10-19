import React, { useCallback, useRef, useState } from 'react'
import {
  View,
  StyleSheet,
  Pressable,
  Text,
  ViewStyle,
  Alert,
  TextInput
} from 'react-native'
import * as FileSystem from 'expo-file-system/legacy'
import * as MediaLibrary from 'expo-media-library'
import { SketchUploader } from '../managers/SketchUploader'
import { GalleryPickerManager } from '../managers/GalleryPickerManager'
import { PickedAsset } from '../managers/types'
import ImageModal from './ImageModal'
import ImageCard from './ImageCard'
import DrawerSlider from './DrawerSlider'
import DrawingCanvas, { DrawingCanvasRef } from './DrawingCanvas'

type Props = {
  uploadUrl: string
  style?: ViewStyle
  onUploaded?: (res: Response) => void
  onError?: (err: unknown) => void
}

export const MemoSketch: React.FC<Props> = ({
  uploadUrl,
  style,
  onUploaded,
  onError
}) => {
  const defaultStrokeWidth = 4
  const [image, setImage] = useState<PickedAsset | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [serverImageBlob, setServerImageBlob] = useState<string | null>(null)
  const drawingCanvasRef = useRef<DrawingCanvasRef>(null)
  const [text, onChangeText] = useState('')

  //drawing area
  const [currentStrokeWidth, setCurrentStrokeWidth] =
    useState(defaultStrokeWidth)

  const handleSend = async () => {
    try {
      if (!drawingCanvasRef.current) {
        throw new Error('DrawingCanvas ref is not available')
      }

      console.log('📸 스크린샷 캡처 시작...')

      // 파일 경로로 캡처 후 base64로 변환
      const fileUri = await drawingCanvasRef.current.capture()
      console.log('📸 캡처된 파일 URI:', fileUri)

      if (!fileUri) {
        throw new Error('Capture failed - no file URI returned')
      }

      // 파일을 base64로 변환
      console.log('🔄 파일을 base64로 변환 중...')
      const base64 = await FileSystem.readAsStringAsync(fileUri, {
        encoding: 'base64'
      })
      console.log('📸 변환된 base64 길이:', base64?.length || 0)
      console.log('📸 base64 시작 부분:', base64?.substring(0, 50) || '없음')

      if (!base64) {
        throw new Error('Capture failed - no base64 data returned')
      }

      console.log('🚀 서버 업로드 시작...')
      const res = await SketchUploader.uploadPngBase64({
        uploadUrl: 'set your ip',
        base64Png: base64,
        fileName: 'memo-sketch.png',
        fieldName: 'sketch',
        prompt: text
      })
      console.log('✅ 서버 업로드 완료:', res.status)
      // console.log('✅ 서버 업로드 결과:', res)

      //TODO: 명세보고 타입지정
      const data: { image: string } = await res.json()
      // console.log('🖼️ 서버 이미지 blob URL 생성:', data.image)
      setServerImageBlob(data.image)

      onUploaded?.(res)
    } catch (err) {
      console.error('❌ Save 에러:', err)
      onError?.(err)
    }
  }

  const handleSaveToGallery = async () => {
    try {
      if (!drawingCanvasRef.current) {
        throw new Error('DrawingCanvas ref is not available')
      }

      console.log('📸 갤러리 저장용 스크린샷 캡처 시작...')

      // 파일 경로로 캡처
      const fileUri = await drawingCanvasRef.current.capture()
      console.log('📸 캡처된 파일 URI:', fileUri)

      if (!fileUri) {
        throw new Error('Capture failed - no file URI returned')
      }

      // 권한 요청
      const { status } = await MediaLibrary.requestPermissionsAsync(false, [
        'photo'
      ])
      if (status !== 'granted') {
        Alert.alert('권한 필요', '갤러리에 저장하려면 권한이 필요합니다.')
        return
      }

      // 갤러리에 저장
      const asset = await MediaLibrary.createAssetAsync(fileUri)
      await MediaLibrary.createAlbumAsync('MemoSketch', asset, false)

      Alert.alert('성공', '스케치가 갤러리에 저장되었습니다!')
      console.log('✅ 갤러리 저장 완료:', asset)
    } catch (err) {
      console.error('❌ 갤러리 저장 에러:', err)
      Alert.alert('오류', '갤러리 저장 중 오류가 발생했습니다.')
    }
  }

  const handleOpenGallery = useCallback(async () => {
    setError(null)
    setBusy(true)
    try {
      const pickedImage: PickedAsset = await GalleryPickerManager.pickImage({
        includeBase64: true, // 업로드가 필요하다면 true로 변경
        quality: 0.92
      })
      if (pickedImage) {
        setImage(pickedImage)
        //modal open
        openModal()
      }
    } catch (e: any) {
      setError(e?.message ?? String(e))
    } finally {
      setBusy(false)
    }
  }, [])

  function openModal() {
    setModalVisible(true)
  }

  return (
    <View style={[styles.container, style]}>
      {modalVisible && (
        <ImageModal
          modalVisible={modalVisible}
          onClosed={() => setModalVisible(false)}
          image={image}
        />
      )}

      <DrawingCanvas
        ref={drawingCanvasRef}
        strokeColor="#111"
        strokeWidth={currentStrokeWidth}
        backgroundColor="#fff"
      />

      {/* 툴바 */}
      <View style={styles.toolbar}>
        <ToolButton
          label="Clear"
          onPress={() => drawingCanvasRef.current?.clear()}
        />
        <ToolButton
          label="Send"
          onPress={handleSend}
        />
        <ToolButton
          label="save"
          onPress={handleSaveToGallery}
        />
        <ToolButton
          label="Gallery"
          onPress={busy ? undefined : handleOpenGallery}
        />
      </View>

      {/* TODO: IOS 11이상부터는 SafeAreaView를 사용해야 함 */}
      <View>
        <TextInput
          multiline={true}
          numberOfLines={4}
          maxLength={300} // 최소 높이
          style={styles.input}
          onChangeText={onChangeText}
          value={text}
          placeholder="Tell me about your sketch"
          textAlignVertical="top"
        />
      </View>

      {!serverImageBlob && (
        <ImageCard
          src={serverImageBlob}
          title="서버응답 이미지"
        />
      )}

      <DrawerSlider
        min={1}
        max={20}
        value={currentStrokeWidth}
        onChangeValue={setCurrentStrokeWidth}
        step={1}
      />
    </View>
  )
}

const ToolButton = ({
  label,
  onPress
}: {
  label: string
  onPress: () => void
}) => (
  <Pressable
    onPress={onPress}
    style={styles.btn}>
    <Text style={styles.btnText}>{label}</Text>
  </Pressable>
)

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flex: 1
  },
  toolbar: {
    marginTop: 12,
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 4,
    justifyContent: 'flex-end'
  },
  btn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: '#111'
  },
  btnText: { color: '#fff', fontWeight: '600' },
  input: {
    height: 100,
    margin: 12,
    borderWidth: 2,
    padding: 10,
    borderRadius: 10,
    borderColor: '#ccc'
  }
})
