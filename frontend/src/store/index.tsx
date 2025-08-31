//리덕스 툴킷을 이용한 유지보수 하기 편리한 Redux 만들기
import { configureStore, createSlice } from '@reduxjs/toolkit'
import { CreateSliceOptions } from '@reduxjs/toolkit'
import recommendSlice from '../managers/recommend-manager'
import counterSlice from '../managers/counter-manager'
import promptSlice from '../managers/prompt-manager'

// STEP1. createSlice()로 슬라이스 생성
// 데이터를 변화시키는 역할을 하는 리듀서 함수 제공
// Reducer는 최신 상태 스냅샷과 액션을 인자로 받음
// slice에서는 기본적으로 기존 상태를 변경하지 않고, 덮어쓰는 동작을 내부적으로 구현되어 있어,
// 내가 짠 코드는 상태를 변경하는거 같아도 실제로 내부적으로는 덮어쓰고 있음.

// 여러 리듀서를 합쳐야 할 떄 reducer에 맵 객체로 지정하면 된다.
const store = configureStore({
  reducer: {
    counter: counterSlice.reducer,
    prompt: promptSlice.reducer,
    recommend: recommendSlice.reducer
  }
})
// react에 방출
export default store
