import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/components/useColorScheme';
import { AppProvider, useAppContext } from '@/components/AppContext'; // Only import AppProvider here

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  initialRouteName: 'index',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    Epilogue: require('../assets/fonts/Epilogue-Regular.ttf'),
    InclusiveSans: require('../assets/fonts/InclusiveSans-Regular.ttf'),
    ...FontAwesome.font,
  });

  // Handle any errors thrown during font loading.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  // Hide the splash screen once fonts are loaded.
  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null; // Show nothing while loading
  }

  return (
    <AppProvider>
      {/* Wrap the entire layout with AppProvider */}
      <RootLayoutNav />
    </AppProvider>
  );
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const { isReady } = useAppContext(); // Call useAppContext here

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        {isReady ? (
          <Stack.Screen
            name="(tabs)"
            options={{ headerShown: false }}
          />
        ) : (
          <Stack.Screen
            name='index'
          />
        )}
      </Stack>
    </ThemeProvider>
  );
}
