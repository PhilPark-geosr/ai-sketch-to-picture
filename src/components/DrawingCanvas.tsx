import {
  useMemo,
  useRef,
  useState,
  forwardRef,
  useImperativeHandle
} from 'react'
import {
  View,
  StyleSheet,
  GestureResponderEvent,
  PanResponder,
  PanResponderGestureState,
  PanResponderInstance
} from 'react-native'
import Svg, { Path, Rect } from 'react-native-svg'
import ViewShot from 'react-native-view-shot'
import { Point, Stroke } from '../types/sketch'

interface Props {
  strokeColor: string
  strokeWidth: number
  backgroundColor: string
}

export interface DrawingCanvasRef {
  capture: () => Promise<string | undefined>
  clear: () => void
}

const DrawingCanvas = forwardRef<DrawingCanvasRef, Props>(
  ({ strokeColor, strokeWidth, backgroundColor }, ref) => {
    const viewShotRef = useRef<ViewShot>(null)

    useImperativeHandle(ref, () => ({
      capture: async () => {
        if (!viewShotRef.current) {
          throw new Error('ViewShot ref is not available')
        }
        if (!('capture' in viewShotRef.current)) {
          throw new Error('ViewShot capture method is not available')
        }
        return await viewShotRef.current.capture?.()
      },
      clear: () => {
        setStrokes([])
        setCurrent(null)
      }
    }))
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
      return PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,

        onPanResponderGrant: e => {
          const p = _safePointFromEvent(e)
          if (!p) return
          const s: Stroke = {
            id: String(Date.now()),
            color: strokeColor,
            width: strokeWidth,
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
    }, [strokeColor, strokeWidth])

    const _toPath = (pts: Point[]) => {
      if (pts.length === 0) return ''
      const [start, ...rest] = pts
      const move = `M ${start.x} ${start.y}`
      const lines = rest.map(p => `L ${p.x} ${p.y}`).join(' ')
      return `${move} ${lines}`
    }
    const [strokes, setStrokes] = useState<Stroke[]>([])
    const [current, setCurrent] = useState<Stroke | null>(null)
    return (
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
    )
  }
)

DrawingCanvas.displayName = 'DrawingCanvas'

export default DrawingCanvas

const RADIUS = 16
const styles = StyleSheet.create({
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
  }
})
