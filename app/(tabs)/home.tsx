import { Pressable, Animated, Image } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useNavigation } from 'expo-router';
import { NavigationProp } from '@react-navigation/native';
import { ScreenWrapper } from '@/components/ScreenWrapper';;
import { useRef } from 'react';
import Colors from '@/constants/Colors';

type RootStackParamList = {
  encrypt: undefined;
  decrypt: undefined;
  profile: undefined;
};

type Props = {
  navigation: NavigationProp<RootStackParamList>;
};

export default function HomeScreen() {
  const navigation = useNavigation<Props['navigation']>();
  const scaleAnim1 = useRef(new Animated.Value(1)).current;
  const scaleAnim2 = useRef(new Animated.Value(1)).current;

  const handlePressIn = (anim: Animated.Value) => {
    Animated.spring(anim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = (anim: Animated.Value) => {
    Animated.spring(anim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  return (
    <ScreenWrapper styles={{ backgroundColor: Colors.light.background, color: Colors.light.text }}>

      {/* Lock Animation */}
      <Animated.Image
        source={require('@/assets/images/lock_button.png')}
        style={{ width: 160, height: 160, alignSelf: 'center', marginVertical: 24 }}
      />

      {/* Welcome Text */}
      <Text className="text-2xl font-bold text-center mb-6 text-gray-800">Welcome back to InvisVault!</Text>

      {/* Encrypt Button */}
      <Pressable
        onPress={() => navigation.navigate('encrypt')}
        onPressIn={() => handlePressIn(scaleAnim1)}
        onPressOut={() => handlePressOut(scaleAnim1)}
      >
        <Animated.View className="flex-row items-center justify-between bg-cyan-200 py-4 px-5 rounded-xl shadow-lg mb-4 w-11/12 m-auto">
          <Image source={require('@/assets/images/Encrypt.png')} className="w-12 h-12" />
          <Text className="text-lg font-semibold text-light-text text-center flex-1">Encrypt Image</Text>
        </Animated.View>
      </Pressable>

      {/* Decrypt Button */}
      <Pressable
        onPress={() => navigation.navigate('decrypt')}
        onPressIn={() => handlePressIn(scaleAnim2)}
        onPressOut={() => handlePressOut(scaleAnim2)}
      >
        <Animated.View className="flex-row items-center justify-between bg-cyan-600 py-4 px-5 rounded-xl shadow-lg mb-4 w-11/12 m-auto mt-4">
          <Image source={require('@/assets/images/Unlock.png')} className="w-12 h-12" />
          <Text className="text-lg font-semibold text-light-text text-center flex-1">Decrypt Image</Text>
        </Animated.View>
      </Pressable>

      {/* Recent Activity */}
      <Text className="text-xl font-semibold text-center text-light-text mt-8">Recent Activity</Text>
      <View className="bg-[#fed7aa] rounded-xl p-4 my-4 shadow-lg w-3/4 m-auto mt-3">
        <Text className="text-lg text-center text-light-text">No recent activity yet. Start encrypting or decrypting images!</Text>
      </View>

      {/* Quick Actions */}
      <Text className="text-xl font-semibold text-center text-light-text mt-8">Quick Actions</Text>
      <View className="flex-row justify-between my-4 bg-transparent">
        <Pressable className="flex-1 items-center justify-center bg-cyan-200 py-3 rounded-xl mx-2">
          <Image source={require('@/assets/images/Profile.png')} className="w-9 h-9 mb-2" />
          <Text className="text-sm font-medium text-light-text">Profile</Text>
        </Pressable>
        <Pressable className="flex-1 items-center justify-center bg-secondary py-3 rounded-xl mx-2">
          <Image source={require('@/assets/images/Help.png')} className="w-9 h-9 mb-2" />
          <Text className="text-sm font-medium text-light-text">Help</Text>
        </Pressable>
        <Pressable className="flex-1 items-center justify-center bg-accent py-3 rounded-xl mx-2">
          <Image source={require('@/assets/images/Settings.png')} className="w-9 h-9 mb-2" />
          <Text className="text-sm font-medium text-light-text">Settings</Text>
        </Pressable>
      </View>

      {/* Tips Section */}
      <Text className="text-xl font-semibold text-center text-light-text mt-8">Tips</Text>
      <View className="bg-[#fed7aa] rounded-xl p-4 shadow-lg w-11/12 m-auto my-5">
        <Text className="text-lg text-center text-light-text">
          Did you know? InvisVault secures your data with advanced steganography algorithms!
        </Text>
      </View>
    </ScreenWrapper>
  );
}