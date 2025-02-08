import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import { Alert } from 'react-native';
import { openDatabase } from './database';

type EncodedImageData = {
    encodedImageData: string; // base64 string
};

const saveImageToDevice = async ({ encodedImageData }: EncodedImageData) => {
    try {
        // Define the directory inside documentDirectory
        const subDirectory = 'InvisVault';
        const directoryUri = FileSystem.documentDirectory + subDirectory + '/';

        // Ensure the directory exists
        const dirInfo = await FileSystem.getInfoAsync(directoryUri);
        if (!dirInfo.exists) {
            await FileSystem.makeDirectoryAsync(directoryUri, { intermediates: true });
        }

        // Generate a unique filename using timestamp
        const fileUri = directoryUri + `encoded_image_${Date.now()}.png`;

        // Save the base64 image as a file
        await FileSystem.writeAsStringAsync(fileUri, encodedImageData, { encoding: FileSystem.EncodingType.Base64 });

        // open the database and store the file path
        const db = openDatabase();

        const stmt = db.prepareSync("INSERT INTO images (uri) VALUES (?);");
        stmt.executeSync([fileUri]);

        console.log("✅ Image saved at:", fileUri);
        return fileUri;
    } catch (error) {
        console.error("❌ Error saving image:", error);
        Alert.alert("Error", "Failed to save image.");
    }
};


export default saveImageToDevice;
