import { View, StyleSheet, Text, Button, Pressable } from 'react-native'
import { TodoState } from './TodoList'

interface GoalItemProps {
  todo: TodoState
  onDelete: (item: TodoState) => void
}

export default function GoalItem({ todo, onDelete }: GoalItemProps) {
  function onPressHandler() {
    onDelete(todo)
  }

  return (
    <Pressable style={({ pressed }) => pressed && styles.pressedItem}>
      <View style={styles.goalItem}>
        <Text style={styles.goalText}>{todo.content}</Text>
        <Button
          title="delete"
          onPress={onPressHandler}
        />
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  goalItem: {
    flexDirection: 'row',
    margin: 8,
    padding: 8,
    borderRadius: 6,
    backgroundColor: '#5e0acc'
  },
  pressedItem: {
    opacity: 0.5
  },
  goalText: {
    flex: 1,
    color: 'white'
  }
})
