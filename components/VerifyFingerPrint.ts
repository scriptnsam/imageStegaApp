import * as LocalAuthentication from 'expo-local-authentication'
import { Alert } from "react-native";

export const authenticate = async (navigation: any, setIsReady: (ready: boolean) => void) => {
  const fallback = () => {
    navigation.navigate('WelcomeScreen', { screen: 'WelcomeScreen' });
  }
  try {
    const hasHardware = await LocalAuthentication.hasHardwareAsync();

    if (!hasHardware) {
      Alert.alert('Error', 'Your device does not support biometric authentication');
      fallback()
    }

    const isEnrolled = await LocalAuthentication.isEnrolledAsync();
    if (!isEnrolled) {
      Alert.alert('Error', 'No biometrics enrolled');
      fallback()
    }

    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Authenticate With Fingerprint',
      cancelLabel: 'Cancel',
      disableDeviceFallback: true,
    });

    if (result.success) {
      setIsReady(true);

      // Delay navigation after success
      setTimeout(() => {
        navigation.replace('(tabs)');
      }, 1000);
    } else {
      if (result.error === 'user_cancel' || result.error === 'user_fallback') {
        // Handle user cancellation
        fallback()
      } else {
        Alert.alert('Error', 'Authentication failed');
        fallback()
      }
    }
  } catch (error) {
    Alert.alert('Error', 'Authentication failed');
    fallback()
  }
};
