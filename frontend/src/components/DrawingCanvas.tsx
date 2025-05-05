import { useRef, useState } from 'react'
import { useCreateSketch } from '../hooks/sketch'
import html2canvas from 'html2canvas'
import BasicSelect from './BasicSelect'
import { useDispatch, useSelector } from 'react-redux'
import { promptActions } from '../store'
const DrawingCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [downloadable, setDownLoadable] = useState(true)
  const prompt = useSelector((state: any) => state.prompt)
  const dispatch = useDispatch()
  const imgRef = useRef<HTMLImageElement>(null)
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
  console.warn('Drawing canvas load!')
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
      // sketch 인자 넣기
      formData.append('sketch', blob, 'drawing.png')

      // 프롬프트 인자 넣기
      console.warn('prompt', prompt)
      formData.append('prompt', prompt.message)
      dispatch(promptActions.clearPrompt())
      const res = await createSketch(formData)

      if (res.image) {
        setDownLoadable(true)
      }
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
    const canvas = canvasRef.current
    if (!canvas || !ctxRef.current) return

    // 캔버스를 투명하게 지우기
    ctxRef.current.clearRect(0, 0, canvas.width, canvas.height)
  }

  const saveResult = async (): Promise<void> => {
    if (!imgRef.current) return

    const canvas = await html2canvas(imgRef.current)
    const dataUrl = canvas.toDataURL('image/png')

    const link = document.createElement('a')
    link.href = dataUrl
    link.download = 'captured-image.png'
    link.click()
  }
  return (
    <>
      <div className="w-[300px] h-[300px] mx-auto">
        <p className="text-center font-semibold"> Draw here!</p>
        <div className="flex">
          <canvas
            className="mb-2.5 mx-auto"
            ref={canvasRef}
            width={300}
            height={300}
            style={{ border: '1px solid black' }}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
          />
          <BasicSelect
            category="Funiture"
            list={['chair', 'table', 'computer']}
          />
          <BasicSelect
            category="Material"
            list={['iron', 'wood', 'alloy']}
          />
          <BasicSelect
            category="Color"
            list={['black', 'white', 'beige']}
          />
        </div>

        <div
          onClick={clearCanvas}
          className="w-[25px] h-[25px] mx-auto my-3">
          <img src="src/assets/reload.png" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-2xl"
            onClick={uploadImage}>
            이미지 생성
          </button>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-2xl"
            onClick={saveImage}>
            다운로드
          </button>
        </div>
        {status && <p className="font-bold">Server status : {status}</p>}
        <p>프롬프트 {prompt.message}</p>
        <p
          className="font-bold"
          data-testid="uploadImageUrl">
          uploadImageUrl : {uploadedImageUrl}{' '}
        </p>
        {/* API 응답 받은 이미지 표시 */}
        {uploadedImageUrl && (
          <div className="mt-6">
            <p className="text-center font-semibold">업로드된 이미지</p>
            {/* {progress > 0 && <p>Uploading... {progress}%</p>} */}
            <img
              ref={imgRef}
              className="mx-auto"
              src={uploadedImageUrl}
              alt="Uploaded"
              style={{ width: '300px', border: '1px solid gray' }}
            />
          </div>
        )}
        <button
          disabled={!downloadable}
          className="my-3 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-2xl 
            disabled:opacity-30 disabled:cursor-not-allowed"
          onClick={saveResult}>
          결과 다운로드
        </button>
      </div>
    </>
  )
}

export default DrawingCanvas
