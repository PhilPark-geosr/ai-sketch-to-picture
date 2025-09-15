import React from 'react'
import { SafeAreaView, View, Text, StyleSheet, Platform } from 'react-native'
import ImagePickerView from './components/ImagePickerView'
import GallerySelectView from './pages/GallerySelectView'
import { MemoSketch } from './components/MemoSketch'
import TodoList from './components/TodoList'

export default function App() {
  return (
    <View style={styles.container}>
      {/* <View>
        <Text style={styles.dummyText}>Hello world!</Text>
      </View> */}
      {/* <GallerySelectView></GallerySelectView> */}
      <MemoSketch uploadUrl={'set your ip'}></MemoSketch>
      {/* <TodoList></TodoList> */}
    </View>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#ffffff' },
  container: { flex: 1, padding: 16, gap: 16 },
  title: { fontSize: 20, fontWeight: '700' },
  subtitle: { color: '#6b7280' },
  dummyText: {
    margin: 16,
    padding: 16,
    borderWidth: 2,
    borderColor: 'blue'
  }
})
