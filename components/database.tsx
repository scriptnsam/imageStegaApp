import * as SQLite from 'expo-sqlite';

interface ImageRow {
    uri: string;
}

// Open database synchronously
let db: SQLite.SQLiteDatabase | null = null;

export const openDatabase = () => {
    if (db) return db; // Prevent multiple openings

    try {
        db = SQLite.openDatabaseSync('images.db'); // Use sync version
        console.log("✅ Database opened successfully.");
        return db;
    } catch (error) {
        console.error('❌ Error opening database:', error);
        throw error;
    }
}

// Initialize the database (Create table if it doesn't exist)
export const initializeDatabase = async () => {
    try {
        const db = openDatabase();
        db.execSync(`
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

export const getSavedImages = (): string[] => {
    try {
        const db = openDatabase();
        const result = db.getAllSync<ImageRow>("SELECT uri FROM images;");
        // console.log(result)
        return result.map(row => row.uri);
    } catch (error) {
        console.error("❌ Error fetching images:", error);
        return [];
    }
};