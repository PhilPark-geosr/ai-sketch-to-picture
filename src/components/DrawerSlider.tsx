import Slider from '@react-native-community/slider'
import { useState } from 'react'
import { View, Text, StyleSheet, Pressable } from 'react-native'
interface Props {
  min: number
  max: number
  value: number
  onChangeValue: (value: number) => void
  step: number
}

export default function DrawerSlider({
  min,
  max,
  value,
  onChangeValue,
  step
}: Props) {
  // 드로어 열림/닫힘 상태
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  function onChangeValueCallback(value: number) {
    onChangeValue(value)
  }
  return (
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
          <Text style={styles.strokeWidthLabel}>펜 두께: {value}px</Text>
          <Slider
            style={styles.slider}
            minimumValue={1}
            maximumValue={20}
            value={value}
            onValueChange={(value: number) => onChangeValueCallback(value)}
            step={1}
            minimumTrackTintColor="#111"
            maximumTrackTintColor="#e6e6e6"
          />
        </View>
      )}
    </View>
  )
}
const styles = StyleSheet.create({
  // 드로어 컨테이너
  drawerContainer: {
    paddingBottom: 20,
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
