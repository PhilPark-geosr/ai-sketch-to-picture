import React, { useMemo, useRef, useState } from 'react';
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
} from 'react-native';
import Svg, { Path, Rect } from 'react-native-svg';
import ViewShot from 'react-native-view-shot';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library'; 
import type { Stroke, Point } from '../types/sketch';
import { SketchUploader } from '../managers/SketchUploader';

type Props = {
  uploadUrl: string;
  style?: ViewStyle;
  strokeColor?: string;
  strokeWidth?: number;
  backgroundColor?: string;
  onUploaded?: (res: Response) => void;
  onError?: (err: unknown) => void;
};

export const MemoSketch: React.FC<Props> = ({
  uploadUrl,
  style,
  strokeColor = '#111',
  strokeWidth = 4,
  backgroundColor = '#fff',
  onUploaded,
  onError,
}) => {
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const [current, setCurrent] = useState<Stroke | null>(null);
  const [count, setCount] = useState<number>(0);
  const viewShotRef = useRef<ViewShot>(null);
  

  // 컴포넌트 렌더링 추적
  console.log('🔄 MemoSketch 컴포넌트 렌더링');
  console.log('📊 현재 strokes 개수:', strokes.length);
  console.log('📊 현재 current stroke:', current ? '있음' : '없음');
  console.log('📊 현재 count:', count);

  const _safePointFromEvent = (e: GestureResponderEvent): Point | null => {
    const ne: any = e?.nativeEvent;
    if (!ne) return null;
    const t = (ne.touches && ne.touches[0]) || ne;
    let x: number | undefined = t.locationX;
    let y: number | undefined = t.locationY;
    if (typeof x !== 'number' || typeof y !== 'number') {
      if (typeof t.pageX === 'number' && typeof t.pageY === 'number') {
        x = t.pageX; y = t.pageY;
      }
    }
    if (typeof x !== 'number' || typeof y !== 'number') return null;
    return { x, y };
  };

  const pan: PanResponderInstance = useMemo(
    () => {
        console.log('🔧 PanResponder가 새로 생성되었습니다!');
        console.log('📊 strokeColor:', strokeColor);
        console.log('📊 strokeWidth:', strokeWidth);
        console.log('⏰ 생성 시간:', new Date().toLocaleTimeString());
        
        return PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: () => true,
    
            onPanResponderGrant: (e) => {
              const p = _safePointFromEvent(e);
              if (!p) return;
              const s: Stroke = {
                id: String(Date.now()),
                color: strokeColor,
                width: strokeWidth,
                points: [p],
              };
              setCurrent(s);
            },
    
            onPanResponderMove: (e: GestureResponderEvent, _gs: PanResponderGestureState) => {
              const p = _safePointFromEvent(e);
              setCurrent((prev) => {
                if (!prev || !p) return prev;
                const last = prev.points[prev.points.length - 1];
                const dx = p.x - last.x;
                const dy = p.y - last.y;
                if (dx * dx + dy * dy < 1.5 * 1.5) return prev;
                return { ...prev, points: [...prev.points, p] };
              });
            },
    
            onPanResponderRelease: () => {
              setCurrent((s) => {
                if (s) setStrokes((arr) => [...arr, s]);
                return null;
              });
            },
            onPanResponderTerminate: () => {
              setCurrent((s) => {
                if (s) setStrokes((arr) => [...arr, s]);
                return null;
              });
            },
          });
    }, [strokeColor, strokeWidth]
  );

  const _toPath = (pts: Point[]) => {
    if (pts.length === 0) return '';
    const [start, ...rest] = pts;
    const move = `M ${start.x} ${start.y}`;
    const lines = rest.map((p) => `L ${p.x} ${p.y}`).join(' ');
    return `${move} ${lines}`;
  };

  const handleClear = () => {
    setStrokes([]);
    setCurrent(null);
  };

  const handleIncrementCount = () => {
    console.log('🔢 Count 증가 버튼 클릭');
    console.log('📊 증가 전 count:', count);
    setCount(count + 1);
    console.log('📊 증가 후 count:', count + 1);
  };

  const handleSave = async () => {
    try {
      if (!viewShotRef.current) {
        throw new Error('ViewShot ref is not available');
      }
      
      if (!('capture' in viewShotRef.current)) {
        throw new Error('ViewShot capture method is not available');
      }
      
      console.log('📸 스크린샷 캡처 시작...');
      
      // 파일 경로로 캡처 후 base64로 변환
      const fileUri = await viewShotRef.current.capture?.();
      console.log('📸 캡처된 파일 URI:', fileUri);
      
      if (!fileUri) {
        throw new Error('Capture failed - no file URI returned');
      }
      
      // 파일을 base64로 변환
      console.log('🔄 파일을 base64로 변환 중...');
      const base64 = await FileSystem.readAsStringAsync(fileUri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      console.log('📸 변환된 base64 길이:', base64?.length || 0);
      console.log('📸 base64 시작 부분:', base64?.substring(0, 50) || '없음');
      
      if (!base64) {
        throw new Error('Capture failed - no base64 data returned');
      }

      console.log('🚀 서버 업로드 시작...');
      const res = await SketchUploader.uploadPngBase64({
        uploadUrl,
        base64Png: base64,
        fileName: 'memo-sketch.png',
      });
      console.log('✅ 서버 업로드 완료:', res.status);
      onUploaded?.(res);
    } catch (err) {
      console.error('❌ Save 에러:', err);
      onError?.(err);
    }
  };

  const handleSaveToGallery = async () => {
    try {
      if (!viewShotRef.current) {
        throw new Error('ViewShot ref is not available');
      }
      
      if (!('capture' in viewShotRef.current)) {
        throw new Error('ViewShot capture method is not available');
      }
      
      console.log('📸 갤러리 저장용 스크린샷 캡처 시작...');
      
      // 파일 경로로 캡처
      const fileUri = await viewShotRef.current.capture?.();
      console.log('📸 캡처된 파일 URI:', fileUri);
      
      if (!fileUri) {
        throw new Error('Capture failed - no file URI returned');
      }

      // 권한 요청
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('권한 필요', '갤러리에 저장하려면 권한이 필요합니다.');
        return;
      }

      // 갤러리에 저장
      const asset = await MediaLibrary.createAssetAsync(fileUri);
      await MediaLibrary.createAlbumAsync('MemoSketch', asset, false);
      
      Alert.alert('성공', '스케치가 갤러리에 저장되었습니다!');
      console.log('✅ 갤러리 저장 완료:', asset);
      
      
    } catch (err) {
      console.error('❌ 갤러리 저장 에러:', err);
      Alert.alert('오류', '갤러리 저장 중 오류가 발생했습니다.');
    }
  };

  return (
    <View style={[styles.container, style]}>
      {/* 카드형 래퍼 (그림자/라운드) */}
      <View style={styles.cardOuter}>
        {/* 내부는 라운드에 맞춰 컨텐츠를 자르기 위해 overflow: hidden */}
        <View style={styles.cardInner}>
          <ViewShot ref={viewShotRef} style={styles.shot} collapsable={false}>
            <View style={styles.canvas} {...pan.panHandlers}>
              <Svg style={StyleSheet.absoluteFill}>
                {/* 배경 */}
                <Rect x={0} y={0} width="100%" height="100%" fill={backgroundColor} />

                {/* 완료된 스트로크 */}
                {strokes.map((s) => (
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
        <ToolButton label="Clear" onPress={handleClear} />
        <ToolButton label="Send" onPress={handleSave} />
        <ToolButton label="Gallery" onPress={handleSaveToGallery} />
        <ToolButton label={`Count: ${count}`} onPress={handleIncrementCount} />
      </View>
    </View>
  );
};

const ToolButton = ({ label, onPress }: { label: string; onPress: () => void }) => (
  <Pressable onPress={onPress} style={styles.btn}>
    <Text style={styles.btnText}>{label}</Text>
  </Pressable>
);

const RADIUS = 16;

const styles = StyleSheet.create({
  container: {
    width: '100%',
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
    borderColor: '#e6e6e6',
  },
  // 카드 안쪽: 라운드에 맞춰 컨텐츠를 자르기
  cardInner: {
    borderRadius: RADIUS,
    overflow: 'hidden',
  },
  shot: {
    // 캔버스 높이 (필요 시 외부 style로 덮어쓰기 가능)
    height: 320,
  },
  canvas: {
    flex: 1,
    // 연한 배경무늬를 주고 싶다면 여기서도 조절 가능
    // backgroundColor는 SVG의 Rect로 칠하고 있으므로 투명 유지
  },
  toolbar: {
    marginTop: 12,
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 4,
    justifyContent: 'flex-end',
  },
  btn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: '#111',
  },
  btnText: { color: '#fff', fontWeight: '600' },
});
