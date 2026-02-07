import { View, Text, StyleSheet, Pressable, Alert } from "react-native";
import React, { useEffect, useRef, useState } from 'react'
import {
  useAudioRecorder,
  AudioModule,
  RecordingPresets,
  setAudioModeAsync,
  useAudioRecorderState,
} from 'expo-audio';
import ConfirmModal from "./Confirmodal";
export default function RecordButton() {
  const audioRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const recorderState = useAudioRecorderState(audioRecorder);
  const confirmModalRef = useRef<any>(null);
  const record = async () => {
    await audioRecorder.prepareToRecordAsync();
    audioRecorder.record();
  }

  const stopRecording = async () => {
    await audioRecorder.stop();
    const uri =audioRecorder.uri;
    console.log('audioRecorder: ', uri);
    confirmModalRef.current?.open(uri);
  }

  useEffect(() => {
    (async () => {
      const status = await AudioModule.requestRecordingPermissionsAsync();
      if (!status.granted) {
        Alert.alert('Permission to access microphone was denied');
      }

      setAudioModeAsync({
        playsInSilentMode: true,
        allowsRecording: true,
      });
    })();
  }, []);

  return (
    <View style={styles.container}>
      <Pressable onPress={recorderState.isRecording? stopRecording : record} style={styles.button}>
        <Text>{recorderState.isRecording ? 'Stop' : 'Record'}</Text>
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


  