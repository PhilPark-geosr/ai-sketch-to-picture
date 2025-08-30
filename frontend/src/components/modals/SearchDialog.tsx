import React, { forwardRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCreateRecommend } from '../../hooks/recommend'
import { recommendUtil } from '../../utils/uploadImage'
import { useDispatch } from 'react-redux'
import { recommendActions } from '../../managers/recommend-manager'

interface SearchDialogProps {
  onMove?: () => void // 이동 버튼 클릭 시 동작
  imageUrl: string
}

const SearchDialog = forwardRef<HTMLDialogElement, SearchDialogProps>(
  function SearchDialog({ imageUrl, ...props }, ref: any) {
    const dispatch = useDispatch()
    const {
      result: { status, mutateAsync: createRecommend }
    } = useCreateRecommend()
    const navigate = useNavigate()
    const handleClose = () => {
      // dialog 태그의 ref가 있을 때 close 호출
      if (ref && typeof ref !== 'function' && ref.current) {
        ref.current.close()
      }
    }
    const onMove = (): void => {
      //api요청
      recommendUtil({
        image: imageUrl,
        prompt: 'ikea style',
        createRecommend,
        onSuccess: res => {
          dispatch(recommendActions.setResults(res.results)) // 👈 받은 데이터를 dispatch
          dispatch(recommendActions.setStatus('success'))
          navigate('/recommendation')
        }
      })
    }
    return (
      <dialog
        ref={ref}
        {...props}
        className="p-6 rounded-xl shadow-lg w-[300px] text-center">
        <h2 className="text-lg font-bold mb-4">제품 추천을 받기 원하세요?</h2>
        <div className="flex justify-between gap-4">
          <button
            onClick={onMove}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl">
            이동
          </button>
          <form method="dialog">
            <button
              className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-xl"
              onClick={handleClose}>
              닫기
            </button>
          </form>
        </div>
      </dialog>
    )
  }
)

export default SearchDialog
