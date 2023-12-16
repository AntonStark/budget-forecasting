const main = (db) => {
    db.exec(
        `DROP TABLE one_time_payments`,
        (err) => {
            if (err) {
                console.error(err.message)
                throw Error(err)
            }
            console.log('Table one_time_payments dropped')
        }
    )

    db.exec(
        `CREATE TABLE one_time_payments (
            id INTEGER PRIMARY KEY,
            description TEXT,
            at_date TEXT,
            amount REAL,
            currency_id INTEGER,
            account_id INTEGER,
            FOREIGN KEY(account_id) REFERENCES accounts(id),
            FOREIGN KEY(currency_id) REFERENCES currencies(id)
        )`,
    (err) => {
        if (err) {
            console.error(err.message)
            throw Error(err)
        }
        console.log('Table one_time_payments re-created')
    })
}

module.exports = main
