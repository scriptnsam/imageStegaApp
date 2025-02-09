import * as FileSystem from 'expo-file-system';
import { openDatabase } from './database'; // Ensure you import the correct database function

const deleteImagePermanently = async (
    imageUri: string,
    imageArray: string[],
    setImageArray: (arr: string[]) => void
) => {
    try {
        // Ensure the file exists before deleting
        const fileInfo = await FileSystem.getInfoAsync(imageUri);
        if (fileInfo.exists) {
            await FileSystem.deleteAsync(imageUri, { idempotent: true });
            console.log(`✅ File deleted: ${imageUri}`);
        } else {
            console.warn(`⚠️ File not found: ${imageUri}`);
        }

        // Remove the image URI from the database
        const db = openDatabase();
        const stmt = db.prepareSync("DELETE FROM images WHERE uri = ?;");
        stmt.executeSync([imageUri]);

        console.log("✅ Image path removed from database");

        // Update the state to remove the image from the array
        const updatedImages = imageArray.filter(img => img !== imageUri);
        setImageArray(updatedImages);
    } catch (error) {
        console.error("❌ Error deleting image:", error);
    }
};


export default deleteImagePermanently;