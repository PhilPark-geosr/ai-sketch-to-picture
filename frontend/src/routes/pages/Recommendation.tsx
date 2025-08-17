import { mockRecommendData } from '@/mock/recommend_mock.ts'
import { recommendResponse, recommendResult } from '../../mock/recommend_mock'
import ImageCard from '../../components/ImageCard'
import { useSelector } from 'react-redux'
export default function Recommendation() {
  const responseData = useSelector((state: any) => state.recommend)
  const result: recommendResult[] = responseData.results
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">추천 결과</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {responseData.status === 'success' &&
          result.map((item, idx) => (
            <ImageCard
              key={idx}
              item={item}
            />
          ))}
      </div>
    </div>
  )
}
