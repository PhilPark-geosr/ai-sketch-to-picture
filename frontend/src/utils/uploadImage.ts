export interface UploadParams {
  prompt: string
  clearPrompt: () => void
  createSketch: (formData: FormData) => Promise<any>
  onSuccess?: () => void
}

export interface UploadSketchParams extends UploadParams {
  canvas: HTMLCanvasElement
}

export interface UploadImageParams extends UploadParams {
  image: string
}

export const uploadSketchUtil = async ({
  canvas,
  prompt,
  clearPrompt,
  createSketch,
  onSuccess
}: UploadSketchParams): Promise<void> => {
  const whiteCanvas = document.createElement('canvas')
  const ctx = whiteCanvas.getContext('2d')
  if (!ctx) return

  whiteCanvas.width = canvas.width
  whiteCanvas.height = canvas.height

  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, whiteCanvas.width, whiteCanvas.height)
  ctx.drawImage(canvas, 0, 0)

  whiteCanvas.toBlob(async blob => {
    console.warn('useSketch', blob)
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

export const uploadImageUtil = async ({
  image,
  prompt,
  clearPrompt,
  createSketch,
  onSuccess
}: UploadImageParams) => {
  const formData = new FormData()
  const decodedBlob = await fetch(image)
  const blob = await decodedBlob.blob()

  formData.append('sketch', blob, 'drawing.png')
  formData.append('prompt', prompt)
  clearPrompt()
  const res = await createSketch(formData)

  if (res?.image && onSuccess) {
    onSuccess()
  }
}

export const recommendUtil = async ({
  image,
  prompt,
  createRecommend,
  onSuccess
}: {
  image: string
  prompt: string
  createRecommend: (formData: FormData) => Promise<any>
  onSuccess?: () => void
}) => {
  const formData = new FormData()
  const decodedBlob = await fetch(image)
  const blob = await decodedBlob.blob()

  formData.append('image', blob, 'needToRecommend.png')
  formData.append('prompt', prompt)

  const res = await createRecommend(formData)
  if (res?.image && onSuccess) {
    onSuccess()
  }
}
