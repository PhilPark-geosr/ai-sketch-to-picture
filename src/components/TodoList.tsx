import { useState } from 'react'
import {
  Button,
  TextInput,
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList
} from 'react-native'

interface TodoState {
  content: string
}

export default function TodoList() {
  const [enteredText, setEnteredText] = useState<string>('')
  const [todos, setTodos] = useState<TodoState[]>([])
  function goalInputHandler(enteredText: string): void {
    console.warn('goalInputHandler', enteredText)
    setEnteredText(enteredText)
  }

  function addGoalHandler() {
    setTodos((prevTodos: TodoState[]) => [
      ...prevTodos,
      { content: enteredText }
    ])
  }

  return (
    <View style={styles.appContainer}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          placeholder="your course goal"
          onChangeText={goalInputHandler}></TextInput>
        <Button
          title="Add goal!"
          onPress={addGoalHandler}
        />
      </View>
      <View style={styles.goalsContainer}>
        <FlatList
          data={todos}
          keyExtractor={(item, index) => `todo-${index}`}
          renderItem={({ item }: { item: TodoState }) => {
            return (
              <View style={styles.goalItem}>
                <Text style={styles.goalText}>{item.content}</Text>
              </View>
            )
          }}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 16
  },
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
  },
  goalsContainer: {
    flex: 5
  },
  goalItem: {
    margin: 8,
    padding: 8,
    borderRadius: 6,
    backgroundColor: '#5e0acc'
  },
  goalText: {
    color: 'white'
  }
})
