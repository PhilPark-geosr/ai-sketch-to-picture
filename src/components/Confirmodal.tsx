import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { View, Text, Modal, Pressable, StyleSheet } from 'react-native';
import { useAudioStorage } from '../services/AudioStorageContext';

const ConfirmModal = forwardRef((props, ref) => {
  const [visible, setVisible] = useState(false);
  const [uri, setUri] = useState<string | null>(null);

  const audioStorageService = useAudioStorage();
  useImperativeHandle(ref, () => ({
    open: (uri) => {
      setVisible(true);
      setUri(uri);
    },
    close: () => setVisible(false),
  }));

  const onSaveHandler = async () => {
    try {
      const result = await audioStorageService.saveRecording(uri);
      console.log('saveRecording result: ', result);
    } catch (error) {
      console.error('saveRecording error: ', error);
    }
    setVisible(false);  // ← 저장 완료 후 실행됨!
  }

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>녹음이 완료되었습니다!</Text>
          <Text style={styles.message}>녹음 파일을 저장하시겠습니까?</Text>
          
          <View style={styles.buttonContainer}>
            <Pressable 
              style={[styles.button, styles.cancelButton]} 
              onPress={() => setVisible(false)}
            >
              <Text style={styles.cancelText}>취소</Text>
            </Pressable>
            <Pressable 
              style={[styles.button, styles.confirmButton]} 
              onPress={onSaveHandler}
            >
              <Text style={styles.confirmText}>저장</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
});

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    width: '80%',
    maxWidth: 320,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  message: {
    fontSize: 14,
    color: '#666',
    marginBottom: 24,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    minWidth: 100,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
  },
  confirmButton: {
    backgroundColor: '#4CAF50',
  },
  cancelText: {
    color: '#666',
    fontWeight: '600',
  },
  confirmText: {
    color: 'white',
    fontWeight: '600',
  },
});

export default ConfirmModal;