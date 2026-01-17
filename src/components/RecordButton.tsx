import { View, Text, StyleSheet, Pressable } from "react-native";
import React, { useState } from 'react'
export default function RecordButton() {
  return (
    <View style={styles.container}>
      <Pressable onPress={onRecord} style={styles.button}>
        <Text>Record</Text>
        </Pressable>
    </View>
  )
}

function onRecord() {
  console.log('onRecord')
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
  