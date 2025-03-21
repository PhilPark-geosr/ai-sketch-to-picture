//리덕스 스토어 만들기

import { createStore } from 'redux'

// STEP1. createStore()로 스토어 생성
// 데이터를 변화시키는 역할을 하는 리듀서 함수 제공
// Reducer는 최신 상태 스냅샷과 액션을 인자로 받음

//action type
export interface StoreState {
  counter: number //상태 정의
  showCounter: boolean
}
export interface Action {
  type: string
  payload: {
    amount: number
  }
}

const initialState = { counter: 0, showCounter: true }
const counterReducer = (state: StoreState = initialState, action: Action) => {
  switch (action.type) {
    case 'increment':
      return { ...state, counter: state.counter + 1 }
    case 'decrement':
      return { ...state, counter: state.counter + 1 }
    case 'increase':
      return { ...state, counter: state.counter + action.payload.amount }
    case 'toggle':
      return { ...state, showCounter: !state.showCounter }
    default:
      return state
  }
}
const store = createStore(counterReducer)

// react에 방출
export default store
