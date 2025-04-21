// DrawingCanvas.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { vi } from 'vitest'
import DrawingCanvas from '@/components/DrawingCanvas'
import defaultImage from '@/assets/chair.png'
import successImage from '@/assets/sidebar-icon.png'
import '@testing-library/jest-dom' // ToBeIndocument()등의 메소드를 쓰려면 필요
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
  }),
    it('test', async () => {
      // 모듈 전체를 모킹하여 테스트
      // mockUseCreateSketch.useCreateSketch.mockReturnValue 로 쓰는 이유
      // -> useCreateSketch자체는 동기적 함수이기 떄문!
      // 그안에 잇는 mutateAsync function은 비동기 함수이기 떄문에 resolve써야 함

      vi.mock('../hooks/sketch')
      const mockUseCreateSketch = vi.mocked(sketchHook)
      mockUseCreateSketch.useCreateSketch.mockReturnValue({
        result: {
          data: null,
          status: 'success',
          mutateAsync: vi.fn().mockResolvedValue({
            image: defaultImage
          })
        },
        uploadedImageUrl: successImage
      })
      render(<DrawingCanvas />)

      //상태 잘 넘어오는지 확인
      expect(screen.getByText('success')).toBeInTheDocument()
      const elem = screen.getByTestId('uploadImageUrl')
      // uploadedImageUrl이 정확하게 넘어오고 있는지 확인
      expect(elem).toHaveTextContent(successImage)
    })
})
