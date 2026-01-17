import React, { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TouchableOpacity,
  Alert
} from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import ImageModal from './ImageModal'
import { RecommendResponse } from '../types/recommend'
import { PickedAsset } from '../managers/types'
export default function CameraView({ navigation }: { navigation: any }) {
  const [modalVisible, setModalVisible] = useState(false)
  const [image, setImage] = useState<PickedAsset | null>(null)
  function handleCloseModal(recommendResponse?: RecommendResponse): void {
    setModalVisible(false)
    navigation.navigate('Recommend', { recommendResponse })
  }

  const openCamera = async () => {
    // 카메라 권한 요청
    const { status } = await ImagePicker.requestCameraPermissionsAsync()

    if (status !== 'granted') {
      Alert.alert('권한 필요', '카메라 사용을 위해 권한이 필요합니다.')
      return
    }

    // 카메라 열기
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'], // 이미지만 촬영
      allowsEditing: false, // 촬영 후 편집 허용
      quality: 1 // 이미지 품질 (0~1)
    })

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const asset = result.assets[0]
      console.log('촬영된 이미지:', asset.uri)

      setImage({
        uri: asset.uri,
        width: asset.width,
        height: asset.height,
        fileName: asset.fileName,
        mimeType: asset.mimeType,
        fileSize: asset.fileSize
      })
      setModalVisible(true)
    }
  }

  return (
    <View style={styles.container}>
      {modalVisible && (
        <ImageModal
          modalVisible={modalVisible}
          onClosed={handleCloseModal}
          image={image}
        />
      )}
      <Pressable
        onPress={openCamera}
        style={styles.button}>
        <Text>CameraView</Text>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  button: {
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: 'orange',
    alignSelf: 'flex-start'
  }
})
