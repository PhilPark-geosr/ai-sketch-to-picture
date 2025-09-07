import { useState } from 'react'
import {
  Button,
  TextInput,
  View,
  Text,
  StyleSheet,
  FlatList
} from 'react-native'
import GoalItem from './Goalitem'
import GoalInput from './GoalInput'

export interface TodoState {
  content: string
}

export default function TodoList() {
  const [todos, setTodos] = useState<TodoState[]>([])

  function addGoalHandler(enteredText: string): void {
    setTodos((prevTodos: TodoState[]) => [
      ...prevTodos,
      { content: enteredText }
    ])
  }

  return (
    <View style={styles.appContainer}>
      <GoalInput onAddGoal={addGoalHandler} />
      <View style={styles.goalsContainer}>
        <FlatList
          data={todos}
          keyExtractor={(item, index) => `todo-${index}`}
          renderItem={({ item }: { item: TodoState }) => {
            return <GoalItem todo={item} />
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
  goalsContainer: {
    flex: 5
  }
})
