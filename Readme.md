## 프로젝트 개요

Expo(React Native) 기반 메모·스케치 화면에서 그림을 캡처해 서버로 보내고, 카메라·갤러리 이미지로 추천을 받거나, 음성 녹음을 STT 서버로 올려 텍스트·프롬프트를 받는 흐름을 포함합니다.

## 실행방법

**web**

- 온라인 모드가 잘 안될경우

```bash
pnpm expo start --offline
```

- w 클릭

```bash
 Using Expo Go
› Press s │ switch to development build

› Press a │ open Android
› Press w │ open web
```

## 아키텍처 요약

| 영역 | 주요 코드 | 역할 |
|------|-----------|------|
| 네비게이션 | `src/App.tsx` | `AudioStorageProvider`로 앱 전체 감싼 뒤 `MemoSketchView` → `Recommend` 스택 |
| 스케치·업로드 | `src/components/MemoSketch.tsx`, `src/managers/SketchUploader.ts` | 캔버스 캡처 → base64 → `POST {SERVER_URL}/upload` → 응답의 이미지로 `ImageModal` |
| 추천(이미지+프롬프트) | `src/components/ImageModal.tsx` | `POST {SERVER_URL}/recommend`로 PNG(base64)·텍스트 프롬프트 전송 후 `Recommend` 화면으로 이동 |
| 카메라 | `src/components/CameraView.tsx` | 촬영 후 파일을 base64로 읽어 `PickedAsset`에 넣고 `ImageModal`로 동일 추천 플로우 |
| 음성 | `src/components/RecordButton.tsx`, `src/components/AudioRecordModal.tsx` | `expo-audio`로 녹음 → 완료 후 `AudioStorageService.saveRecording`으로 STT 서버 호출 |

`MemoSketch`의 `uploadUrl` prop은 현재 `App.tsx`에서 `'set your ip'` 문자열로 넘기고 있으며, 실제 업로드 URL은 컴포넌트 내부에서 `SERVER_URL` 환경변수로 조합합니다.

### 환경변수 설정

프로젝트 루트에 `.env` 파일을 만들고, `babel.config.js`의 `react-native-dotenv` 설정(`moduleName: '@env'`, `path: '.env'`)에 맞게 값을 넣습니다.

```text
SERVER_URL=http://{호스트IP}:{포트}
STT_SERVER_URL=http://{STT호스트IP}:{포트}
```

- **`SERVER_URL`**: 스케치 업로드(`MemoSketch` → `{SERVER_URL}/upload`), 추천 요청(`ImageModal` → `{SERVER_URL}/recommend`)에 사용됩니다.
- **`STT_SERVER_URL`**: 음성 파일 업로드(`AudioStorageService` → `{STT_SERVER_URL}/voice-to-prompt`)에 사용됩니다. 스케치 서버와 분리할 수 있습니다.

값이 비어 있으면 런타임에서 요청 URL이 깨질 수 있으므로, 실기기·에뮬레이터에서 접근 가능한 호스트(예: 개발 PC의 LAN IP)를 사용합니다.

### 음성(STT) API 기대 형식

`AudioStorageService`는 녹음 파일을 `multipart/form-data`로 보냅니다.

- **메서드·경로**: `POST /voice-to-prompt`
- **파일 필드**: `file`, 타입 `audio/m4a`, 파일명은 구현상 `reording.m4a`로 고정되어 있습니다.

`AudioRecordModal`의 저장 처리에서는 응답 본문을 JSON으로 파싱해 `prompt_en`, `stt_text` 필드를 읽습니다. 서버는 이 필드를 포함한 JSON을 반환하는 것이 클라이언트 코드와 맞습니다.

### 스케치 업로드 응답

`MemoSketch.handleSend`는 업로드 응답 JSON에서 `image` 문자열 필드를 기대합니다. 이 값으로 `PickedAsset`을 채운 뒤 `ImageModal`을 엽니다.

### 권한·플랫폼

- **마이크**: `AudioRecordModal` 마운트 시 `AudioModule.requestRecordingPermissionsAsync()` 및 무음 모드에서 재생/녹음 모드 설정.
- **카메라**: `CameraView`에서 `ImagePicker.requestCameraPermissionsAsync()`.
- **갤러리 저장**: `MemoSketch.handleSaveToGallery`에서 `MediaLibrary` 권한.

## 트러블슈팅

- **`useAudioStorage는 AudioStorageProvider 안에서…` 오류**: `App.tsx`처럼 `AudioStorageProvider`로 해당 트리를 감싸야 합니다. 테스트 시 커스텀 구현을 넣으려면 `<AudioStorageProvider service={mock}>` 형태로 주입할 수 있습니다.
- **Expo 번들러/Metro가 환경변수를 안 읽는 경우**: `.env` 변경 후 개발 서버를 재시작합니다.
- **STT만 동작하지 않는 경우**: `.env`에 `STT_SERVER_URL`이 있는지, CORS·방화벽·실기기에서 해당 호스트에 도달 가능한지 확인합니다.
