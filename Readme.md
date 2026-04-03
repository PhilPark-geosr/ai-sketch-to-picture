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

프로젝트 루트에 `.env`를 만들고 `babel.config.js`의 `react-native-dotenv` 설정(`moduleName: '@env'`)에 맞춰 값을 넣습니다.

```text
SERVER_URL=http://<백엔드-호스트>:<포트>
STT_SERVER_URL=http://<STT-또는-동일-백엔드-호스트>:<포트>
```

| 변수 | 코드에서 쓰는 곳 | 용도 |
|------|------------------|------|
| `SERVER_URL` | `MemoSketch.tsx`, `ImageModal.tsx` | 스케치 업로드·추천 API 베이스 URL |
| `STT_SERVER_URL` | `AudioStorageService.ts` | 음성 녹음 업로드(STT) 베이스 URL |

- 값은 **스킴 포함**(`http://` 또는 `https://`)을 권장합니다. Metro 재시작 후 반영됩니다.
- `MemoSketch`는 props의 `uploadUrl` 대신 **`SERVER_URL` + 경로**로 업로드합니다(`App.tsx`의 `uploadUrl`은 현재 사용되지 않음).

### 백엔드와 맞춰야 할 경로(앱 기준)

앱이 호출하는 URL은 다음과 같습니다.

- `POST ${SERVER_URL}/upload` — 캔버스 캡처 PNG 업로드(`SketchUploader`, 필드명 `sketch`, `prompt` 텍스트 포함)
- `POST ${SERVER_URL}/recommend` — 생성 이미지·프롬프트로 추천(`SketchUploader`, 필드명 `image`)
- `POST ${STT_SERVER_URL}/voice-to-prompt` — 녹음 파일 multipart 업로드(필드 `file`, 타입 `audio/m4a`)

스케치 업로드 응답은 JSON에 `image` 문자열을 포함한다고 가정합니다(`MemoSketch`에서 `setImage`에 사용).

음성 저장 시 응답은 JSON에 `prompt_en`, `stt_text`를 포함한다고 가정합니다(`AudioRecordModal`).

### 음성 녹음 플로우

- `App`이 `AudioStorageProvider`로 앱을 감쌉니다. `useAudioStorage`는 이 Provider **안에서만** 사용해야 합니다.
- `RecordButton` → `AudioRecordModal`: 마이크 권한(`expo-audio` / `AudioModule.requestRecordingPermissionsAsync`) 후 녹음, 완료 시 `AudioStorageService.saveRecording`으로 STT URL에 전송합니다.

### 문제 해결

- **마이크 동작 안 함**: 기기/브라우저에서 마이크 권한을 허용했는지 확인합니다. 거부 시 앱에서 알림을 띄웁니다.
- **`@env` 변수가 undefined**: `.env` 파일 위치(프로젝트 루트), 변수 이름 철자, Metro/Expo **재시작**을 확인합니다.
- **이미지 업로드 실패**: 서버가 `SketchUploader`와 동일한 multipart 필드명(`sketch` / `image`)과 `prompt` 필드를 받는지 확인합니다. base64 문자열에 `data:image/png;base64,` 접두사가 있어도 업로더에서 제거합니다.
