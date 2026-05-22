# Development guide

This document describes how the Expo (React Native) app is structured, which environment variables matter, and how the main client–server flows work. It is derived from the current source under `src/`.

## Stack and entry

- **Runtime:** Expo SDK 54, React 19, React Native 0.81 (`package.json`).
- **Entry:** `index.js` → `App.tsx`.
- **Env:** `react-native-dotenv` exposes variables from `.env` as the `@env` module (`babel.config.js`). Restart Metro after changing `.env`.

## App shell

`App.tsx` wraps the tree in this order:

1. `SafeAreaProvider`
2. `AudioStorageProvider` — supplies `IAudioStorageService` (default: `AudioStorageService`)
3. `NavigationContainer` with a native stack

**Screens**

| Route            | Component              | Role |
|-----------------|------------------------|------|
| `MemoSketchView`| `MemoSketch`           | Drawing, camera, voice, gallery, upload |
| `Recommend`     | `RecommendViewWrapper` | Shows recommendation payload from navigation params |

Initial route is `MemoSketchView`. `MemoSketch` receives `navigation` and uses it to push `Recommend` with optional `recommendResponse` after flows that call `ImageModal`’s recommend action or `CameraView`’s close handler.

## Environment variables

Create a `.env` file in the project root (same level as `babel.config.js`).

| Variable           | Used in | Purpose |
|--------------------|---------|---------|
| `SERVER_URL`       | `MemoSketch.tsx`, `ImageModal.tsx` | Base URL for sketch upload, recommend, and related HTTP calls (no trailing slash assumed in code; paths are appended explicitly). |
| `STT_SERVER_URL`   | `AudioStorageService.ts` | Base URL for voice → prompt STT endpoint. |

Example:

```text
SERVER_URL=http://192.168.1.10:8000
STT_SERVER_URL=http://192.168.1.10:8000
```

Use reachable hostnames or IPs for device testing (localhost on the phone is the device itself, not your laptop).

**Note:** `MemoSketch` still declares an `uploadUrl` prop and `MemoSketchWrapper` passes `'set your ip'`, but sketch upload in `handleSend` is implemented with `` `${SERVER_URL}/upload` `` from `@env`, not that prop. Treat `SERVER_URL` as the source of truth unless the prop is wired in later.

## Sketch upload (`SketchUploader` + `MemoSketch`)

**Intent:** Capture the drawing surface as a PNG file, read it as base64, and POST multipart form data to the backend.

**Flow**

1. `DrawingCanvasRef.capture()` returns a file URI.
2. `expo-file-system/legacy` reads the file as base64.
3. `SketchUploader.uploadPngBase64` builds `FormData` with:
   - A file part: field name from options (e.g. `sketch` for send, `image` for recommend), `type: image/png`, and a `data:image/png;base64,...` style URI for React Native.
   - A `prompt` field (text from the sketch screen or modal).

**Endpoints used from `@env`**

- Send sketch: `POST ${SERVER_URL}/upload` — `fieldName: 'sketch'`, prompt from the memo text input.
- Recommend from modal: `POST ${SERVER_URL}/recommend` — `fieldName: 'image'` (`ImageModal.tsx`).

**Response shape (send):** Client expects JSON with at least `{ image: string }` where `image` is used as the result asset (including as `base64` on the in-memory `PickedAsset`). Align server contracts with `MemoSketch.tsx` and `ImageModal.tsx` when changing APIs.

## Voice recording and STT (`AudioRecordModal`, `RecordButton`, `AudioStorageService`)

**Intent:** Record audio with `expo-audio`, optionally pause/resume, preview playback, then upload the file to an STT service that returns structured text for downstream use.

**UI wiring**

- `RecordButton` holds a ref to `AudioRecordModal` and calls `open()` on press.
- `AudioRecordModal` uses `useAudioRecorder` / `useAudioPlayer`, requests mic permission on mount, and sets `setAudioModeAsync({ playsInSilentMode: true, allowsRecording: true })`.

**Upload**

- `AudioStorageService.saveRecording(uri)` builds `FormData` with one part:
  - `file`: `{ uri, type: 'audio/m4a', name: 'reording.m4a' }` (name matches current source; fix on server or client if strict parsing is required).
- `POST ${STT_SERVER_URL}/voice-to-prompt`

**Response contract:** `onSaveHandler` parses JSON and reads `prompt_en` and `stt_text`. The server must return JSON containing those keys (or the client should be updated to match the real schema).

**Context:** Any component under `AudioStorageProvider` can call `useAudioStorage()`. Tests or storybook can inject a mock via `<AudioStorageProvider service={mock}>`.

## Camera capture (`CameraView`)

**Intent:** Take a photo with `expo-image-picker`, load the file as base64 via `expo-file-system/legacy`, attach it to a `PickedAsset`, and open `ImageModal` for the same recommend/upload path as gallery images.

**Constraints:** Camera permission must be granted; otherwise an alert is shown and capture is skipped.

## Operational notes and pitfalls

- **Metro / offline:** The root `Readme.md` documents `pnpm expo start --offline` when online mode misbehaves.
- **Missing env:** If `STT_SERVER_URL` or `SERVER_URL` is undefined, fetches will target invalid URLs. Ensure `.env` exists and matches `babel` plugin config.
- **Save without recording file:** The save path uses the recording `uri` set after stop; if that state were missing, upload would misbehave — exercise the full record → complete → save sequence when testing STT.
- **Web vs native:** Permissions and file APIs differ by platform; voice and camera flows are primarily exercised on device or simulators.

## Related files (quick map)

| Area | Primary paths |
|------|-----------------|
| Navigation / providers | `src/App.tsx` |
| Sketch + toolbar | `src/components/MemoSketch.tsx`, `DrawingCanvas.tsx` |
| Upload helper | `src/managers/SketchUploader.ts` |
| Voice | `src/components/AudioRecordModal.tsx`, `RecordButton.tsx`, `src/services/AudioStorageService.ts`, `AudioStorageContext.tsx` |
| Camera | `src/components/CameraView.tsx` |
| Recommend modal | `src/components/ImageModal.tsx` |
| Types | `src/managers/types.ts`, `src/types/recommend.ts` |
