import { StyleSheet, Alert, ScrollView, Image, Pressable, TextInput, ActivityIndicator } from 'react-native';
import { useEffect, useState } from 'react';
import { View, Text } from '@/components/Themed';
import Colors from '@/constants/Colors';
import * as ImagePicker from 'expo-image-picker';
import { useAppContext } from '@/components/AppContext';
import { ScreenHeader } from '@/components/ScreenHeader';
import { ScreenWrapper } from '@/components/ScreenWrapper';
import { useNavigation } from 'expo-router';
import { NavigationProp } from '@react-navigation/native';
import useRequest from '@/hooks/useRequest';
import { BACKEND_URL } from "@env"

type Base64Prop = string | null | undefined

type RootStackParamList = {
  library: undefined; // Screen with no params
  decrypt: undefined; // Screen with no params
  home: undefined; // Screen with no params
  // Add other routes as needed
};

type Props = {
  navigation: NavigationProp<RootStackParamList>;
};

const EncryptTab = () => {
  const [selectedImage, setSelectedImage] = useState('');
  const [imageBase64, setImageBase64] = useState<Base64Prop>('');
  const { setIsImagePickerActive } = useAppContext()
  const [inputValue, setInputValue] = useState('')
  const { data, error, loading, request } = useRequest()

  const navigation = useNavigation<Props['navigation']>()

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
      base64: true
    });

    // set image picker state to false
    setIsImagePickerActive(false)

    if (!result.canceled) {
      // set the image state
      setImageBase64(result.assets[0].base64);
      setSelectedImage(result.assets[0].uri);
    }
  };

  const handleEncrypt = async () => {
    // Logic for encrypting the image
    if (imageBase64 === '' || inputValue === '') {
      Alert.alert('Error', 'Please select an image and enter a message.');
      return;
    }
    // Proceed with encryption
    const payload = {
      image: imageBase64,
      message: inputValue
    }

    await request(`${BACKEND_URL}/encode`, 'POST', payload)


    if (error) {
      console.log(error)
      Alert.alert('Error', 'Something went wrong. Please try again.');
      return;
    }
    if (loading) {
      Alert.alert('Loading', 'Please wait...');
      return;
    }
    if (data) {
      Alert.alert('Encryption successful!', 'The image has been encrypted.', [
        {
          text: 'Great!', onPress: () => {
            setImageBase64('')
            setSelectedImage('')
            setInputValue('')
          }
        }
      ], { cancelable: false });
    }

  };

  const imageSource = selectedImage && selectedImage !== ''
    ? { uri: selectedImage } // Use uri for a dynamic image
    : require('@/assets/images/dummy_image.png');

  return (
    <ScreenWrapper styles={styles.container}>
      {/* header */}
      <ScreenHeader name='Encrypt Image' />

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

      {/* Text input filed */}
      <View>
        <TextInput
          style={styles.input}
          value={inputValue}
          onChangeText={(text) => setInputValue(text)} // Updates state when input changes
          placeholder="Input text to encrypt..."
          placeholderTextColor={'#aaa'}
          multiline={true}
          numberOfLines={4}
        />
      </View>

      <Pressable
        onPress={loading ? () => { } : handleEncrypt}
      >
        <View style={styles.verify_btn}>
          <Text style={{ color: Colors.secondary, fontSize: 20, fontFamily: 'InclusiveSans' }}>{!loading ? 'Encrypt' : <ActivityIndicator size={16} />}</Text>
        </View>
      </Pressable>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background
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
  },
  input: {
    height: 93,
    width: 300,
    alignSelf: 'center',
    marginTop: 80,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: Colors.primary,
    fontFamily: 'InclusiveSans',
    fontSize: 15,
    padding: 2,
    color: Colors.primary,
    backgroundColor: Colors.secondary
  },
  output: {
    fontSize: 20,
    margin: 12,
    color: Colors.primary
  },
  verify_btn: {
    alignSelf: 'center',
    marginTop: 50,
    backgroundColor: Colors.primary,
    padding: 5,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center', // Align text in the center of the button
    width: 254,
    height: 53,
    opacity: 1
  }
});

export default EncryptTab;
