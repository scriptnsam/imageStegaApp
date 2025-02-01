import { useAppContext } from "@/components/AppContext";
import { ScreenHeader } from "@/components/ScreenHeader";
import { Text, View } from "@/components/Themed";
import React, { useState } from "react";
import { Alert, Image, Pressable, ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";

export default function DecryptScreen() {
  const [image, setImage] = useState("");
  const [selectedImage, setSelectedImage] = useState(false);
  const { setIsImagePickerActive, isImagePickerActive } = useAppContext();
  const [imageBase64, setImageBase64] = useState<Base64Prop>("");

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
      allowsEditing: true,
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
  };

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
            <View
              className={`bg-transparent border ${
                selectedImage ? "w-36 h-36" : "w-24 h-24"
              } self-center rounded-lg border-orange-600`}
            >
              <Image source={imageSource} className={`w-full h-full `} />
            </View>

            <View className="items-center w-10/12 p-4 rounded-md m-auto my-12 bg-light-cardBackground border border-primary">
              <Text className="text-light-text text-lg">Decrypt Image</Text>
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
