import { StyleSheet, Image, Pressable, ScrollView, Animated } from 'react-native';

import { Text, View } from '@/components/Themed';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '@/constants/Colors';
import { useEffect, useRef, useState } from 'react';
import { useNavigation } from 'expo-router';
import { NavigationProp } from '@react-navigation/native';

type RootStackParamList = {
  encrypt: undefined; // Screen with no params
  decrypt: undefined; // Screen with no params
  // Add other routes as needed
};

type Props = {
  navigation: NavigationProp<RootStackParamList>;
};

export default function HomeScreen() {
  const navigation = useNavigation<Props['navigation']>()
  // Create refs for animated values
  const scaleAnim1 = useRef(new Animated.Value(1)).current; // Scale for first button
  const scaleAnim2 = useRef(new Animated.Value(1)).current; // Scale for second button
  const shakeAnim = useRef(new Animated.Value(0)).current; // Shake animation


  // Handle button press in animation for first button
  const onPressIn1 = () => {
    Animated.spring(scaleAnim1, {
      toValue: 0.95, // Scale down on press
      useNativeDriver: true,
    }).start();
  };

  const onPressOut1 = () => {
    Animated.spring(scaleAnim1, {
      toValue: 1, // Scale back to normal size
      useNativeDriver: true,
    }).start();
  };

  // Handle button press in animation for second button
  const onPressIn2 = () => {
    Animated.spring(scaleAnim2, {
      toValue: 0.95, // Scale down on press
      useNativeDriver: true,
    }).start();
  };

  const onPressOut2 = () => {
    Animated.spring(scaleAnim2, {
      toValue: 1, // Scale back to normal size
      useNativeDriver: true,
    }).start();
  };

  // Shaking effect for the lock image
  useEffect(() => {
    const shake = () => {
      shakeAnim.setValue(0); // Reset the animation
      Animated.timing(shakeAnim, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      }).start(() => {
        // Loop the shaking effect
        shake(); // Call the shake function again for continuous shaking
      });
    };

    shake(); // Start the shaking effect

    // Cleanup function to stop shaking when the component unmounts
    return () => {
      shakeAnim.setValue(0);
    };
  }, [shakeAnim]);

  // Interpolating the shaking animation to create a shaking effect
  const shakeInterpolate = shakeAnim.interpolate({
    inputRange: [0, 3],
    outputRange: [-15, 15], // Adjust the shaking range (in pixels)
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {/* Lock button Image */}
        <Animated.Image source={require('@/assets/images/lock_button.png')} style={[styles.lockBtn, { transform: [{ translateX: shakeInterpolate }] }]} />
        {/* Welcome Text */}
        <Text style={styles.welcome}>Welcome back to InvisVault!</Text>

        {/* Encypt and Decrypt buttons */}
        <Pressable
          onPress={() => navigation.navigate('encrypt')}
          onPressIn={onPressIn1}
          onPressOut={onPressOut1}
        >
          <Animated.View style={[styles.CTA, { marginVertical: 62, backgroundColor: Colors.secondary, transform: [{ scale: scaleAnim1 }] }]}>
            <Image source={require('@/assets/images/Encrypt.png')} style={{ width: 50, height: 50 }} />
            <Text style={styles.inclusiveSans}>Encrypt Image</Text>
          </Animated.View>
        </Pressable>

        <Pressable
          onPress={() => navigation.navigate('decrypt')}
          onPressIn={onPressIn2}
          onPressOut={onPressOut2}
        >
          <Animated.View style={[styles.CTA, { backgroundColor: Colors.accent, transform: [{ scale: scaleAnim2 }] }]}>
            <Image source={require('@/assets/images/Unlock.png')} style={{ width: 50, height: 50 }} />
            <Text style={styles.inclusiveSans}>Decrypt Image</Text>
          </Animated.View>
        </Pressable>

        {/* Recent Activity */}
        <Text style={[styles.inclusiveSans, { marginTop: 60, fontSize: 20 }]}>Recent Activity</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background
  },
  lockBtn: {
    width: 177,
    height: 171,
    alignSelf: 'center',
    marginVertical: 24
  },
  welcome: {
    fontFamily: 'InclusiveSans',
    fontSize: 24,
    alignSelf: 'center'
  },
  CTA: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    alignSelf: 'center',
    width: '90%',
    height: 120,
    borderRadius: 8,
    marginHorizontal: 16,
  },
  CTAHover: {
    opacity: 0.5,
    transform: [{ scale: 0.9 }]
  },
  inclusiveSans: {
    fontFamily: 'InclusiveSans',
    fontSize: 24
  }
});
