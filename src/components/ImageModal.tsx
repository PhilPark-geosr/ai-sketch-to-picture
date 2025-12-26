import { useState } from 'react'
import {
  Alert,
  Modal,
  Pressable,
  View,
  StyleSheet,
  Text,
  Image,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native'
import { PickedAsset } from '../managers/types'
import { SketchUploader } from '../managers/SketchUploader'
import React from 'react'
import { RecommendResponse } from '../types/recommend'
import { SERVER_URL } from '@env'

interface Props {
  modalVisible: boolean
  onClosed: (data?: RecommendResponse) => void
  image: PickedAsset
}
export default function ImageModal({ modalVisible, onClosed, image }: Props) {
  // console.log('image', image.base64)
  const [text, onChangeText] = useState('')

  async function onClickRecommend(): Promise<void> {
    console.log('onClickRecommend 함수 시작')
    // console.log('image', JSON.stringify(image))

    const uploadUrl = `${SERVER_URL}/recommend`
    // console.log('uploadUrl', uploadUrl)

    try {
      const res = await SketchUploader.uploadPngBase64({
        uploadUrl,
        base64Png: image.base64,
        fileName: 'memo-sketch.png',
        fieldName: 'image',
        prompt: text
      })
      console.log('✅ 서버 업로드 완료:', res.status)
      console.log('✅ 서버 업로드 결과:', res)
      const data = await res.json()
      console.log('✅ 서버 업로드 결과:', data)
      onClosed(data)
    } catch (error) {
      console.error('서버 업로드 에러:', error)
      onClosed()
    }
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
      <KeyboardAvoidingView
        style={styles.centeredView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}>
        <ScrollView
          style={styles.modalView}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled">
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

          <Pressable
            style={[styles.button, styles.buttonClose]}
            onPress={() => onClickRecommend()}>
            <Text style={styles.textStyle}>제품 추천 받기</Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
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

    width: '90%',
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },

  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    padding: 20
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
  },
  input: {
    height: 100,
    margin: 12,
    borderWidth: 2,
    padding: 10,
    borderRadius: 10,
    borderColor: '#ccc'
  }
})
