import { Image, Pressable } from "react-native";
import { Text, View } from "@/components/Themed";
import { SafeAreaView } from "react-native-safe-area-context";
import Colors from "@/constants/Colors";
import { authenticate } from "@/components/VerifyFingerPrint";
import { useNavigation } from "expo-router";
import { useAppContext } from "@/components/AppContext";
import { useEffect } from "react";
import { initializeDatabase } from "@/components/database";

export default function WelcomeScreen() {
  const navigation = useNavigation();
  const { setIsReady } = useAppContext();

  useEffect(() => {
    initializeDatabase();
  }, [])

  return (
    <SafeAreaView className="flex-1 bg-gray-100 items-center">
      {/* Logo */}
      <Image
        source={require("@/assets/images/icon.png")}
        className="w-72 h-12 mt-10"
        resizeMode="contain"
      />

      {/* Hero Image */}
      <Image
        source={require("@/assets/images/man-with-phone.png")}
        className="w-64 h-72 mt-6"
        resizeMode="contain"
      />

      {/* Description */}
      <View className="w-11/12 mt-12 bg-transparent">
        <Text className="text-center text-lg text-gray-700 tracking-wide font-medium">
          Hide your sensitive data within images, secured with steganography and fingerprint authentication.
        </Text>
        <Text className="text-center text-lg text-gray-900 mt-2 font-bold">
          Your privacy, redefined.
        </Text>
      </View>

      {/* Verify Button */}
      <Pressable
        onPress={() => {
          authenticate(navigation, setIsReady);
        }}
        className="bg-indigo-500 py-4 px-8 rounded-full mt-10 shadow-md shadow-indigo-300"
      >
        <Text className="text-white text-lg font-semibold">
          Verify Fingerprint
        </Text>
      </Pressable>
    </SafeAreaView>
  );
}