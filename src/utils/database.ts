import {Database, open} from "sqlite";
import sqlite3 from "sqlite3";

export async function connect(db: Database) {
    // Check if the database instance has been initialized
    if (!db) {
        // If the database instance is not initialized, open the database connection
        return await open({
            filename: "./db/data.db",
            driver: sqlite3.Database,
        });
    } else {
        return db
    }
}
