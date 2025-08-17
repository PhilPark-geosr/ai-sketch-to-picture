import { createSlice } from '@reduxjs/toolkit'
import {
  mockRecommendData,
  recommendResponse,
  recommendResult
} from '../mock/recommend_mock'

const initialState: recommendResponse = {
  status: 'idle',
  prompt: '',
  image_url: '',
  results: []
}
const recommendSlice = createSlice({
  name: 'recommend',
  initialState: initialState,
  reducers: {
    setStatus(state, action) {
      state.status = action.payload
    },
    setResults(state, action) {
      state.results = action.payload
    }
  }
})

export const recommendActions = recommendSlice.actions
export default recommendSlice
