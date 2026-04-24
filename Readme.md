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

`.env` 파일을 프로젝트 루트에 두고, `babel.config.js`의 `react-native-dotenv` 설정(`moduleName: '@env'`)으로 주입됩니다.

| 변수 | 용도 | 사용처 |
|------|------|--------|
| `SERVER_URL` | 스케치 업로드·추천 API 베이스 URL | `MemoSketch` → `{SERVER_URL}/upload`, `ImageModal` → `{SERVER_URL}/recommend` |
| `STT_SERVER_URL` | 음성 녹음 업로드(STT) 베이스 URL | `AudioStorageService` → `{STT_SERVER_URL}/voice-to-prompt` |

예시:

```text
SERVER_URL=http://192.168.0.10:8000
STT_SERVER_URL=http://192.168.0.10:8000
```

`SERVER_URL`만 있고 `STT_SERVER_URL`이 없으면 녹음 저장 시 런타임 오류가 날 수 있습니다. 로컬에서 백엔드 하나로 쓰면 둘 다 동일한 호스트로 맞추면 됩니다.

**참고:** `App.tsx`의 `MemoSketch`에 넘기는 `uploadUrl` 문자열은 실제 업로드에 쓰이지 않고, 업로드 URL은 코드에서 `SERVER_URL`로 조합됩니다.

---

## 앱 구조 (요약)

- **스택 네비게이션** (`App.tsx`): `MemoSketchView` → 스케치 화면, `Recommend` → 추천 결과 화면.
- **전역 DI:** 루트가 `AudioStorageProvider`로 감싸져 있으며, `useAudioStorage()`는 이 Provider 안에서만 동작합니다.
- **음성:** `RecordButton` → `AudioRecordModal`(ref로 `open`). 녹음 완료 후 저장 시 `AudioStorageService.saveRecording`이 multipart로 STT 엔드포인트에 POST합니다. 응답 JSON에서 `prompt_en`, `stt_text`를 읽습니다 (`AudioRecordModal`).
- **이미지:** `CameraView`는 촬영 후 `expo-file-system`으로 `base64`를 채운 `PickedAsset`을 `ImageModal`로 넘깁니다.

---

## 백엔드와 맞출 때 (코드 기준)

클라이언트가 호출하는 경로는 다음과 같습니다.

- `POST {SERVER_URL}/upload` — 스케치 PNG(base64) 업로드 (`SketchUploader`, 필드명 `sketch`, 프롬프트 텍스트 포함).
- `POST {SERVER_URL}/recommend` — 이미지 base64 추천 요청 (`ImageModal`, 필드명 `image`).
- `POST {STT_SERVER_URL}/voice-to-prompt` — 음성 파일 `file` 필드, 타입 `audio/m4a` (`AudioStorageService`).

서버는 위 경로와 multipart/JSON 계약을 맞춰야 합니다.

---

## 개발 시 흔한 이슈

- **마이크/카메라:** `AudioRecordModal`·`CameraView`에서 권한 거부 시 Alert 후 동작이 제한됩니다.
- **Provider:** `useAudioStorage`를 `AudioStorageProvider` 밖에서 쓰면 명시적 에러가 납니다 (`AudioStorageContext`).
- **환경 변수 변경 후:** Metro/Expo를 재시작해야 `@env` 반영이 안정적입니다.
