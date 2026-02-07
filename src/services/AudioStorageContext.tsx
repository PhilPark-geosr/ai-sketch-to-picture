// services/AudioStorageContext.tsx

import React, { createContext, useContext, useMemo } from 'react';
import { IAudioStorageService } from './IAudioStorageService';
import { AudioStorageService } from './AudioStorageService';

// null로 초기화 (Provider 필수로 만듦)
const AudioStorageContext = createContext<IAudioStorageService | null>(null);

// Provider
export const AudioStorageProvider = ({ 
  service, 
  children 
}: { 
  service?: IAudioStorageService;
  children: React.ReactNode;
}) => {
  // useMemo로 인스턴스 재생성 방지 (리렌더링 시에도 같은 인스턴스 유지)
  const defaultService = useMemo(() => new AudioStorageService(), []);
  
  return (
    <AudioStorageContext.Provider value={service ?? defaultService}>
      {children}
    </AudioStorageContext.Provider>
  );
};

// Hook - Provider 없이 사용하면 에러 발생
export const useAudioStorage = (): IAudioStorageService => {
  const context = useContext(AudioStorageContext);
  
  if (!context) {
    throw new Error(
      'useAudioStorage는 AudioStorageProvider 안에서 사용해야 합니다. ' +
      'App.tsx에서 AudioStorageProvider로 감싸주세요.'
    );
  }
  
  return context;
};