import { useState } from 'react'
import { View, TextInput, Button, StyleSheet } from 'react-native'

export default function GoalInput({ onAddGoal }) {
  const [enteredText, setEnteredText] = useState<string>('')

  function goalInputHandler(enteredText: string): void {
    console.warn('goalInputHandler', enteredText)
    setEnteredText(enteredText)
  }

  function onPressHandler() {
    onAddGoal(enteredText)
  }

  return (
    <View style={styles.inputContainer}>
      <TextInput
        style={styles.textInput}
        placeholder="your course goal"
        onChangeText={goalInputHandler}></TextInput>
      <Button
        title="Add goal!"
        onPress={onPressHandler}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  inputContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#cccccc'
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#cccccc',
    width: '70%',
    marginRight: 8,
    padding: 8
  }
})
