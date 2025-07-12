import defaultImage from '@/assets/chair.png'

export default function Recommendation() {
  const result = {
    status: 'success',
    prompt: 'ikea style',
    results: [
      {
        image: defaultImage,
        price: '120,000원',
        address: 'https://map.naver.com/v5/entry/place/123456'
      },
      {
        image: defaultImage,
        price: '85,000원',
        address: 'https://map.naver.com/v5/entry/place/234567'
      },
      {
        image: defaultImage,
        price: null,
        address: 'https://map.naver.com/v5/entry/place/345678'
      },
      {
        image: defaultImage,
        price: '45,000원',
        address: 'https://map.naver.com/v5/entry/place/456789'
      },
      {
        image: defaultImage,
        price: null,
        address: 'https://map.naver.com/v5/entry/place/567890'
      }
    ]
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">추천 결과</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {result.status === 'success' &&
          result.results.map((item, idx) => (
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
                  href={item.address}
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
