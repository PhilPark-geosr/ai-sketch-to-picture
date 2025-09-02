import * as ImagePicker from "expo-image-picker";
import { Platform } from "react-native";
import type { PickedAsset, PickImageOptions } from "./types";

export class FilePickerManager {
    /**
     * 갤러리에서 이미지를 1장 선택합니다(웹 호환).
     * - 웹: <input type="file">로 폴백되어 uri가 blob: 스킴일 수 있습니다.
     * - iOS/Android: 권한 자동 처리(최신 Expo SDK). 필요 시 권한 체크 로직 추가 가능.
     */
    static async pickSingleImage(
        opts: PickImageOptions = {}
    ): Promise<PickedAsset | null> {
        const {
            includeBase64 = false,
            quality = 1,
            aspect,
            mediaTypes = "images",
        } = opts;

        const pickerResult = await ImagePicker.launchImageLibraryAsync({
            mediaTypes:
                mediaTypes === "all"
                    ? ImagePicker.MediaTypeOptions.All
                    : ImagePicker.MediaTypeOptions.Images,
            allowsEditing: false, // 필요 시 true
            aspect,               // allowsEditing이 true일 때만 의미 있음
            quality,
            base64: includeBase64,
            allowsMultipleSelection: false, // 단일 선택 구성
            exif: false,
            selectionLimit: 1,
        });

        console.warn("pickerResult: ", pickerResult);

        if (pickerResult.canceled) return null;

        const asset = pickerResult.assets?.[0];
        if (!asset) return null;

        // Expo ImagePicker의 웹/네이티브 결과를 공통 타입으로 매핑
        const mapped: PickedAsset = {
            uri: asset.uri,
            width: asset.width,
            height: asset.height,
            fileName: (asset as any).fileName ?? null, // Android/iOS는 제공될 수 있음
            mimeType: (asset as any).mimeType ?? null, // 웹/Android에서 종종 제공
            fileSize: (asset as any).fileSize ?? null, // bytes
            base64: includeBase64 ? asset.base64 : undefined,
        };

        // 웹에서 파일명을 최대한 추정 (blob: 스킴은 이름이 없으므로 undefined일 수 있음)
        if (Platform.OS === "web" && !mapped.fileName) {
            try {
                const url = new URL(mapped.uri);
                mapped.fileName = url.pathname.split("/").pop() || null;
            } catch {
                // blob: URI이면 URL 파싱 실패 가능 - 그대로 둡니다.
            }
        }

        return mapped;
    }
}