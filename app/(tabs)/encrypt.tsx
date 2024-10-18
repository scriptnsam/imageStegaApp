import { StyleSheet, Alert, ScrollView, Image, Pressable } from 'react-native';
import { useState } from 'react';
import { View, Text } from '@/components/Themed';
import Colors from '@/constants/Colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { useAppContext } from '@/components/AppContext';

const EncryptTab = () => {
  const [selectedImage, setSelectedImage] = useState('');
  const [message, setMessage] = useState('');
  const navigation = useNavigation()
  const { setIsImagePickerActive } = useAppContext()

  const handleImageUpload = async () => {
    // Logic for selecting an image
    // Request persmission to access image library
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert('Permission to access camera roll is required!');
      return;
    }

    // set image picker state to true
    setIsImagePickerActive(true)

    // Launch the image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      // aspect: [1, 1],
      quality: 1,
    });

    // set image picker state to false
    setIsImagePickerActive(false)

    if (!result.canceled) {
      console.log(result.assets[0].uri)
      // set the image state
      setSelectedImage(result.assets[0].uri);
    }
  };

  const handleEncrypt = () => {
    // Logic for encrypting the image
    if (!selectedImage || !message) {
      Alert.alert('Error', 'Please select an image and enter a message.');
      return;
    }
    // Proceed with encryption
  };

  const imageSource = selectedImage && selectedImage !== ''
    ? { uri: selectedImage } // Use uri for a dynamic image
    : require('@/assets/images/dummy_image.png');

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {/* header */}
        <View style={styles.header}>
          <Pressable
            onPress={() => navigation.goBack()}
          >
            <Image style={styles.back} source={require('@/assets/images/Back.png')} />
          </Pressable>
          <Text style={{ fontFamily: 'InclusiveSans', fontSize: 24, color: Colors.primary }}>Encrypt Image</Text>
        </View>

        {/* Image section */}
        <Pressable
          onPress={handleImageUpload}
        >
          <View style={styles.imageUpload}>
            <Image source={imageSource} style={{ width: selectedImage !== '' ? 150 : 100, height: selectedImage !== '' ? 150 : 100 }} />
          </View>
        </Pressable>

        <Pressable
          onPress={handleImageUpload}
        >
          <View style={styles.uploadBtn}>
            <Text style={{ fontFamily: 'InclusiveSans', fontSize: 20, color: Colors.secondary }}>Upload Image</Text>
          </View>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background
  },
  back: {
    width: 50,
    height: 50,
  },
  header: {
    marginTop: 30,
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    marginHorizontal: 10
  },
  imageUpload: {
    width: 170,
    height: 170,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: 50,
    backgroundColor: Colors.secondary,
    borderRadius: 5
  },
  uploadBtn: {
    alignSelf: 'center',
    marginTop: 30,
    width: 195,
    height: 47,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    borderRadius: 2,
  }
});

export default EncryptTab;
