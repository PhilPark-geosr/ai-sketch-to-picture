import { useState } from 'react'
import {
  Alert,
  Modal,
  Pressable,
  View,
  StyleSheet,
  Text,
  Image
} from 'react-native'
import { PickedAsset } from '../managers/types'
import { SketchUploader } from '../managers/SketchUploader'

interface Props {
  modalVisible: boolean
  onClosed: () => void
  image: PickedAsset
}
export default function ImageModal({ modalVisible, onClosed, image }: Props) {
  async function onClickRecommend(): Promise<void> {
    console.warn('image', image)
    const uploadUrl = 'set your ip'
    const res = await SketchUploader.uploadPngBase64({
      uploadUrl,
      base64Png: image.base64,
      fileName: 'memo-sketch.png',
      fieldName: 'image'
    })

    console.log('✅ 서버 업로드 완료:', res.status)
    console.log('✅ 서버 업로드 결과:', res)
    const data = await res.json()
    console.log('✅ 서버 업로드 결과:', data)
    onClosed()
  }

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        Alert.alert('Modal has been closed.')
        onClosed()
      }}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Image
            source={{ uri: image.uri }} // base64 대신 uri 사용
            style={styles.serverImage}
            resizeMode="contain"
            onError={error => {
              console.error('네이티브 이미지 로드 에러:', error)
            }}
            onLoad={() => {
              console.log('네이티브 이미지 로드 성공')
            }}
          />
          <Pressable
            style={[styles.button, styles.buttonClose]}
            onPress={() => onClickRecommend()}>
            <Text style={styles.textStyle}>제품 추천 받기</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalView: {
    margin: 10,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    width: '90%',
    height: '80%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  buttonOpen: {
    backgroundColor: '#F194FF'
  },
  buttonClose: {
    backgroundColor: '#2196F3'
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center'
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center'
  },
  serverImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#f8f8f8',
    flex: 1
  }
})
