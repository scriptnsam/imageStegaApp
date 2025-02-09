import { useAppContext } from "@/components/AppContext";
import { ScreenHeader } from "@/components/ScreenHeader";
import { Text, View } from "@/components/Themed";
import React, { useState } from "react";
import { Alert, Image, Pressable, ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import useRequest from "@/hooks/useRequest";

export default function DecryptScreen() {
  const [image, setImage] = useState("");
  const [selectedImage, setSelectedImage] = useState(false);
  const { setIsImagePickerActive, isImagePickerActive } = useAppContext();
  const [imageBase64, setImageBase64] = useState<Base64Prop>("");
  const [message, setMessage] = useState("");
  const [messageSet, setMessageSet] = useState(false);
  const { data, error, loading, request } = useRequest();

  type Base64Prop = string | null | undefined;

  const handleImageUpload = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert("Permission to access camera roll is required!");
      return;
    }

    // Set image picker active before picking image
    setIsImagePickerActive(true);

    // Wait for the image picker to complete and check the state after setting it
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 1,
      base64: true,
    });

    // If image is selected, update the selected image and base64 data
    if (!result.canceled) {
      setImageBase64(result.assets[0].base64);
      setImage(result.assets[0].uri);
      setSelectedImage(true);
    } else {
      // If the picker was cancelled, make sure the authentication doesn't trigger
      console.log(
        "Image picker was cancelled, authentication will not trigger."
      );
    }

    setTimeout(() => {
      setIsImagePickerActive(false);
    }, 2000)
  };

  const handleDecryptImage = async () => {
    const payload = {
      image: imageBase64,
    };

    try {
      await request(`${process.env.EXPO_PUBLIC_BACKEND_URL}/decode`, "POST", payload);

      if (error) {
        console.log(error);
        // Extract error message from axios error response
        // const errorMessage = error.response?.data?.message || error.message || "Something went wrong";
        const errorMessage = error.response.data.error;
        console.log(errorMessage);
        Alert.alert("Error", errorMessage || "Something went wrong. Please try again.");
        return;
      }

      if (data) {
        console.log(data);

        Alert.alert(
          "Decryption successful!",
          "The image has been decrypted.",
          [
            {
              text: "Great!",
              onPress: () => {
                setImageBase64("");
                setSelectedImage(false);
                setMessage(data.decoded_message);
                setMessageSet(true);
              },
            },
          ],
          { cancelable: false }
        );
      }

    } catch (error) {
      console.error("Error during decryption:", error);
    }
  }

  const imageSource =
    selectedImage && image !== ""
      ? { uri: image }
      : require("@/assets/images/dummy_image.png");
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {/* Header */}
        <ScreenHeader name="Decrypt Image" />

        <Pressable onPress={() => handleImageUpload()}>
          <View className="items-center w-10/12 p-4 rounded-md m-auto my-12 bg-light-cardBackground border border-primary">
            <Text className="text-light-text text-lg">
              Select Encrypted Image
            </Text>
          </View>
        </Pressable>

        {selectedImage && (
          <>
            <Pressable onPress={() => handleImageUpload()}>
              <View
                className={`bg-transparent ${selectedImage ? "w-36 h-36" : "w-24 h-24"
                  } self-center rounded-lg overflow-hidden`}
              >
                <Image source={imageSource} className={`w-full h-full `} />
              </View>
            </Pressable>

            <Pressable onPress={() => handleDecryptImage()}>
              <View className="items-center w-10/12 p-4 rounded-md m-auto my-12 bg-light-cardBackground border border-primary">
                <Text className="text-light-text text-lg">{loading ? 'Working, Please wait...' : 'Decrypt Image'}</Text>
              </View>
            </Pressable>
          </>
        )}


        {messageSet && (
          <View className="bg-green-600 p-4 rounded-md m-4">
            {/* clear button */}
            <Pressable onPress={() => {
              setMessageSet(false)
              setMessage("")
            }
            }>
              <Text className="text-white p-1 rounded text-sm bg-rose-500 hover:bg-rose-800 ml-auto">Clear</Text>
            </Pressable>
            <Text className="text-white text-lg">Decrypted Message:</Text>

            <Text className="text-neutral-200 text-[15px] mt-2 italic underline">"{message}"</Text>
          </View>

        )}

      </ScrollView>
    </SafeAreaView >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
