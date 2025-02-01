import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import { Alert } from 'react-native';

type EncodedImageData = {
    encodedImageData: string; // base64 string
};

const saveImageToDevice = async ({ encodedImageData }: EncodedImageData) => {
    try {
        // Request permission to access the media library
        const { status } = await MediaLibrary.requestPermissionsAsync();
        if (status !== "granted") {
            return Alert.alert("Permission Denied", "Permission to access media library is required.");
        }

        // Define the subdirectory where the image will be saved
        const subDirectory = 'InvisVault Images';  // Example subdirectory
        const directoryUri = FileSystem.documentDirectory + subDirectory;

        // Check if the directory exists, if not, create it
        const dirInfo = await FileSystem.getInfoAsync(directoryUri);
        if (!dirInfo.exists) {
            await FileSystem.makeDirectoryAsync(directoryUri, { intermediates: true });
        }

        // Get the current timestamp to avoid overwriting
        const timestamp = Date.now(); // Get the current timestamp in milliseconds
        const fileUri = directoryUri + `/encoded_image_${timestamp}.png`; // Add timestamp to the filename

        // Write the base64 string to the file
        await FileSystem.writeAsStringAsync(fileUri, encodedImageData, { encoding: FileSystem.EncodingType.Base64 });

        // Save the file to the media library (gallery)
        const asset = await MediaLibrary.createAssetAsync(fileUri);

        // Optionally, you can save the asset to an album (if needed)
        // const album = await MediaLibrary.getAlbumAsync('MyAppImages'); // Get the album, if needed
        // if (!album) {
        //   await MediaLibrary.createAlbumAsync('MyAppImages', asset, false);
        // }

        // Return success alert
        console.log("Success", "Image saved to device!");
    } catch (error) {
        console.error(error);
        console.log("Error", "Failed to save image to device.");
    }
};

export default saveImageToDevice;
