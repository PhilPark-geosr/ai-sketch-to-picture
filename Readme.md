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

`.env` 파일을 프로젝트 루트에 두고, `babel.config.js`의 `react-native-dotenv` 설정(`moduleName: '@env'`)으로 주입됩니다. 값을 바꾼 뒤에는 Metro 번들러를 재시작하세요.

```text
# 이미지 업로드·추천 API 베이스 (프로토콜 포함, 끝에 슬래시 없이)
SERVER_URL=http://192.168.0.10:8000

# 음성(STT) API 베이스 — 코드에서 `${STT_SERVER_URL}/voice-to-prompt` 로 호출
# 보통 메인 백엔드와 같아도 되고, 분리된 STT 서버면 별도 URL
STT_SERVER_URL=http://192.168.0.10:8000
```

- `SERVER_URL` 사용처: `MemoSketch` → `POST .../upload`, `ImageModal` → `POST .../recommend`
- `STT_SERVER_URL` 사용처: `AudioStorageService` → `POST .../voice-to-prompt`

### 백엔드 연동 요약 (코드 기준)

클라이언트가 기대하는 형태만 정리했습니다. 실제 서버 스펙이 다르면 `SketchUploader`, `ImageModal`, `AudioStorageService`를 맞춰야 합니다.

| 흐름 | 메서드·경로 | 요청 본문 | 비고 |
|------|-------------|-----------|------|
| 스케치 생성 업로드 | `POST {SERVER_URL}/upload` | `multipart/form-data`: 필드 `sketch`(PNG 파일), `prompt`(텍스트) | `SketchUploader.uploadPngBase64` — base64는 `data:image/png;base64,...` 형태로내며, 접두어가 있으면 제거 후 재조합 |
| 이미지 추천 | `POST {SERVER_URL}/recommend` | `multipart/form-data`: 필드 `image`(PNG), `prompt` | 갤러리/카메라 후 `ImageModal`에서 호출 |
| 음성 → 프롬프트 | `POST {STT_SERVER_URL}/voice-to-prompt` | `multipart/form-data`: 필드 `file`, 타입 `audio/m4a`, 파일명 `reording.m4a` | `AudioStorageService.saveRecording` — 응답은 JSON이며 `prompt_en`, `stt_text` 필드를 파싱함 (`AudioRecordModal`) |

### 음성 녹음·저장 (앱 구조)

- `App` 최상위에 `AudioStorageProvider`가 있어야 `useAudioStorage()`가 동작합니다.
- 기본 구현은 `AudioStorageService`이며, 테스트나 목 서버용으로 `AudioStorageProvider`에 `service` prop으로 `IAudioStorageService` 구현체를 넘길 수 있습니다.
- 마이크 권한·`expo-audio` 녹음은 `AudioRecordModal`에서 처리합니다. **저장** 시 STT 응답을 파싱한 뒤 모달만 닫으며, 현재 코드에서는 그 결과가 화면의 텍스트 입력 등에 자동으로 채워지지는 않습니다.

### 개발 시 참고

- `MemoSketch`는 props의 `uploadUrl` 대신 환경변수 `SERVER_URL`로 업로드 URL을 만듭니다 (`App.tsx`의 `uploadUrl={'set your ip'}`는 실제 요청에 쓰이지 않음).
- 이미지 base64에 `data:image/png;base64,` 접두어가 붙어 있어도 `SketchUploader`에서 제거 후 전송합니다.
