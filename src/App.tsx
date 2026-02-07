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
import { AudioStorageProvider } from './services/AudioStorageContext'

function RecommendViewWrapper({ route }: { route: any }) {
  // const recommendResponse = route?.params?.recommendResponse || null

  const { recommendResponse } = route.params || null

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <RecommendView data={recommendResponse} />
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
        name="Recommend"
        component={RecommendViewWrapper}
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
      <AudioStorageProvider>
        <NavigationContainer>
          <RootStack />
        </NavigationContainer>
      </AudioStorageProvider>
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
