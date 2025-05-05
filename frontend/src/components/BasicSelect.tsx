import * as React from 'react'
import Box from '@mui/material/Box'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import { promptActions } from '../store'
import { useDispatch } from 'react-redux'
export default function BasicSelect({
  category,
  list
}: {
  category: string
  list: string[]
}) {
  const [age, setAge] = React.useState('')
  const dispatch = useDispatch()
  const handleChange = (event: SelectChangeEvent) => {
    // redux활용하여 넣기
    dispatch(
      promptActions.setPrompt({
        category: category,
        value: event.target.value
      })
    )
    setAge(event.target.value as string)
  }

  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">{category}</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={age}
          label={category}
          onChange={handleChange}>
          {list.map(item => (
            <MenuItem
              key={Math.random()}
              value={item}>
              {item}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  )
}
