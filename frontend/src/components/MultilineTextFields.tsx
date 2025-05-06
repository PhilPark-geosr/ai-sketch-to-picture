import * as React from 'react'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import { promptActions } from '../store'
import { useDispatch } from 'react-redux'

export default function MultilineTextFields() {
  const dispatch = useDispatch()
  const handleChange = (event: any) => {
    // redux활용하여 넣기
    dispatch(promptActions.setPromptByTextArea(event.target.value))
  }

  return (
    <Box
      component="form"
      sx={{ '& .MuiTextField-root': { m: 1, width: '35ch' } }}
      noValidate
      autoComplete="off">
      <div>
        <TextField
          id="outlined-multiline-static"
          label="Multiline"
          multiline
          rows={4}
          placeholder="원하는 요구사항을 입력하세요"
          onChange={handleChange}
        />
      </div>
    </Box>
  )
}
