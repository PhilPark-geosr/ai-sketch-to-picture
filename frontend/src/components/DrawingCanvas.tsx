import { useRef, useState } from 'react'

const DrawingCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null)
  const [isDrawing, setIsDrawing] = useState(false)

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

  const uploadImage = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    canvas.toBlob(blob => {
      if (!blob) return

      const formData = new FormData()
      formData.append('file', blob, 'drawing.png')

      //TODO: 영석님 api 오면
      fetch('http://영석님 api', {
        method: 'POST',
        body: formData // FormData 사용
      })
        .then(res => res.json())
        .then(data => console.log('Upload Success:', data))
        .catch(error => console.error('Upload Error:', error))
    }, 'image/png')
  }

  const saveImage = () => {
    const canvas = canvasRef.current
    if (!canvas) {
      console.error('canvas does not exist')
      return
    }
    console.warn('saveImage', canvas)
    const dataURL = canvas.toDataURL()
    console.warn('dataURL', dataURL)
  }

  return (
    <>
      <canvas
        ref={canvasRef}
        width={500}
        height={500}
        style={{ border: '1px solid black' }}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
      />
      {/* <button onClick={uploadImage}>이미지 업로드</button> */}
      <button onClick={saveImage}>다운로드</button>
    </>
  )
}

export default DrawingCanvas
