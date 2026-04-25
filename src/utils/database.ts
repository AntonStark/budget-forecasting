import Database from "better-sqlite3";

export async function connect(db: Database.Database) {
    // Check if the database instance has been initialized
    if (!db) {
        // If the database instance is not initialized, open the database connection
        const db = new Database("./db/data.db");
        db.pragma('journal_mode = WAL');
        return db;
    } else {
        return db
    }
}
