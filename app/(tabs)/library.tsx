import { getSavedImages } from "@/components/database";
import { ScreenHeader } from "@/components/ScreenHeader";
import { View, Text } from "@/components/Themed";
import React, { useState, useEffect } from "react";
import {
  ScrollView,
  Image,
  Modal,
  TouchableOpacity,
} from "react-native";
import * as FileSystem from "expo-file-system"; // Import expo-file-system
import { ScreenWrapper } from "@/components/ScreenWrapper";
import Colors from "@/constants/Colors";

export default function Library() {
  const [images, setImages] = useState<string[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [base64Image, setBase64Image] = useState<string | null>(null);

  const fetchImages = () => {
    setRefreshing(true);
    const savedImages = getSavedImages();
    setImages(savedImages);
    setRefreshing(false);
  };
  useEffect(() => {
    fetchImages();
  }, []);

  // Convert image URI to Base64 using expo-file-system
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

  return (
    <>
      <ScreenWrapper styles={{ backgroundColor: Colors.light.background }}>
        <ScreenHeader name="Library" button={{ name: 'Refresh', onPress: () => alert('Pressed!') }} />


        <View className="flex flex-row flex-wrap">
          {images.map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => handleImagePress(item)}
              className="p-1"
            >
              <Image source={{ uri: item }} className="w-24 h-24 rounded-md" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Modal for displaying selected image and base64 */}
        <Modal
          visible={!!selectedImage}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setSelectedImage(null)}
        >
          <View className="flex-1 bg-black/50 justify-center items-center">
            <View className="bg-white p-5 rounded-lg items-center">
              {selectedImage && (
                <Image source={{ uri: selectedImage }} className="w-48 h-48 rounded-md mb-4" />
              )}
              {base64Image && (
                <Text className="text-xs text-gray-500 break-all w-48">
                  {base64Image.substring(0, 100)}...
                </Text>
              )}
              <TouchableOpacity
                onPress={() => setSelectedImage(null)}
                className="bg-red-500 px-4 py-2 rounded-md mt-4"
              >
                <Text className="text-white font-semibold">Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

      </ScreenWrapper>

    </>
  );
}
