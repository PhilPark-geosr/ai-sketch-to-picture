import { createSlice } from '@reduxjs/toolkit'

//action type
export interface StoreState {
  counter: number //상태 정의
  showCounter: boolean
}
const initialCounterState = { counter: 0, showCounter: true }
const counterSlice = createSlice({
  name: 'counter',
  initialState: initialCounterState,
  reducers: {
    increment(state) {
      state.counter++
    },
    decrement(state) {
      state.counter--
    },
    increase(state, action) {
      // redux toolkit에서는 자동으로 increase에 값을 전달했을떄 payload : {mydata} 이렇게 넣어준다
      state.counter = state.counter + action.payload.amount
    },
    toggleCounter(state) {
      state.showCounter = !state.showCounter
    }
  }
})

export const counterActions = counterSlice.actions //모든 액션들 방출
export default counterSlice
