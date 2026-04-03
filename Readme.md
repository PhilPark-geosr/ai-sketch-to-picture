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

### 환경변수 설정

프로젝트 루트에 `.env` 파일을 만들고, `babel.config.js`의 `react-native-dotenv` 설정(`moduleName: '@env'`)에 따라 아래 변수를 넣습니다.

| 변수 | 용도 |
|------|------|
| `SERVER_URL` | 스케치 업로드·추천 API 베이스 URL (예: `http://192.168.0.10:8000`) |
| `STT_SERVER_URL` | 음성 녹음 업로드(STT) 베이스 URL. 미설정 시 `AudioStorageService.saveRecording`의 `fetch`가 잘못된 URL로 호출됩니다. |

예시:

```text
SERVER_URL=http://YOUR_HOST:PORT
STT_SERVER_URL=http://YOUR_STT_HOST:PORT
```

## 백엔드 연동 개요

클라이언트가 기대하는 엔드포인트는 코드 기준으로 다음과 같습니다. 실제 서버 스펙과 다르면 `SketchUploader`, `ImageModal`, `AudioStorageService`를 함께 맞춰야 합니다.

### 스케치 생성 업로드

- **호출**: `MemoSketch` → `SketchUploader.uploadPngBase64` → `POST ${SERVER_URL}/upload`
- **본문**: `multipart/form-data`
  - 필드 `sketch`: PNG (React Native `FormData` 파일 파트)
  - 필드 `prompt`: 텍스트 (캔버스 아래 입력란 내용)
- **응답(JSON)**: `{ "image": string }` — `image`는 결과 이미지를 나타내는 문자열로 쓰입니다.

### 추천(Recommend)

- **호출**: `ImageModal` → `SketchUploader.uploadPngBase64` → `POST ${SERVER_URL}/recommend`
- **본문**: `multipart/form-data`
  - 필드 `image`: PNG
  - 필드 `prompt`: 모달 내 입력 텍스트
- **응답**: `onClosed`로 네비게이션에 넘기는 JSON (타입은 `RecommendResponse` 쪽과 맞춤 필요)

### 음성 → 프롬프트(STT)

- **호출**: `AudioRecordModal` 저장 시 → `AudioStorageService.saveRecording` → `POST ${STT_SERVER_URL}/voice-to-prompt`
- **본문**: `multipart/form-data`, 파일 파트 `file` — `type: audio/m4a`, 로컬 녹음 URI
- **응답(JSON)**: `prompt_en`, `stt_text` 필드를 `result.json()`으로 읽습니다. 현재는 콘솔 로그 위주이며 UI/상태와 연결하려면 추가 작업이 필요합니다.

## 음성 녹음 흐름

1. `App.tsx`에서 `AudioStorageProvider`로 앱을 감쌉니다. `useAudioStorage`는 이 Provider 안에서만 사용할 수 있습니다.
2. `MemoSketch`에 `RecordButton`이 있고, 탭 시 `AudioRecordModal`이 열립니다.
3. `expo-audio`로 녹음·일시정지·재개·완료 후 로컬 URI가 잡히면, 확인 화면에서 재생 가능하고 **저장** 시 위 STT 엔드포인트로 업로드합니다.
4. 마이크 권한은 모달 마운트 시 `AudioModule.requestRecordingPermissionsAsync()`로 요청합니다. 거부 시 알림만 뜨고 녹음은 계속 시도될 수 있으니, 기기 설정에서 권한을 확인하세요.

## 개발 시 흔한 이슈

- **`SERVER_URL` / `STT_SERVER_URL`**: 실제 기기·에뮬레이터에서 접근 가능한 호스트(IP/포트)를 써야 합니다. `localhost`는 기기에서 개발 머신을 가리키지 않는 경우가 많습니다.
- **`MemoSketch`의 `uploadUrl` prop**: 현재 업로드 URL은 `SERVER_URL` 기준으로 조합되며, `App.tsx`의 `uploadUrl={'set your ip'}`는 사용되지 않습니다. 혼동을 줄이려면 prop을 제거하거나 실제로 쓰도록 리팩터할 여지가 있습니다.
- **타입 선언**: `@env` 모듈용 `env.d.ts`가 없으면 IDE/TS에서 환경 변수 import에 경고가 날 수 있습니다. 필요 시 `declare module '@env' { ... }`로 보강하세요.
