import * as ImagePicker from 'expo-image-picker'
import { ImagePickerResult, ImagePickerAsset } from 'expo-image-picker'
import { Platform } from 'react-native'
import { PickedAsset, PickImageOptions } from './types'
export class GalleryPickerManager {
  public static async pickImage(
    opts: PickImageOptions = {}
  ): Promise<PickedAsset | null> {
    const {
      includeBase64 = false,
      quality = 1,
      aspect,
      mediaTypes = 'images'
    } = opts
    const { canceled, assets }: ImagePickerResult =
      await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images', 'videos'],
        allowsEditing: false,
        quality: 1,
        allowsMultipleSelection: false,
        base64: includeBase64
      })

    console.warn('result', canceled, assets)

    if (canceled) return null

    const asset: ImagePickerAsset = assets?.[0]
    if (!asset) return null

    const mapped: PickedAsset = {
      uri: asset.uri,
      width: asset.width,
      height: asset.height,
      fileName: asset.fileName ?? null, // Android/iOS는 제공될 수 있음
      mimeType: asset.mimeType ?? null, // 웹/Android에서 종종 제공
      fileSize: asset.fileSize ?? null, // bytes
      base64: includeBase64 ? asset.base64 : undefined
    }

    // 웹에서 파일명을 최대한 추정 (blob: 스킴은 이름이 없으므로 undefined일 수 있음)
    if (Platform.OS === 'web' && !mapped.fileName) {
      try {
        const url = new URL(mapped.uri)
        mapped.fileName = url.pathname.split('/').pop() || null
      } catch {
        // blob: URI이면 URL 파싱 실패 가능 - 그대로 둡니다.
      }
    }

    return mapped
  }
}
