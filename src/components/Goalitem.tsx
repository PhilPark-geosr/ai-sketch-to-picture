import { View, StyleSheet, Text } from 'react-native'
import { TodoState } from './TodoList'

export default function GoalItem({ todo }: { todo: TodoState }) {
  return (
    <View style={styles.goalItem}>
      <Text style={styles.goalText}>{todo.content}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
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
