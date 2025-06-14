import { useMutation, useQuery } from '@tanstack/react-query'

export const useCreatePicture = () => {
  const result = useMutation({
    mutationFn: async (formData: FormData) => {
      const myHeaders = new Headers()
      myHeaders.append('Content-Type', 'multipart/form-data')

      //TODO: 영석님 api 오면
      const res = await fetch('http://영석님 api', {
        method: 'POST',
        body: formData, // FormData 사용,
        headers: myHeaders
      })
        .then(res => res.json())
        // .then(data => console.log('Upload Success:', data))
        .catch(error => console.error('Upload Error:', error))
    }
  })
}
