import { View, StyleSheet, Text } from 'react-native'

interface Props {
  children: React.ReactNode
}

export default function Title({ children }: Props) {
  return <View style={styles.dummyText}>{children}</View>
}

const styles = StyleSheet.create({
  dummyText: {
    margin: 16,
    padding: 16,
    borderWidth: 2,
    borderColor: 'blue'
  }
})
