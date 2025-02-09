import { getSavedImages } from "@/components/database";
import { ScreenHeader } from "@/components/ScreenHeader";
import { View, Text } from "@/components/Themed";
import React, { useState, useEffect } from "react";
import {
  ScrollView,
  Image,
  Modal,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import * as FileSystem from "expo-file-system";
import { ScreenWrapper } from "@/components/ScreenWrapper";
import Colors from "@/constants/Colors";
import axios, { AxiosError } from "axios";
import deleteImagePermanently from "@/components/DeleteImage";

export default function Library() {
  const [images, setImages] = useState<string[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showDelete, setShowDelete] = useState<boolean>(false);
  const [base64Image, setBase64Image] = useState<string | null>(null);
  const [theAxiosError, setAxiosError] = useState<{
    error: boolean, message: string, data?: any
  }>({
    error: false,
    message: "",
    data: null
  });
  const [loading, setLoading] = useState<boolean>(false);

  const fetchImages = () => {
    setRefreshing(true);
    const savedImages = getSavedImages();
    setImages(savedImages);
    setRefreshing(false);
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const handleImagePress = async (uri: string) => {
    try {
      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      setBase64Image(base64);
      setSelectedImage(uri);
    } catch (error) {
      console.error("Error converting image to Base64:", error);
    }
  };

  const decodeMessage = async (base64ImageP: string | null) => {
    setLoading(true);
    try {
      if (!base64ImageP) {
        console.log("base64Image is null");
        return;
      }
      // console.log("base64Image:", base64ImageP);
      // const res = await handleDecryptImage(base64ImageP);
      // console.log(res);

      // WRITE THE STEGANOGRAPHY DECODING LOGIC HERE
      const payload = {
        image: base64ImageP.trim(),
      };

      const response = await axios.post(`${process.env.EXPO_PUBLIC_BACKEND_URL}/decode`, payload);
      console.log(response.data);
      setLoading(false);
      if (response.data.success) {
        Alert.alert('Message Decoded', `"${response.data.decoded_message}"`);
      } else {
        setAxiosError({ error: true, message: response.data.error });
      }
      return;
    } catch (error: any) {
      setLoading(false);
      // console.error("Error decoding message from image:", error);
      if (axios.isAxiosError(error)) {
        const axiosError: AxiosError = error;
        if (axiosError.response) {
          console.error("Error decoding message from image:", axiosError.response.data);
          setAxiosError({ data: axiosError.response.data, error: true, message: 'Error occured' });
        } else {
          setAxiosError({ error: true, message: axiosError.message });
          console.error("Error decoding message from image:", axiosError.message);
        }
      } else {
        console.error("Error decoding message from image:", error);
        setAxiosError({ error: true, message: error.message });
      }
    }
  }

  const deleteImage = async (imageUri: string, images: string[], setImages: (arr: string[]) => void) => {
    await deleteImagePermanently(imageUri, images, setImages)
    setSelectedImage(null)
    setShowDelete(false)
  }


  // useEffect(() => {
  //   if (images.length > 0) {
  //     console.log(images)
  //   }
  // }, [images])

  const axiosErrorfunction = () => {
    if (theAxiosError.error === true) {
      if (theAxiosError.data) {
        alert(theAxiosError.data?.error);
      } else {
        alert(theAxiosError.message);
      }
      setAxiosError({ error: false, message: "", data: null });
    }
  }

  useEffect(() => {
    axiosErrorfunction()
  }, [theAxiosError])

  return (
    <>
      <ScreenWrapper styles={{ backgroundColor: Colors.light.background }}>
        <ScreenHeader name="Library" button={{
          name: 'Refresh', onPress: () => {
            setImages([]);
            fetchImages()
          }
        }} />

        <View className="flex flex-row flex-wrap">
          {images.map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => handleImagePress(item)}
              onLongPress={() => {
                setSelectedImage(item)
                setShowDelete(true)
              }}
              className="p-1"
            >
              <Image source={{ uri: item }} className="w-24 h-24 rounded-md" />
            </TouchableOpacity>
          ))}
        </View>

        <Modal
          visible={!!selectedImage}
          transparent={true}
          animationType="slide"
          onRequestClose={() => {
            setSelectedImage(null);
            setBase64Image(null);
          }}
        >
          <View className="flex-1 bg-black/50 justify-center items-center">
            <View className="bg-white p-5 rounded-lg items-center">
              {selectedImage && (
                <Image source={{ uri: selectedImage }} className="w-48 h-48 rounded-md mb-4" />
              )}
              <TouchableOpacity
                onPress={() => base64Image && decodeMessage(base64Image)}
                className="bg-blue-100 px-4 py-2 rounded-md mt-4"
              >
                <Text className="text-blue-500 font-semibold text-base">{loading ? <ActivityIndicator size={25} /> : 'Decode Message'}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setSelectedImage(null);
                  setBase64Image(null);
                }}
                className="bg-red-500 px-4 py-2 rounded-md mt-4"
              >
                <Text className="text-white font-semibold">Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* modal to pop up the delete button */}
        <Modal
          visible={showDelete}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowDelete(false)}
        >
          <View className="flex-1 bg-black/50 justify-center items-center">
            <View className="bg-white p-5 rounded-lg items-center">
              <TouchableOpacity
                onPress={() => {
                  if (selectedImage) {
                    deleteImage(selectedImage, images, setImages);
                  }
                }}
                className="bg-red-500 px-4 py-2 rounded-md mt-4"
              >
                <Text className="text-white font-semibold">Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

      </ScreenWrapper>
    </>
  );
}
