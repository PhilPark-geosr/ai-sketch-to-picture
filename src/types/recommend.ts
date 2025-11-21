export interface RecommendResponse {
  status: string // 필수 ("success")
  prompt: string // 필수 (최종 검색 질의)
  image_url: string // 필수 (업로드된 이미지 URL)
  results?: Result[] | null // 선택 (빈 리스트 또는 None 가능)
}

export interface Result {
  title?: string | null // 상품명
  image?: string | null // 이미지 URL
  link?: string | null // 상품 페이지 링크
  price?: string | null // 가격 정보
}
