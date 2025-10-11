import React, { useCallback, useMemo, useRef, useState } from 'react'
import {
  View,
  StyleSheet,
  PanResponder,
  PanResponderInstance,
  GestureResponderEvent,
  PanResponderGestureState,
  Pressable,
  Text,
  ViewStyle,
  Alert,
  Image,
  Modal,
  TextInput
} from 'react-native'
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context'
import Svg, { Path, Rect } from 'react-native-svg'
import ViewShot from 'react-native-view-shot'
import * as FileSystem from 'expo-file-system/legacy'
import * as MediaLibrary from 'expo-media-library'
import type { Stroke, Point } from '../types/sketch'
import { SketchUploader } from '../managers/SketchUploader'
import Title from './Title'
import { GalleryPickerManager } from '../managers/GalleryPickerManager'
import { PickedAsset } from '../managers/types'
import ImageModal from './ImageModal'
import Slider from '@react-native-community/slider'

type Props = {
  uploadUrl: string
  style?: ViewStyle
  strokeColor?: string
  strokeWidth?: number
  backgroundColor?: string
  onUploaded?: (res: Response) => void
  onError?: (err: unknown) => void
}

export const MemoSketch: React.FC<Props> = ({
  uploadUrl,
  style,
  strokeColor = '#111',
  strokeWidth = 4,
  backgroundColor = '#fff',
  onUploaded,
  onError
}) => {
  const [image, setImage] = useState<PickedAsset | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [strokes, setStrokes] = useState<Stroke[]>([])
  const [current, setCurrent] = useState<Stroke | null>(null)
  const [imageUrl, setImageUrl] = useState<string>('')
  const [serverImageBlob, setServerImageBlob] = useState<string | null>(null)
  const viewShotRef = useRef<ViewShot>(null)
  const [text, onChangeText] = useState('')

  //drawing area
  const [currentStrokeWidth, setCurrentStrokeWidth] = useState(strokeWidth)
  // 드로어 열림/닫힘 상태
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  // 드래그 제스처를 위한 상태
  const [drawerHeight, setDrawerHeight] = useState(0)

  // 컴포넌트 렌더링 추적
  // console.log('🔄 MemoSketch 컴포넌트 렌더링')
  // console.log('📊 현재 strokes 개수:', strokes.length)
  // console.log('📊 현재 current stroke:', current ? '있음' : '없음')

  const _safePointFromEvent = (e: GestureResponderEvent): Point | null => {
    const ne: any = e?.nativeEvent
    if (!ne) return null
    const t = (ne.touches && ne.touches[0]) || ne
    let x: number | undefined = t.locationX
    let y: number | undefined = t.locationY
    if (typeof x !== 'number' || typeof y !== 'number') {
      if (typeof t.pageX === 'number' && typeof t.pageY === 'number') {
        x = t.pageX
        y = t.pageY
      }
    }
    if (typeof x !== 'number' || typeof y !== 'number') return null
    return { x, y }
  }

  const pan: PanResponderInstance = useMemo(() => {
    // console.log('🔧 PanResponder가 새로 생성되었습니다!')
    // console.log('📊 strokeColor:', strokeColor)
    // console.log('📊 strokeWidth:', strokeWidth)
    // console.log('⏰ 생성 시간:', new Date().toLocaleTimeString())

    return PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,

      onPanResponderGrant: e => {
        const p = _safePointFromEvent(e)
        if (!p) return
        const s: Stroke = {
          id: String(Date.now()),
          color: strokeColor,
          width: currentStrokeWidth,
          points: [p]
        }
        setCurrent(s)
      },

      onPanResponderMove: (
        e: GestureResponderEvent,
        _gs: PanResponderGestureState
      ) => {
        const p = _safePointFromEvent(e)
        setCurrent(prev => {
          if (!prev || !p) return prev
          const last = prev.points[prev.points.length - 1]
          const dx = p.x - last.x
          const dy = p.y - last.y
          if (dx * dx + dy * dy < 1.5 * 1.5) return prev
          return { ...prev, points: [...prev.points, p] }
        })
      },

      onPanResponderRelease: () => {
        setCurrent(s => {
          if (s) setStrokes(arr => [...arr, s])
          return null
        })
      },
      onPanResponderTerminate: () => {
        setCurrent(s => {
          if (s) setStrokes(arr => [...arr, s])
          return null
        })
      }
    })
  }, [strokeColor, currentStrokeWidth])

  const _toPath = (pts: Point[]) => {
    if (pts.length === 0) return ''
    const [start, ...rest] = pts
    const move = `M ${start.x} ${start.y}`
    const lines = rest.map(p => `L ${p.x} ${p.y}`).join(' ')
    return `${move} ${lines}`
  }

  const handleClear = () => {
    setStrokes([])
    setCurrent(null)
  }

  const handleSend = async () => {
    try {
      if (!viewShotRef.current) {
        throw new Error('ViewShot ref is not available')
      }

      if (!('capture' in viewShotRef.current)) {
        throw new Error('ViewShot capture method is not available')
      }

      console.log('📸 스크린샷 캡처 시작...')

      // 파일 경로로 캡처 후 base64로 변환
      const fileUri = await viewShotRef.current.capture?.()
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
      if (!viewShotRef.current) {
        throw new Error('ViewShot ref is not available')
      }

      if (!('capture' in viewShotRef.current)) {
        throw new Error('ViewShot capture method is not available')
      }

      console.log('📸 갤러리 저장용 스크린샷 캡처 시작...')

      // 파일 경로로 캡처
      const fileUri = await viewShotRef.current.capture?.()
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

      {/* 카드형 래퍼 (그림자/라운드) */}
      <View style={styles.cardOuter}>
        {/* 내부는 라운드에 맞춰 컨텐츠를 자르기 위해 overflow: hidden */}
        <View style={styles.cardInner}>
          <ViewShot
            ref={viewShotRef}
            style={styles.shot}>
            <View
              style={styles.canvas}
              {...pan.panHandlers}>
              <Svg style={StyleSheet.absoluteFill}>
                {/* 배경 */}
                <Rect
                  x={0}
                  y={0}
                  width="100%"
                  height="100%"
                  fill={backgroundColor}
                />

                {/* 완료된 스트로크 */}
                {strokes.map(s => (
                  <Path
                    key={s.id}
                    d={_toPath(s.points)}
                    stroke={s.color}
                    strokeWidth={s.width}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  />
                ))}

                {/* 현재 스트로크 */}
                {current && (
                  <Path
                    d={_toPath(current.points)}
                    stroke={current.color}
                    strokeWidth={current.width}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  />
                )}
              </Svg>
            </View>
          </ViewShot>
        </View>
      </View>

      {/* 툴바 */}
      <View style={styles.toolbar}>
        <ToolButton
          label="Clear"
          onPress={handleClear}
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

      {/* 서버로부터 받은 이미지 표시 영역 */}
      {serverImageBlob && (
        <View style={styles.serverImageContainer}>
          <Text style={styles.serverImageTitle}>서버 응답 이미지</Text>
          <View style={styles.serverImageCard}>
            <Image
              source={{ uri: serverImageBlob }}
              style={styles.serverImage}
              resizeMode="contain"
            />
          </View>
        </View>
      )}

      <View style={styles.drawerContainer}>
        <Pressable
          style={styles.dragHandle}
          onPress={() => setIsDrawerOpen(!isDrawerOpen)}>
          <View style={styles.arrowIcon}>
            <Text style={styles.arrowText}>{isDrawerOpen ? '▼' : '▲'}</Text>
          </View>
        </Pressable>

        {isDrawerOpen && (
          <View style={styles.drawerContent}>
            <Text style={styles.strokeWidthLabel}>
              펜 두께: {currentStrokeWidth}px
            </Text>
            <Slider
              style={styles.slider}
              minimumValue={1}
              maximumValue={20}
              value={currentStrokeWidth}
              onValueChange={setCurrentStrokeWidth}
              step={1}
              minimumTrackTintColor="#111"
              maximumTrackTintColor="#e6e6e6"
            />
          </View>
        )}
      </View>
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

const RADIUS = 16

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flex: 1
    // 카드와 툴바 사이 간격
  },
  // 카드 바깥: 그림자/모서리/테두리
  cardOuter: {
    borderRadius: RADIUS,
    backgroundColor: '#fff',
    // iOS shadow
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    // Android shadow
    elevation: 4,
    // 살짝의 테두리로 카드 느낌 강화
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#e6e6e6'
  },
  // 카드 안쪽: 라운드에 맞춰 컨텐츠를 자르기
  cardInner: {
    borderRadius: RADIUS,
    overflow: 'hidden'
  },
  shot: {
    // 캔버스 높이 (필요 시 외부 style로 덮어쓰기 가능)
    height: 320
  },
  canvas: {
    flex: 1
    // 연한 배경무늬를 주고 싶다면 여기서도 조절 가능
    // backgroundColor는 SVG의 Rect로 칠하고 있으므로 투명 유지
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
  // 서버 이미지 표시 영역 스타일
  serverImageContainer: {
    marginTop: 16,
    paddingHorizontal: 4
  },
  serverImageTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8
  },
  serverImageCard: {
    borderRadius: RADIUS,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#e6e6e6',
    overflow: 'hidden'
  },
  serverImage: {
    width: '100%',
    height: 200,
    backgroundColor: '#f8f8f8'
  },
  input: {
    height: 100,
    margin: 12,
    borderWidth: 2,
    padding: 10,
    borderRadius: 10,
    borderColor: '#ccc'
  },

  // 펜 두꼐 컨테이너
  strokeWidthContainer: {
    marginTop: 12,
    marginBottom: 8,
    paddingHorizontal: 16,
    paddingVertical: 4,
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e6e6e6'
  },
  // 드로어 컨테이너
  drawerContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: -5 },
    elevation: 8
  },

  // 드래그 핸들 (화살표)
  dragHandle: {
    alignItems: 'center',
    paddingVertical: 12,
    backgroundColor: '#f8f8f8',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20
  },

  // 화살표 아이콘
  arrowIcon: {
    width: 40,
    height: 6,
    backgroundColor: '#ccc',
    borderRadius: 3,
    justifyContent: 'center',
    alignItems: 'center'
  },

  // 화살표 텍스트
  arrowText: {
    fontSize: 12,
    color: '#666',
    fontWeight: 'bold'
  },

  // 드로어 내용
  drawerContent: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: 20
  },

  // 펜 두께 라벨
  strokeWidthLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
    textAlign: 'center'
  },

  // 슬라이더
  slider: {
    width: '100%',
    height: 40
  }
})
