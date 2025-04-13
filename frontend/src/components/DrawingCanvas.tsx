import { useRef, useState } from 'react'
import { useCreateSketch } from '../hooks/sketch'
const DrawingCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const {
    result: { data, status, mutateAsync: createSketch },
    uploadedImageUrl
  } = useCreateSketch()

  const startDrawing = (event: React.MouseEvent): void => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctxRef.current = ctx
    ctx.beginPath()
    ctx.moveTo(event.nativeEvent.offsetX, event.nativeEvent.offsetY)
    setIsDrawing(true)
  }

  const draw = (event: React.MouseEvent): void => {
    if (!isDrawing || !ctxRef.current) return
    ctxRef.current.lineTo(event.nativeEvent.offsetX, event.nativeEvent.offsetY)
    ctxRef.current.stroke()
  }

  const stopDrawing = (): void => {
    if (ctxRef.current) {
      ctxRef.current.closePath()
    }
    setIsDrawing(false)
  }

  const uploadImage = (): void => {
    const canvas = canvasRef.current
    if (!canvas) return

    // 임시 캔버스 생성
    const whiteCanvas = document.createElement('canvas')
    const ctx = whiteCanvas.getContext('2d')
    if (!ctx) return

    whiteCanvas.width = canvas.width
    whiteCanvas.height = canvas.height

    // 배경을 하얀색으로 채움
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, whiteCanvas.width, whiteCanvas.height)

    // 원래 캔버스를 복사
    ctx.drawImage(canvas, 0, 0)

    // blob으로 변환하여 업로드
    whiteCanvas.toBlob(async blob => {
      if (!blob) return
      const formData = new FormData()
      formData.append('sketch', blob, 'drawing.png')
      createSketch(formData)
    }, 'image/png')
  }

  const saveImage = (): void => {
    const canvas = canvasRef.current
    if (!canvas) {
      console.error('canvas does not exist')
      return
    }

    // 오프스크린 캔버스 생성
    const whiteCanvas = document.createElement('canvas')
    whiteCanvas.width = canvas.width
    whiteCanvas.height = canvas.height
    const ctx = whiteCanvas.getContext('2d')

    if (!ctx) {
      console.error('context does not exist')
      return
    }

    // 흰색 배경 먼저 그리기
    ctx.fillStyle = 'white'
    ctx.fillRect(0, 0, whiteCanvas.width, whiteCanvas.height)

    // 원래 캔버스 내용 복사
    ctx.drawImage(canvas, 0, 0)

    // dataURL로 저장
    const dataURL = whiteCanvas.toDataURL('image/png')
    console.warn('dataURL', dataURL)

    const a = document.createElement('a')
    a.href = dataURL
    a.download = 'canvas_image.png'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  const clearCanvas = (): void => {
    // ctxRef.current?.clearRect
    const canvas = canvasRef.current
    if (!canvas || !ctxRef.current) return

    // 캔버스를 투명하게 지우기
    ctxRef.current.clearRect(0, 0, canvas.width, canvas.height)
  }

  return (
    <>
      <div className="w-[500px] h-[500px] mx-auto">
        <p className="text-center font-semibold"> Draw here!</p>
        <canvas
          className="mb-2.5 mx-auto"
          ref={canvasRef}
          width={100}
          height={100}
          style={{ border: '1px solid black' }}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
        />
        <div className="grid grid-cols-2 gap-4">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-2xl"
            onClick={uploadImage}>
            이미지 업로드
          </button>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-2xl"
            onClick={saveImage}>
            다운로드
          </button>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-2xl"
            onClick={clearCanvas}>
            다시그리기
          </button>
        </div>
        {status && <p>{status}</p>}

        {/* API 응답 받은 이미지 표시 */}
        {uploadedImageUrl && (
          <div>
            <p className="text-center font-semibold">업로드된 이미지</p>
            {/* {progress > 0 && <p>Uploading... {progress}%</p>} */}

            <img
              className="mx-auto"
              src={uploadedImageUrl}
              alt="Uploaded"
              style={{ width: '300px', border: '1px solid gray' }}
            />
          </div>
        )}
      </div>
    </>
  )
}

export default DrawingCanvas
