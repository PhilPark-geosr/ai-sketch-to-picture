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

프로젝트 루트에 `.env` 파일을 만들고, `babel.config.js`의 `react-native-dotenv` 설정에 따라 `@env`로 주입됩니다.

| 변수 | 사용처 | 설명 |
|------|--------|------|
| `SERVER_URL` | `MemoSketch`, `ImageModal` | 스케치 업로드·추천 API의 베이스 URL (경로는 코드에서 붙임) |
| `STT_SERVER_URL` | `AudioStorageService` | 음성 파일 업로드(STT) 베이스 URL |

예시:

```text
SERVER_URL=http://192.168.0.10:3000
STT_SERVER_URL=http://192.168.0.10:4000
```

- 값은 **스킴 포함** 전체 오리진(예: `http://호스트:포트`)을 권장합니다. 경로는 아래 “백엔드 연동”을 참고하세요.
- `.env`는 `.gitignore`에 포함되어 저장소에 올라가지 않습니다.

### 앱 구조 (요약)

- 진입: `App.tsx` — `SafeAreaProvider` → `AudioStorageProvider` → `NavigationContainer` → 스택 (`MemoSketchView`, `Recommend`).
- 메인 화면: `MemoSketch` — 캔버스, 갤러리/카메라/녹음, 프롬프트 입력 후 서버로 PNG 업로드.
- `MemoSketch`에 넘기는 `uploadUrl` prop은 현재 업로드 로직에서 사용되지 않고, 실제 요청 URL은 `SERVER_URL` 기준으로 조합됩니다 (`MemoSketch.tsx` 참고).

### 백엔드 연동 (코드 기준)

`SERVER_URL`에 아래 경로가 이어집니다.

| 메서드 | URL 조합 | 용도 |
|--------|----------|------|
| POST | `${SERVER_URL}/upload` | 캔버스 캡처 PNG + `prompt` 필드 (`SketchUploader`, 필드명 `sketch`) |
| POST | `${SERVER_URL}/recommend` | 이미지 base64 + `prompt` (`ImageModal`, 필드명 `image`) |

`STT_SERVER_URL`에는 아래가 이어집니다.

| 메서드 | URL 조합 | 용도 |
|--------|----------|------|
| POST | `${STT_SERVER_URL}/voice-to-prompt` | 녹음 파일 multipart (`file`, 타입 `audio/m4a`) |

### 음성 녹음 · STT

- **UI**: `RecordButton` → `AudioRecordModal` (ref로 `open`/`close`). 녹음은 `expo-audio` (`RecordingPresets.HIGH_QUALITY`) 사용.
- **저장/업로드**: `useAudioStorage()` → `IAudioStorageService.saveRecording(uri)`. 기본 구현은 `AudioStorageService`가 위 STT 엔드포인트로 `FormData` 업로드.
- **Provider**: `useAudioStorage`는 반드시 `AudioStorageProvider` 하위에서만 사용 가능 (`App.tsx`에서 루트에 감싸져 있음). 테스트 시에는 `service` prop으로 목 구현을 주입할 수 있음.
- **저장 후 응답**: `AudioRecordModal`의 `onSaveHandler`는 응답 JSON에서 `prompt_en`, `stt_text`를 읽습니다. 백엔드는 이 필드를 맞추거나, 클라이언트에서 파싱 로직을 조정해야 합니다.
- **인터페이스 메모**: `deleteRecording`, `getRecordings`는 현재 스텁입니다.

### 카메라

- `CameraView`: 촬영 후 `expo-file-system/legacy`로 `base64`를 읽어 `PickedAsset`에 넣고 `ImageModal`로 이어집니다.

### 트러블슈팅

- **Expo 온라인 이슈**: `pnpm expo start --offline` 후 터미널 안내에 따라 `w`(웹) 등 사용.
- **마이크/STT**: OS 마이크 권한이 거부되면 `AudioRecordModal`에서 알림만 띄우고 진행됩니다. `STT_SERVER_URL`이 비어 있거나 잘못되면 `fetch`가 실패합니다.
- **실기기에서 로컬 서버**: `SERVER_URL` / `STT_SERVER_URL`에 PC의 LAN IP를 사용하고, 방화벽에서 해당 포트를 허용하세요.
