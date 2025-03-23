import Counter from '@/components/Counter'
import DrawingCanvas from '../../components/DrawingCanvas'

export default function Home() {
  return (
    <>
      <div className="max-w-screen-lg mx-auto text-center">
        <DrawingCanvas />
      </div>
    </>
  )
}
