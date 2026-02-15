import { View, Text, StyleSheet, Pressable, Alert } from 'react-native'
import React, { useRef } from 'react'
import AudioRecordModal from './Confirmodal'
export default function RecordButton() {
  const audioRecordModalRef = useRef<any>(null)
  const record = async () => {
    audioRecordModalRef.current?.open()
  }

  return (
    <View style={styles.container}>
      <Pressable
        onPress={record}
        style={styles.button}>
        <Text>Record</Text>
      </Pressable>
      <AudioRecordModal ref={audioRecordModalRef} />
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
