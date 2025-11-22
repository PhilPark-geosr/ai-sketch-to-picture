import React from 'react'
import { View, Text, StyleSheet, Platform } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import ImagePickerView from './components/ImagePickerView'
import GallerySelectView from './pages/GallerySelectView'
import { MemoSketch } from './components/MemoSketch'
import TodoList from './components/TodoList'
import RecommendView from './components/RecommendView'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { NavigationContainer } from '@react-navigation/native'

function HomeScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home Screen</Text>
    </View>
  )
}

function MemoSketchWrapper({ navigation }: { navigation: any }) {
  return (
    <View style={styles.container}>
      <MemoSketch
        uploadUrl={'set your ip'}
        navigation={navigation}
      />
    </View>
  )
}

const Stack = createNativeStackNavigator()

function RootStack() {
  return (
    <Stack.Navigator initialRouteName="MemoSketchView">
      <Stack.Screen
        name="Home"
        component={HomeScreen}
      />
      <Stack.Screen
        name="MemoSketchView"
        component={MemoSketchWrapper}
      />
    </Stack.Navigator>
  )
}

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <RootStack />
      </NavigationContainer>
    </SafeAreaProvider>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#ffffff' },
  container: { flex: 1, padding: 16, gap: 16, backgroundColor: '#ffffff' },
  title: { fontSize: 20, fontWeight: '700' },
  subtitle: { color: '#6b7280' },
  dummyText: {
    margin: 16,
    padding: 16,
    borderWidth: 2,
    borderColor: 'blue'
  }
})
