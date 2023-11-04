const sqlite3 = require("sqlite3").verbose();

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

// Serialize method ensures that database queries are executed sequentially
db.serialize(() => {
    const createTableErrorHandlerFabric = (tableName) => (err) => {
        if (err) {
            return console.error(err.message);
        }
        console.log(`Created ${tableName} table.`);
    }
    const emptyTableErrorHandlerFabric = (tableName) => (err) => {
        if (err) {
            return console.error(err.message);
        }
        console.log(`All rows deleted from ${tableName}.`);
    }

    // Create the currencies table if it doesn't exist
    db.exec(
        `CREATE TABLE IF NOT EXISTS currencies (
            id INTEGER PRIMARY KEY,
            name TEXT
        )`,
        createTableErrorHandlerFabric("currencies")
    ).exec(
        `DELETE FROM currencies`,
        emptyTableErrorHandlerFabric("currencies")
    )

    // Insert new data into the products table
    const values1 = [
        1,
        "USD",
    ];
    const values2 = [
        2,
        "RUB",
    ];
    const values3 = [
        3,
        "EUR",
    ];

    const insertSql = `INSERT INTO currencies(id, name) VALUES(?, ?)`;

    db.run(insertSql, values1, function (err) {
        if (err) {
            return console.error(err.message);
        }
        const id = this.lastID; // get the id of the last inserted row
        console.log(`Rows inserted, ID ${id}`);
    });

    db.run(insertSql, values2, function (err) {
        if (err) {
            return console.error(err.message);
        }
        const id = this.lastID; // get the id of the last inserted row
        console.log(`Rows inserted, ID ${id}`);
    });

    db.run(insertSql, values3, function (err) {
        if (err) {
            return console.error(err.message);
        }
        const id = this.lastID; // get the id of the last inserted row
        console.log(`Rows inserted, ID ${id}`);
    });

    // Create the accounts table if it doesn't exist
    db.exec(
        `CREATE TABLE IF NOT EXISTS accounts (
            id INTEGER PRIMARY KEY,
            title TEXT,
            currency_id INTEGER,
            created_at TEXT,
            FOREIGN KEY(currency_id) REFERENCES currencies(id)
        )`,
        createTableErrorHandlerFabric("accounts")
    ).exec(
        `DELETE FROM accounts`,
        emptyTableErrorHandlerFabric("accounts")
    )

    // Create the account_date_balances table if it doesn't exist
    db.exec(
        `CREATE TABLE IF NOT EXISTS account_date_balances (
            id INTEGER PRIMARY KEY,
            account_id INTEGER,
            at_date TEXT,
            value REAL,
            FOREIGN KEY(account_id) REFERENCES accounts(id)
        )`,
        createTableErrorHandlerFabric("account_date_balances")
    ).exec(
        `DELETE FROM account_date_balances`,
        emptyTableErrorHandlerFabric("account_date_balances")
    )

    // Create the one_time_payments table if it doesn't exist
    db.exec(
        `CREATE TABLE IF NOT EXISTS one_time_payments (
            id INTEGER PRIMARY KEY,
            account_id INTEGER,
            at_date TEXT,
            amount REAL,
            description TEXT,
            FOREIGN KEY(account_id) REFERENCES accounts(id)
        )`,
        createTableErrorHandlerFabric("one_time_payments")
    ).exec(
        `DELETE FROM one_time_payments`,
        emptyTableErrorHandlerFabric("one_time_payments")
    )

});

//   Close the database connection after all insertions are done
db.close((err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log("Closed the database connection.");
});
