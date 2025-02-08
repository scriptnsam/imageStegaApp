import { getSavedImages } from "@/components/database";
import { ScreenHeader } from "@/components/ScreenHeader";
import { View, Text } from "@/components/Themed";
import React, { useState, useCallback } from "react";
import {
  FlatList,
  Image,
  Modal,
  TouchableOpacity,
} from "react-native";
import RNFS from "react-native-fs"; // Import react-native-fs
import { useFocusEffect } from "@react-navigation/native";

export default function Library() {
  const [images, setImages] = useState<string[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [base64Image, setBase64Image] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      const fetchImages = () => {
        setRefreshing(true);
        const savedImages = getSavedImages();
        setImages(savedImages);
        setRefreshing(false);
      };

      fetchImages();
    }, [])
  );

  // Convert image URI to Base64
  const handleImagePress = async (uri: string) => {
    try {
      const base64 = await RNFS.readFile(uri, "base64");
      setBase64Image(base64);
      setSelectedImage(uri);
    } catch (error) {
      console.error("Error converting image to Base64:", error);
    }
  };

  return (
    <>
      <ScreenHeader name="Library" />
      <FlatList
        data={images}
        keyExtractor={(item, index) => index.toString()}
        numColumns={3}
        refreshing={refreshing}
        onRefresh={async () => {
          const savedImages = await getSavedImages();
          setImages(savedImages);
        }}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleImagePress(item)} className="p-1">
            <Image source={{ uri: item }} className="w-24 h-24 rounded-md" />
          </TouchableOpacity>
        )}
      />

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
    </>
  );
}
