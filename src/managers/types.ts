export type PickedAsset = {
    uri: string;          // file://, content://, blob:..., data:...
    width?: number;
    height?: number;
    fileName?: string | null;
    mimeType?: string | null;
    fileSize?: number | null; // bytes
    base64?: string;      // 옵션 사용 시
};

export type PickImageOptions = {
    allowMultiple?: boolean;  // (웹/Android는 일부 제한) - 여기선 단일 선택 예시
    includeBase64?: boolean;  // 이미지 미리보기만이면 false 권장
    quality?: number;         // 0~1
    aspect?: [number, number]; // 자르기 옵션 사용 시
    mediaTypes?: "images" | "all"; // 기본 images
};