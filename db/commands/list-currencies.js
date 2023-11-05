const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database(
    "./db/data.db",
    sqlite3.OPEN_READONLY,
    (err) => {
        if (err) {
            return console.error(err.message);
        }
    }
)

db.serialize(() => {
    const currencies = db.all(
        "SELECT * FROM currencies",
        [],
        (err, rows) => {
            if (err) {
                return console.error(err.message);
            }
            console.log(rows)
        })

    db.close()
})
