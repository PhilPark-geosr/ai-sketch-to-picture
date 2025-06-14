import {
  uploadImageUtil,
  UploadImageParams,
  uploadSketchUtil
} from '../utils/uploadImage'
import defaultImage from '@/assets/chair.png'
import { vi } from 'vitest'
describe('UploadUtil test', () => {
  beforeEach(() => {
    //mock setup
    //TEST_F
    HTMLCanvasElement.prototype.getContext = vi.fn(() => ({
      fillStyle: '',
      fillRect: vi.fn(),
      drawImage: vi.fn()
    })) as any
    HTMLCanvasElement.prototype.toBlob = function (callback) {
      const blob = new Blob(['fake'], { type: 'image/png' })
      callback(blob)
    }
  })
  it('sketchInference Test', async () => {
    //Arange
    // mock canvas and its context
    const mockCanvas = document.createElement('canvas')
    mockCanvas.width = 100
    mockCanvas.height = 100
    const ctx = mockCanvas.getContext('2d')
    if (!ctx) throw new Error('Canvas context creation failed')

    // mock으로 대체해도되는 함수 호출
    const mockClearPrompt = vi.fn()
    const mockOnSuccess = vi.fn()
    const mockCreateSketch = vi.fn().mockResolvedValue({
      image: defaultImage
    })

    //Act
    await uploadSketchUtil({
      canvas: mockCanvas,
      prompt: '안녕하세요 박필입니다',
      clearPrompt: mockClearPrompt,
      createSketch: mockCreateSketch,
      onSuccess: mockOnSuccess
    })

    //Assert
    expect(mockClearPrompt).toHaveBeenCalled()
    expect(mockCreateSketch).toHaveBeenCalled()
    expect(mockOnSuccess).toHaveBeenCalled()
  })
})
