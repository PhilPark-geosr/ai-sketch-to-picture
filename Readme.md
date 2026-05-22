구조, 환경 변수, API 흐름은 [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md)를 참고하세요.

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

`.env` 파일을 프로젝트 루트에 만들고 아래 변수를 설정합니다. 값은 백엔드가 떠 있는 호스트(개발 시에는 PC의 LAN IP 등)로 맞춥니다.

```text
SERVER_URL=http://your-host:port
STT_SERVER_URL=http://your-host:port
```

- `SERVER_URL`: 스케치 업로드·추천 등 이미지 관련 API (`MemoSketch`, `ImageModal`).
- `STT_SERVER_URL`: 음성 녹음 업로드·STT (`AudioStorageService`, `/voice-to-prompt`).

변경 후 Metro 번들러를 재시작하세요.
