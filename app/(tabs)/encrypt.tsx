import {
  Alert,
  Image,
  Pressable,
  TextInput,
  ActivityIndicator,
  Button,
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
import axios, { AxiosError } from "axios";
import * as ImageManipulator from 'expo-image-manipulator'

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
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert("Permission to access camera roll is required!");
      return;
    }

    setIsImagePickerActive(true);

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      base64: false, // Base64 will be generated after conversion
    });

    if (!result.canceled) {
      try {
        // Convert image to PNG using ImageManipulator
        // Get file extension from URI
        const fileExtension = result.assets[0].uri.split('.').pop()?.toLowerCase();

        // Only convert if not already PNG
        if (fileExtension !== 'png') {
          // Convert image to PNG using ImageManipulator
          const manipResult = await ImageManipulator.manipulateAsync(
            result.assets[0].uri,
            [], // no transformations needed
            { format: ImageManipulator.SaveFormat.PNG, base64: true }
          );
          setImageBase64(manipResult.base64); // Store base64-encoded PNG
          setSelectedImage(manipResult.uri); // Store converted image URI
        } else {
          const manipResult = {
            uri: result.assets[0].uri,
            base64: result.assets[0].base64
          }
          setImageBase64(manipResult.base64); // Store base64-encoded PNG
          setSelectedImage(manipResult.uri); // Store converted image URI
        }

      } catch (error) {
        console.error("Error converting image to PNG:", error);
        Alert.alert("Error", "Could not process the image. Try again.");
      }
    } else {
      console.log("Image picker was cancelled.");
    }
  };


  useEffect(() => {
    console.log(isImagePickerActive);
  }, [isImagePickerActive]);

  const handleEncrypt = async () => {
    setIsImagePickerActive(false);

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
        if (axios.isAxiosError(error)) {
          const axiosError = error;
          if (axiosError.response) {
            console.error("Error encrypting image:", axiosError.response.data);
          } else {
            console.error("Error encrypting image:", axiosError.message);
          }
        }
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
        console.log('filename:', data.saved_filename);
        // save image to device
        await saveImageToDevice({ encodedImageData: data.encoded_image });
        setImageBase64("");
        setInputValue("");

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

    } catch (error) {
      console.error("Error during encryption:", error);
      if (axios.isAxiosError(error)) {
        const axiosError: AxiosError = error;
        if (axiosError.response) {
          console.error("Error encrypting image:", axiosError.response.data);
        } else {
          console.error("Error encrypting image:", axiosError.message);
        }
      }
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
        <View className="self-center mt-8 w-48 h-12 items-center justify-center bg-teal-500 rounded-md">
          <Text className="font-inclusiveSans text-lg text-white">
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


      {imageBase64 === "" || inputValue === "" ? (
        <View className="self-center mt-12 bg-teal-500 opacity-70 mb-12 rounded items-center justify-center w-64 h-14 opacity-1">
          <Text className="text-white text-lg font-inclusiveSans">
            {!loading ? "Encrypt" : <ActivityIndicator size={16} />}
          </Text>
        </View>
      ) : (
        <Pressable
          onPress={loading ? () => { } : handleEncrypt}
        >
          <View className="self-center mt-12 bg-teal-500 mb-12 rounded items-center justify-center w-64 h-14 opacity-1">
            <Text className="text-white text-lg font-inclusiveSans">
              {!loading ? "Encrypt" : <ActivityIndicator size={16} />}
            </Text>
          </View>
        </Pressable>
      )}


    </ScreenWrapper>
  );
};

export default EncryptTab;
