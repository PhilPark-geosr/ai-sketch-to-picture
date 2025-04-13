import { useRef, useState } from 'react'
import defaultImage from '@/assets/chair.png'
import axios, { AxiosProgressEvent } from 'axios'
const DrawingCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(
    defaultImage
  )

  const [progress, setProgress] = useState<number>(0)

  const startDrawing = (event: React.MouseEvent) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctxRef.current = ctx
    ctx.beginPath()
    ctx.moveTo(event.nativeEvent.offsetX, event.nativeEvent.offsetY)
    setIsDrawing(true)
  }

  const draw = (event: React.MouseEvent) => {
    if (!isDrawing || !ctxRef.current) return
    ctxRef.current.lineTo(event.nativeEvent.offsetX, event.nativeEvent.offsetY)
    ctxRef.current.stroke()
  }

  const stopDrawing = () => {
    if (ctxRef.current) {
      ctxRef.current.closePath()
    }
    setIsDrawing(false)
  }

  // const uploadImage = () => { //by fetch
  //   const canvas = canvasRef.current
  //   if (!canvas) return

  //   canvas.toBlob(async blob => {
  //     if (!blob) return

  //     const formData = new FormData()
  //     formData.append('sketch', blob, 'drawing.png')

  //     const url = 'http://112.160.104.112:5000/upload'

  //     try {
  //       const response = await fetch(url, {
  //         method: 'POST',
  //         body: formData
  //       })

  //       if (!response.ok) throw new Error('Upload failed')

  //       const data = await response.json() // API에서 반환된 이미지 URL을 JSON으로 받음
  //       console.log('Upload Success:', data)

  //       setUploadedImageUrl(data.image) // 응답 데이터에서 이미지 URL을 상태에 저장
  //     } catch (error) {
  //       console.error('Upload Error:', error)
  //     }
  //   }, 'image/png')
  // }

  const uploadImage = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    canvas.toBlob(async blob => {
      if (!blob) return

      const formData = new FormData()
      formData.append('sketch', blob, 'drawing.png')

      const url = 'http://112.160.104.112:5000/upload'

      try {
        const response = await axios.post(url, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          onUploadProgress: (event: AxiosProgressEvent) => {
            if (event.progress) {
              const progressPercent = Math.round(event.progress * 100)
              setProgress(progressPercent)
            }
          }
        })

        const data = response.data
        setUploadedImageUrl(data.image)
      } catch (error) {
        console.error('Upload Error:', error)
      }
    }, 'image/png')
  }

  const saveImage = () => {
    const canvas = canvasRef.current
    if (!canvas) {
      console.error('canvas does not exist')
      return
    }

    console.warn('saveImage', canvas)
    const dataURL = canvas.toDataURL('image/png')
    console.warn('dataURL', dataURL)

    // 다운로드 처리
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

        {/* API 응답 받은 이미지 표시 */}
        {uploadedImageUrl && (
          <div>
            <p className="text-center font-semibold">업로드된 이미지</p>
            {progress > 0 && <p>Uploading... {progress}%</p>}
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
