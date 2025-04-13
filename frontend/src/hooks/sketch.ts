import { useMutation } from '@tanstack/react-query'
import axios, { AxiosProgressEvent } from 'axios'
import defaultImage from '@/assets/chair.png'
import { useState } from 'react'
export const useCreateSketch = () => {
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(
    defaultImage
  )
  const result = useMutation({
    mutationFn: async (formData: FormData) => {
      const url = import.meta.env.VITE_AI_SERVER_URL + '/upload'
      console.warn('api server url', url)
      try {
        const response = await axios.post(url, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
          //TODO: progress 추후 필요하면 구현
          //   onUploadProgress: (event: AxiosProgressEvent) => {
          //     if (event.progress) {
          //       const progressPercent = Math.round(event.progress * 100)
          //     //   setProgress(progressPercent)
          //     }
          //   }
        })

        const data = response.data
        setUploadedImageUrl(data.image)
        return data
      } catch (error) {
        throw new Error(`Upload error: ${error}`)
      }
    }
  })
  return {
    result,
    uploadedImageUrl
  }
}
