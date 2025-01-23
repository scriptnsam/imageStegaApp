import React, { createContext, useContext, useState, ReactNode, useRef, useEffect } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { authenticate } from './VerifyFingerPrint';
import { useNavigation } from 'expo-router';

interface AppContextProps {
  isReady: boolean;
  setIsReady: (ready: boolean) => void;
  isImagePickerActive: boolean;
  setIsImagePickerActive: (active: boolean) => void;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isReady, setIsReady] = useState(false);
  const [isImagePickerActive, setIsImagePickerActive] = useState(false);
  const appState = useRef(AppState.currentState);
  const navigation = useNavigation();
  const lastImagePickerActive = useRef(false);

  // Listen for AppState changes
  const handleAppStateChange = (nextAppState: AppStateStatus) => {
    if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
      // Ensure isImagePickerActive is checked correctly
      setTimeout(() => {
        if (!lastImagePickerActive.current) {
          console.log("isReady: ", isReady);
          authenticate(navigation, setIsReady); // Trigger authentication
        } else {
          console.log("Image picker was active previously, skipping authentication.");
        }
      }, 300); // Add a small delay (300ms) to ensure the app is fully back

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
