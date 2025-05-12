export interface UploadImageParams {
  canvas: HTMLCanvasElement
  prompt: string
  clearPrompt: () => void
  createSketch: (formData: FormData) => Promise<any>
  onSuccess?: () => void
}

export const uploadImageUtil = async ({
  canvas,
  prompt,
  clearPrompt,
  createSketch,
  onSuccess
}: UploadImageParams): Promise<void> => {
  const whiteCanvas = document.createElement('canvas')
  const ctx = whiteCanvas.getContext('2d')
  if (!ctx) return

  whiteCanvas.width = canvas.width
  whiteCanvas.height = canvas.height

  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, whiteCanvas.width, whiteCanvas.height)
  ctx.drawImage(canvas, 0, 0)

  whiteCanvas.toBlob(async blob => {
    if (!blob) return
    const formData = new FormData()
    formData.append('sketch', blob, 'drawing.png')
    formData.append('prompt', prompt)

    clearPrompt()
    const res = await createSketch(formData)

    if (res?.image && onSuccess) {
      onSuccess()
    }
  }, 'image/png')
}
