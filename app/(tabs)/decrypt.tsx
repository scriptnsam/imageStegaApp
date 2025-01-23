import { ScreenHeader } from "@/components/ScreenHeader"
import { Text, View } from "@/components/Themed"
import React, { useState } from "react"
import { Image, Pressable, ScrollView, StyleSheet } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

export default function DecryptScreen() {
  const [image, setImage] = useState('')
  const [selectedImage, setSelectedImage] = useState(false)


  const imageSource = selectedImage && image !== ''
    ? { uri: image }
    : require('@/assets/images/dummy_image.png');
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {/* Header */}
        <ScreenHeader name="Decrypt Image" />


        <Pressable onPress={() => setSelectedImage(!selectedImage)}>
          <View className="items-center w-10/12 p-4 rounded-md m-auto my-12 bg-light-cardBackground border border-primary">
            <Text className="text-light-text text-lg">Select Encrypted Image</Text>
          </View>
        </Pressable>


        {selectedImage && (

          <>
            <View className={`bg-transparent border ${selectedImage ? 'w-36 h-36' : 'w-24 h-24'} self-center rounded-lg border-orange-600`}>
              <Image source={imageSource} className={`w-full h-full `} />
            </View>


            <View className="items-center w-10/12 p-4 rounded-md m-auto my-12 bg-light-cardBackground border border-primary">
              <Text className="text-light-text text-lg">Decrypt Image</Text>
            </View>
          </>
        )}

      </ScrollView>
    </SafeAreaView>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  }
})