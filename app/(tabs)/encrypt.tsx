import {
  Alert,
  Image,
  Pressable,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { useEffect, useState } from "react";
import { View, Text } from "@/components/Themed";
import Colors from "@/constants/Colors";
import * as ImagePicker from "expo-image-picker";
import { useAppContext } from "@/components/AppContext";
import { ScreenHeader } from "@/components/ScreenHeader";
import { ScreenWrapper } from "@/components/ScreenWrapper";
import { useNavigation } from "expo-router";
import { NavigationProp } from "@react-navigation/native";
import useRequest from "@/hooks/useRequest";
import saveImageToDevice from "@/components/SaveImage";

type Base64Prop = string | null | undefined;

type RootStackParamList = {
  library: undefined;
  decrypt: undefined;
  home: undefined;
};

type Props = {
  navigation: NavigationProp<RootStackParamList>;
};

const EncryptTab = () => {
  const [selectedImage, setSelectedImage] = useState("");
  const [imageBase64, setImageBase64] = useState<Base64Prop>("");
  const { setIsImagePickerActive, isImagePickerActive } = useAppContext();
  const [inputValue, setInputValue] = useState("");
  const { data, error, loading, request } = useRequest();

  const navigation = useNavigation<Props["navigation"]>();

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
      setSelectedImage(result.assets[0].uri);
    } else {
      // If the picker was cancelled, make sure the authentication doesn't trigger
      console.log(
        "Image picker was cancelled, authentication will not trigger."
      );
    }
  };

  useEffect(() => {
    console.log(isImagePickerActive);
  }, [isImagePickerActive]);

  const handleEncrypt = async () => {
    if (imageBase64 === "" || inputValue === "") {
      Alert.alert("Error", "Please select an image and enter a message.");
      setIsImagePickerActive(false);
      return;
    }

    const payload = {
      image: imageBase64,
      message: inputValue,
    };

    try {
      await request(`${process.env.EXPO_PUBLIC_BACKEND_URL}/encode`, "POST", payload);

      if (error) {
        console.log(error);
        Alert.alert("Error", "Something went wrong. Please try again.");
        setIsImagePickerActive(false);
        return;
      }
      if (loading) {
        Alert.alert("Loading", "Please wait...");
        setIsImagePickerActive(false);
        return;
      }
      if (data) {
        console.log(data.encoded_image_name);
        // save image to device
        await saveImageToDevice({ encodedImageData: data.encoded_image })

        Alert.alert(
          "Encryption successful!",
          "The image has been encrypted.",
          [
            {
              text: "Great!",
              onPress: () => {
                setImageBase64("");
                setSelectedImage("");
                setInputValue("");
              },
            },
          ],
          { cancelable: false }
        );
      }

      setIsImagePickerActive(false);
    } catch (error) {
      console.error("Error during encryption:", error);
      setIsImagePickerActive(false);
    }
  };

  const imageSource =
    selectedImage && selectedImage !== ""
      ? { uri: selectedImage }
      : require("@/assets/images/dummy_image.png");

  return (
    <ScreenWrapper styles={{ backgroundColor: Colors.light.background }}>
      <ScreenHeader name="Encrypt Image" />

      {/* Image section */}
      <Pressable onPress={handleImageUpload}>
        <View className="w-44 h-44 items-center justify-center self-center mt-12 bg-secondary rounded-md">
          <Image
            source={imageSource}
            className={selectedImage ? "w-36 h-36" : "w-24 h-24"}
          />
        </View>
      </Pressable>

      <Pressable onPress={handleImageUpload}>
        <View className="self-center mt-8 w-48 h-12 border border-primary items-center justify-center bg-light-cardBackground rounded-md">
          <Text className="font-inclusiveSans text-lg text-primary">
            Upload Image
          </Text>
        </View>
      </Pressable>

      {/* Text input field */}
      <View className="bg-transparent">
        <TextInput
          className="h-24 w-72 self-center mt-20 border border-primary rounded-md text-primary font-inclusiveSans text-base p-2 bg-secondary"
          value={inputValue}
          onChangeText={setInputValue}
          placeholder="Input text to encrypt..."
          placeholderTextColor="#aaa"
          multiline
          numberOfLines={4}
        />
      </View>

      <Pressable
        className="bg-transparent"
        onPress={loading ? () => { } : handleEncrypt}
      >
        <View className="self-center mt-12 bg-light-cardBackground mb-12 border border-primary p-2 rounded-3xl items-center justify-center w-64 h-14 opacity-1">
          <Text className="text-primary text-lg font-inclusiveSans">
            {!loading ? "Encrypt" : <ActivityIndicator size={16} />}
          </Text>
        </View>
      </Pressable>
    </ScreenWrapper>
  );
};

export default EncryptTab;
