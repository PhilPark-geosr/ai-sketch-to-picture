import React, { useState, useCallback } from 'react'
import { View, Text, Pressable, StyleSheet } from 'react-native'
import { FilePickerManager } from '../managers/FilePickerManager'
import type { PickedAsset } from '../managers/types'
import SelectedImageCard from './SelectedImageCard'

/**
 * - "이미지 선택" 버튼을 눌러 갤러리에서 1장 선택
 * - 하단에 미리보기 카드 표시
 * - 웹/네이티브 공통 코드
 */
export default function ImagePickerView() {
  const [image, setImage] = useState<PickedAsset | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  const onPick = useCallback(async () => {
    setError(null)
    setBusy(true)
    try {
      const picked = await FilePickerManager.pickSingleImage({
        includeBase64: false, // 업로드가 필요하다면 true로 변경
        quality: 0.92
      })
      if (picked) setImage(picked)
    } catch (e: any) {
      setError(e?.message ?? String(e))
    } finally {
      setBusy(false)
    }
  }, [])

  return (
    <View style={styles.wrap}>
      <Pressable
        onPress={busy ? undefined : onPick}
        style={({ pressed }) => [
          styles.button,
          pressed && { opacity: 0.8 },
          busy && { opacity: 0.6 }
        ]}
        accessibilityRole="button"
        accessibilityLabel="Pick image from gallery">
        <Text style={styles.buttonText}>
          {busy ? '열고 있어요…' : '📷 갤러리에서 선택'}
        </Text>
      </Pressable>

      {error && <Text style={styles.error}>에러: {error}</Text>}

      {image ? (
        <SelectedImageCard image={image} />
      ) : (
        <View style={styles.placeholder}>
          <Text style={styles.placeholderText}>선택된 이미지가 없습니다</Text>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  wrap: { gap: 12 },
  button: {
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#111827',
    alignSelf: 'flex-start'
  },
  buttonText: { color: 'white', fontWeight: '600' },
  error: { color: '#dc2626' },
  placeholder: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 16,
    backgroundColor: '#fafafa'
  },
  placeholderText: { color: '#666' }
})
