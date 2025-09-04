/**
 * 서버 업로드만 담당하는 매니저 (비즈니스 로직 분리)
 * - PNG base64 문자열을 받아 업로드
 * - 기본은 multipart/form-data 업로드 예시
 *   (서버가 PUT 바이너리/JSON을 원하면 여기서만 교체하면 됨)
 */
export class SketchUploader {
    static async uploadPngBase64(opts: {
      uploadUrl: string;
      fileName?: string;       // 기본: memo-sketch.png
      base64Png: string;       // "iVBORw0..." (data URI prefix 없음)
      extraHeaders?: Record<string, string>;
      fieldName?: string;      // multipart 필드명 (기본: "file")
    }): Promise<Response> {
      const {
        uploadUrl,
        base64Png,
        fileName = 'memo-sketch.png',
        extraHeaders,
        fieldName = 'file',
      } = opts;
  
      // React Native에서 FormData에 직접 base64 추가
      const form = new FormData();
      form.append(fieldName, {
        uri: `data:image/png;base64,${base64Png}`,
        type: 'image/png',
        name: fileName,
      } as any);
  
      // 필요 시 커스텀 헤더 추가
      const headers: Record<string, string> = {
        ...(extraHeaders ?? {}),
        // Content-Type은 브라우저/런타임이 multipart에 맞게 자동 세팅
      };
  
      // 실제 업로드
      return fetch(uploadUrl, {
        method: 'POST',
        body: form,
        headers,
      });
    }
  

  }
  