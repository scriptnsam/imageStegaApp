// AppContext.tsx or AppProvider.tsx
import React, { createContext, useContext, useState, ReactNode, useRef, useEffect } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { authenticate } from './VerifyFingerPrint';
import { useNavigation } from 'expo-router';

interface AppContextProps {
  isReady: boolean;
  setIsReady: (ready: boolean) => void;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isReady, setIsReady] = useState(false);
  const appState = useRef(AppState.currentState)
  const navigation = useNavigation();

  // Listen for AppState changes
  const handleAppStateChange = (nextAppState: AppStateStatus) => {
    if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
      console.log("isReady: ", isReady)
      authenticate(navigation, setIsReady); // Trigger authentication when app comes back to the foreground
    }
    appState.current = nextAppState;
  };

  useEffect(() => {
    console.log("isReady: ", isReady)
  }, [isReady])

  useEffect(() => {
    // Add listener for app state changes
    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      // Remove listener when component unmounts
      subscription.remove();
    };
  }, []);

  return (
    <AppContext.Provider value={{ isReady, setIsReady }}>
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
