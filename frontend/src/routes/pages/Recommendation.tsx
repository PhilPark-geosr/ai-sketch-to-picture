import defaultImage from '@/assets/chair.png'
import { mockRecommendData } from '@/mock/recommend_mock.ts'
import { recommendResponse, recommendResult } from '../../mock/recommend_mock'
export default function Recommendation() {
  const responseData: recommendResponse = mockRecommendData
  const result: recommendResult[] = responseData.results

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">추천 결과</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {responseData.status === 'success' &&
          result.map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-shadow p-4">
              <img
                src={item.image}
                alt="추천 이미지"
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <p className="text-gray-700 mb-2">
                <span className="font-semibold">주소: </span>
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 underline">
                  링크 열기
                </a>
              </p>
              {item.price && (
                <p className="text-gray-800 font-semibold">
                  가격: {item.price}
                </p>
              )}
            </div>
          ))}
      </div>
    </div>
  )
}
