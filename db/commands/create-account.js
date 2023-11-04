const sqlite3 = require("sqlite3").verbose();

// [title, currency_id]
const ACCOUNT_PARAMS = ["альфа", 2]

// Connecting to or creating a new SQLite database file
const db = new sqlite3.Database(
    "./db/data.db",
    sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
    (err) => {
        if (err) {
            return console.error(err.message);
        }
        console.log("Connected to the SQlite database.");
    }
);

const dateToday = new Date().toISOString().slice(0, 23).replace('T', ' ')

db.run(
    `INSERT INTO accounts (id, title, currency_id, created_at) VALUES (NULL, ?, ?, ?)`,
    [...ACCOUNT_PARAMS, dateToday],
    (err) => {
        if (err) {
            return console.error(err.message);
        }
        const id = this.lastID; // get the id of the last inserted row
        console.log(`Rows inserted, ID ${id}`);
    }
)

//   Close the database connection after all insertions are done
db.close((err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log("Closed the database connection.");
});
