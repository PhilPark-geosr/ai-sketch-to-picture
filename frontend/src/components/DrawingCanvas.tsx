import { useRef, useState } from 'react'
import { useCreateSketch } from '../hooks/sketch'
import BasicSelect from './BasicSelect'
import { useDispatch, useSelector } from 'react-redux'
import { promptActions } from '../store'
import MultilineTextFields from './MultilineTextFields'
import { uploadImageUtil, uploadSketchUtil } from '../utils/uploadImage'
import { saveCanvasImage, saveHtmlElementAsImage } from '../utils/canvasUtils'
import defaultImage from '@/assets/chair.png'
import eraser from '@/assets/eraser.png'
const DrawingCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null)
  const imgRef = useRef<HTMLImageElement>(null)

  const [isDrawing, setIsDrawing] = useState(false)
  const [isErasing, setIsErasing] = useState(false)
  const [downloadable, setDownLoadable] = useState(true)

  const prompt = useSelector((state: any) => state.prompt)
  const dispatch = useDispatch()

  const {
    result: { data, status, mutateAsync: createSketch },
    uploadedImageUrl
  } = useCreateSketch()

  console.warn('Drawing canvas load!')

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
    const ctx = ctxRef.current
    // 지우개일 경우 지우기 모드
    if (isErasing) {
      ctx.globalCompositeOperation = 'destination-out'
      ctx.lineWidth = 20 // 지우개 크기 설정
    } else {
      ctx.globalCompositeOperation = 'source-over'
      ctx.lineWidth = 2 // 일반 선 굵기
    }
    ctxRef.current.lineTo(event.nativeEvent.offsetX, event.nativeEvent.offsetY)
    ctxRef.current.stroke()
  }

  const stopDrawing = (): void => {
    if (ctxRef.current) {
      ctxRef.current.closePath()
    }
    setIsDrawing(false)
  }

  const clearCanvas = (): void => {
    const canvas = canvasRef.current
    if (!canvas || !ctxRef.current) return

    // 캔버스를 투명하게 지우기
    ctxRef.current.clearRect(0, 0, canvas.width, canvas.height)
  }

  const uploadSketch = (): void => {
    const canvas = canvasRef.current
    if (!canvas) return

    uploadSketchUtil({
      canvas,
      prompt: prompt.message,
      clearPrompt: () => dispatch(promptActions.clearPrompt()),
      createSketch,
      onSuccess: () => setDownLoadable(true)
    })
  }

  const reinferenceImage = (): void => {
    if (uploadedImageUrl == defaultImage) return
    uploadImageUtil({
      image: uploadedImageUrl,
      prompt: prompt.message,
      clearPrompt: () => dispatch(promptActions.clearPrompt()),
      createSketch,
      onSuccess: () => {}
    })
  }

  const saveImage = () => {
    const canvas = canvasRef.current
    if (!canvas) {
      console.error('Canvas not found')
      return
    }
    saveCanvasImage(canvas)
  }

  const saveResult = async (): Promise<void> => {
    if (!imgRef.current) return
    await saveHtmlElementAsImage(imgRef.current)
  }

  return (
    <>
      <div className="mx-auto">
        <p className="text-center font-semibold"> Draw here!</p>
        <div className="flex">
          <div className="flex-1"></div>
          <canvas
            className="mb-2.5 flex-1 bg-white shadow-md rounded-xl"
            ref={canvasRef}
            width={300}
            height={300}
            style={{ border: '1px solid black' }}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
          />
          <div className="selectBox flex-1">
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
        </div>

        <div className="flex w-[300px] mx-auto  my-3">
          <button
            className={`my-3 ${isErasing ? 'bg-red-500' : 'bg-gray-500'} hover:bg-gray-700 mx-auto w-[60px] text-white font-bold py-2 px-4 rounded-2xl`}
            onClick={() => setIsErasing(prev => !prev)}>
            <img
              src={eraser}
              width={30}
            />
          </button>
          <img
            onClick={clearCanvas}
            className="mx-auto w-[30px] h-[30px] my-4 "
            src="src/assets/reload.png"
          />
        </div>

        <div className="grid grid-cols-2 gap-4 w-[300px] mx-auto">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-2xl"
            onClick={uploadSketch}>
            이미지 생성
          </button>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-2xl"
            onClick={saveImage}>
            다운로드
          </button>
        </div>
        {status && (
          <p
            className="font-bold"
            data-testid="status">
            Server status : {status}
          </p>
        )}
        <p>프롬프트 {prompt.message}</p>
        {/* API 응답 받은 이미지 표시 */}
        <div className="flex">
          <div className="flex-1"></div>
          {uploadedImageUrl && (
            <div className="mt-6 flex-1">
              <p className="text-center font-semibold">업로드된 이미지</p>
              {/* {progress > 0 && <p>Uploading... {progress}%</p>} */}
              <img
                ref={imgRef}
                data-testid="uploadImageUrl"
                className="mx-auto bg-white shadow-md rounded-xl"
                src={uploadedImageUrl}
                alt="Uploaded"
                style={{ width: '300px', border: '1px solid gray' }}
              />
            </div>
          )}
          <div className="flex-1 mt-10">
            <MultilineTextFields />
          </div>
        </div>

        <button
          disabled={!downloadable}
          className="my-3 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-2xl 
            disabled:opacity-30 disabled:cursor-not-allowed"
          onClick={saveResult}>
          결과 다운로드
        </button>
        <button
          className="my-3 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-2xl 
            disabled:opacity-30 disabled:cursor-not-allowed"
          onClick={reinferenceImage}>
          재요청
        </button>
      </div>
    </>
  )
}

export default DrawingCanvas
