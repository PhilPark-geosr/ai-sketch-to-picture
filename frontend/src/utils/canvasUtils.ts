import html2canvas from 'html2canvas'
export const saveCanvasImage = (
  canvas: HTMLCanvasElement,
  filename = 'canvas_image.png'
) => {
  const whiteCanvas = document.createElement('canvas')
  whiteCanvas.width = canvas.width
  whiteCanvas.height = canvas.height

  const ctx = whiteCanvas.getContext('2d')
  if (!ctx) {
    console.error('Failed to get 2D context from canvas')
    return
  }

  // 배경을 흰색으로 채움
  ctx.fillStyle = 'white'
  ctx.fillRect(0, 0, whiteCanvas.width, whiteCanvas.height)

  // 원래 캔버스를 덧그림
  ctx.drawImage(canvas, 0, 0)

  // Data URL 생성 및 다운로드
  const dataURL = whiteCanvas.toDataURL('image/png')
  const a = document.createElement('a')
  a.href = dataURL
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}

export const saveHtmlElementAsImage = async (element: HTMLElement) => {
  const canvas = await html2canvas(element)
  const dataUrl = canvas.toDataURL('image/png')

  const link = document.createElement('a')
  link.href = dataUrl
  link.download = 'captured-image.png'
  link.click()
}
