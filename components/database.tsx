import * as SQLite from 'expo-sqlite';

interface ImageRow {
    uri: string;
}

// Open SQLite database asynchronously
export const openDatabase = async () => {
    try {
        return await SQLite.openDatabaseAsync('images.db');
    } catch (error) {
        console.error('Error opening database:', error);
        throw error;
    }
}

// Initialize the database (Create table if it doesn't exist)
export const initializeDatabase = async () => {
    try {
        const db = await openDatabase();
        await db.execAsync(`
            CREATE TABLE IF NOT EXISTS images (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                uri TEXT,
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
           );`);

    } catch (error) {
        console.error('Error initializing database:', error);
        throw error;
    }
};

export const getSavedImages = async (): Promise<string[]> => {
    try {
        const db = await openDatabase();
        const result = await db.getAllAsync<ImageRow>("SELECT uri FROM images;");

        return result.map(row => row.uri);

    } catch (error) {
        console.error('Error fetching images:', error);
        throw error;
    }
};