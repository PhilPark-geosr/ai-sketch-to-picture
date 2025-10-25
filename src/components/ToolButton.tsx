import { Pressable, Text, StyleSheet } from 'react-native'

export default function ToolButton({
  label,
  onPress
}: {
  label: string
  onPress: () => void
}) {
  return (
    <Pressable
      onPress={onPress}
      style={styles.btn}>
      <Text style={styles.btnText}>{label}</Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  btn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: '#111'
  },
  btnText: { color: '#fff', fontWeight: '600' }
})
