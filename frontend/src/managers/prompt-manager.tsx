import { createSlice } from '@reduxjs/toolkit'

const initalPromptState = { category: '', value: '', message: '' }
const promptSlice = createSlice({
  name: 'prompt',
  initialState: initalPromptState,
  reducers: {
    setPromptBySelectBox(state, action) {
      state.category = action.payload.category
      state.value = action.payload.value
      state.message += `${action.payload.category}is ${action.payload.value} `
    },
    setPromptByTextArea(state, action) {
      state.message = action.payload
    },
    clearPrompt(state) {
      state.message = ''
    }
  }
})

export const promptActions = promptSlice.actions
export default promptSlice
