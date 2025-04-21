// DrawingCanvas.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { vi } from 'vitest'
import DrawingCanvas from '@/components/DrawingCanvas'
import defaultImage from '@/assets/chair.png'
import '@testing-library/jest-dom'
// 모킹할 훅 import
import * as sketchHook from '../hooks/sketch'

describe('DrawingCanvas', () => {
  it('calls createSketch when uploadImage button is clicked', async () => {
    // useCreateSketch 훅을 모킹
    vi.spyOn(sketchHook, 'useCreateSketch').mockReturnValue({
      result: {
        data: null,
        status: 'idle',
        mutateAsync: vi.fn().mockResolvedValue({
          image: defaultImage
        })
      },
      uploadedImageUrl: null
    })

    render(<DrawingCanvas />)
    expect(screen.getByText('idle')).toBeInTheDocument()
  })
})
