import { View, Text, StyleSheet, Pressable, Alert } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { AudioModule, setAudioModeAsync } from 'expo-audio'
import ConfirmModal from './Confirmodal'
export default function RecordButton() {
  const confirmModalRef = useRef<any>(null)
  const record = async () => {
    confirmModalRef.current?.open()
  }

  return (
    <View style={styles.container}>
      <Pressable
        onPress={record}
        style={styles.button}>
        <Text>Record</Text>
      </Pressable>
      <ConfirmModal ref={confirmModalRef} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  button: {
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: 'green',
    alignSelf: 'flex-start'
  }
})
