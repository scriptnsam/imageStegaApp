import { StyleSheet, Image, Pressable } from "react-native";
import { View, Text } from "@/components/Themed";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import Colors from "@/constants/Colors";
import { authenticate } from "@/components/VerifyFingerPrint";
import { useNavigation } from "expo-router";
import { useAppContext } from "@/components/AppContext";


export default function WelcomeScreen() {
  const navigation = useNavigation();
  const { setIsReady } = useAppContext();
  return (
    <SafeAreaView style={styles.container}>
      {/* Logo */}
      <Image source={require("@/assets/images/icon.png")} style={styles.logo} />
      {/* Man with phone picture */}
      <Image source={require("@/assets/images/man-with-phone.png")} style={styles.hero} />

      {/* description container */}
      <View style={styles.desc}>
        <Text style={styles.desc_text}>Hide your sensitive data within images, secured with steganography and fingerprint authentication.</Text>

        {/* Add a line break */}
        <Text style={styles.desc_text}>{"\n"}</Text>
        <Text style={[styles.desc_text, { fontWeight: "800" }]}>Your privacy, redefined.</Text>
      </View>

      {/* Verify Button */}
      <Pressable
        onPress={() => {
          authenticate(navigation, setIsReady)
        }}
      >
        <View style={styles.verify_btn}>
          <Text style={{ color: Colors.secondary, fontSize: 20, fontFamily: 'InclusiveSans' }}>Verify Fingerprint</Text>
        </View>
      </Pressable>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: Colors.light.background
  },
  logo: {
    width: 280,
    height: 52,
    marginVertical: 33
  },
  hero: {
    width: 255,
    height: 290
  },
  desc: {
    width: 350,
    height: 90,
    marginVertical: 62
  },
  desc_text: {
    textAlign: "center",
    letterSpacing: 2,
    fontFamily: 'Epilogue',
    fontSize: 16,
  },
  verify_btn: {
    backgroundColor: Colors.primary,
    padding: 5,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center', // Align text in the center of the button
    width: 254,
    height: 53,
    opacity: 1
  }
})