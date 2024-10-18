import React, { createContext, useContext, useState, ReactNode, useRef, useEffect } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { authenticate } from './VerifyFingerPrint';
import { useNavigation } from 'expo-router';

interface AppContextProps {
  isReady: boolean;
  setIsReady: (ready: boolean) => void;
  isImagePickerActive: boolean; // Add this to track image picker state
  setIsImagePickerActive: (active: boolean) => void; // Function to update it
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isReady, setIsReady] = useState(false);
  const [isImagePickerActive, setIsImagePickerActive] = useState(false);
  const appState = useRef(AppState.currentState);
  const navigation = useNavigation();
  const lastImagePickerActive = useRef(false); // Ref to track last image picker state

  // Listen for AppState changes
  const handleAppStateChange = (nextAppState: AppStateStatus) => {
    if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
      // Only authenticate if the last state was active
      if (lastImagePickerActive.current) {
        console.log("Image picker was active previously, skipping authentication.");
      } else {
        console.log("isReady: ", isReady);
        authenticate(navigation, setIsReady); // Trigger authentication
      }
    }
    appState.current = nextAppState;
  };

  useEffect(() => {
    // Update the ref whenever isImagePickerActive changes
    lastImagePickerActive.current = isImagePickerActive;
  }, [isImagePickerActive]);

  useEffect(() => {
    // Add listener for app state changes
    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      // Remove listener when component unmounts
      subscription.remove();
    };
  }, []);

  return (
    <AppContext.Provider value={{ isReady, setIsReady, isImagePickerActive, setIsImagePickerActive }}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to use the AppContext
export const useAppContext = (): AppContextProps => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
