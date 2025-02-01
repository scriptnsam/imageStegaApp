import { getSavedImages } from "@/components/database";
import { ScreenHeader } from "@/components/ScreenHeader";
import { ScreenWrapper } from "@/components/ScreenWrapper";
import { View, Text } from "@/components/Themed";
import Colors from "@/constants/Colors";
import { useEffect, useState } from "react";
import { FlatList, Image, StyleSheet } from "react-native";
import React from "react";
import { useFocusEffect } from "expo-router";

export default function Library() {
  const [images, setImages] = useState<string[]>([]);

  useFocusEffect(() => {
    const fetchImages = async () => {
      const savedImages = await getSavedImages();
      setImages(savedImages);
    };

    fetchImages();
  });




  return (
    // <ScreenWrapper styles={styles.container}>
    <>
      <ScreenHeader name="Library" />
      <FlatList
        data={images}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <Image source={{ uri: item }} style={{ width: 100, height: 100, margin: 5 }} />
        )}
        numColumns={3}
      />
    </>

    // </ScreenWrapper>
  )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background
  }
})