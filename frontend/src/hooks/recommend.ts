import { useMutation } from '@tanstack/react-query'
import axios from 'axios'

export const useCreateRecommend = () => {
  const result = useMutation({
    mutationFn: async (formData: FormData) => {
      const url = import.meta.env.VITE_AI_SERVER_URL + '/recommend'

      try {
        const response = await axios.post(url, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        const data = response.data

        return data
      } catch (error) {
        throw new Error(`recommend API Error ${error}`)
      }
    }
  })
  return {
    result
  }
}
