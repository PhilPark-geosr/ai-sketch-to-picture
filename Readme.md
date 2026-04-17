## 개요

Expo 기반 React Native 앱입니다. 스케치 캡처·업로드, 갤러리/카메라 이미지 추천, 음성 녹음 후 STT 서버 업로드 흐름이 포함되어 있습니다.

## 실행

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

## 환경 변수 (`.env`)

프로젝트 루트에 `.env`를 두고, `babel.config.js`의 `react-native-dotenv` 설정(`moduleName: '@env'`)으로 빌드 시 주입됩니다. **변경 후에는 Metro 번들러를 재시작**해야 반영됩니다.

| 변수 | 용도 |
|------|------|
| `SERVER_URL` | 이미지 업로드·추천 API 베이스 (`MemoSketch`, `ImageModal`의 `fetch` 대상) |
| `STT_SERVER_URL` | 음성 파일 업로드(STT) API 베이스 (`AudioStorageService`) |

예시 (로컬 백엔드 IP/포트에 맞게 수정):

```text
SERVER_URL=http://192.168.0.10:8000
STT_SERVER_URL=http://192.168.0.10:8000
```

같은 호스트에서 이미지·음성 API를 모두 제공하면 두 값을 동일하게 둘 수 있습니다.

## 백엔드와 맞춰야 하는 HTTP 경로

클라이언트가 붙는 경로는 아래와 같습니다. 서버 구현 시 이 URL과 메서드·본문 형식을 맞추면 됩니다.

| 용도 | 메서드·경로 | 호출 위치 | 요청 본문 요약 |
|------|-------------|-----------|----------------|
| 스케치 PNG 업로드 | `POST ${SERVER_URL}/upload` | `MemoSketch` → `SketchUploader.uploadPngBase64` | `multipart/form-data`: 필드 `sketch`(PNG), `prompt`(텍스트) |
| 이미지 추천 | `POST ${SERVER_URL}/recommend` | `ImageModal` → 동일 업로더 | `multipart/form-data`: 필드 `image`(PNG), `prompt`(텍스트) |
| 음성 → 프롬프트(STT) | `POST ${STT_SERVER_URL}/voice-to-prompt` | `AudioStorageService.saveRecording` | `multipart/form-data`: 필드 `file`(타입 `audio/m4a`, 파일명 `reording.m4a`) |

**스케치 업로드 응답:** `MemoSketch.handleSend`는 JSON을 `await res.json()`으로 파싱하고, **`image` 키의 문자열**을 이후 모달에 쓰는 이미지 소스로 사용합니다.

**추천 응답:** `ImageModal`은 응답 JSON을 파싱해 `onClosed(data)`로 넘기고, `RecommendView`는 `src/types/recommend.ts`의 `RecommendResponse` 형태를 화면에 표시합니다.

**STT 응답:** `AudioRecordModal`의 저장 동작은 JSON에서 `prompt_en`, `stt_text`를 읽습니다(현재는 로그용). 서버가 이 필드를 주지 않으면 파싱 단계에서 오류가 날 수 있습니다.

## 앱 구조 (요약)

- **내비게이션:** `App.tsx` — `MemoSketchView`(스케치 화면), `Recommend`(추천 결과). 갤러리/카메라 모달에서 추천이 끝나면 `navigation.navigate('Recommend', { recommendResponse })`로 이동합니다.
- **이미지 업로드:** `SketchUploader`가 PNG base64를 받아 `data:image/png;base64,` 접두사가 있으면 제거한 뒤 `FormData`로 전송합니다.
- **음성:** `App` 최상위를 `AudioStorageProvider`로 감싸고, `RecordButton` → `AudioRecordModal`에서 녹음 후 `useAudioStorage().saveRecording(uri)`로 STT 엔드포인트를 호출합니다. 테스트나 목 객체 주입 시 `AudioStorageProvider`에 `service` prop으로 `IAudioStorageService` 구현체를 넘길 수 있습니다.

## 문제 해결

- **`.env`가 반영되지 않음:** Metro/Expo 개발 서버를 완전히 끄고 다시 `pnpm expo start` (필요 시 `--clear`).
- **웹/디바이스에서 API에 연결 안 됨:** `SERVER_URL` / `STT_SERVER_URL`이 실행 중인 기기(에뮬레이터·실제 기기)에서 접근 가능한 호스트인지 확인합니다. Android 에뮬레이터는 보통 `10.0.2.2`가 호스트 PC를 가리킵니다.
- **마이크/카메라:** `AudioRecordModal`은 `expo-audio`로 녹음 권한을 요청하고, `CameraView`는 `expo-image-picker`로 카메라 권한을 요청합니다. 권한 거부 시 OS 설정에서 허용이 필요합니다.
