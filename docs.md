# Engineering documentation index

Product and developer docs live in the repo root unless noted otherwise.

| Document | Audience | Covers |
|----------|----------|--------|
| [Readme.md](./Readme.md) | All developers | Setup, architecture, env vars, API contracts, troubleshooting |
| [.env.example](./.env.example) | Local setup | `SERVER_URL`, `STT_SERVER_URL` template |
| [study.md](./study.md) | Learning | React hooks notes (not runtime reference) |
| [useMemo-useCallback.md](./useMemo-useCallback.md) | Learning | Hook patterns used in `DrawingCanvas` |

When changing upload, recommend, STT, or media-input UI (`CameraView`, `RecordButton`, `AudioRecordModal`), update **Readme.md** flow diagram, API tables, and the action-button section to match source.
