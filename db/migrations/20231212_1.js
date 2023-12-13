const main = (db) => {
    db.exec(`
        CREATE TABLE IF NOT EXISTS accounts_group_by_currency (
            id INTEGER PRIMARY KEY,
            currency_id INTEGER,
            order_number INTEGER,
            in_use INTEGER NOT NULL DEFAULT TRUE,
            FOREIGN KEY(currency_id) REFERENCES currencies(id)
    )`, (err) => {
        if (err) {
            console.error(err.message)
            throw Error(err)
        }
        console.log('Created accounts_group_by_currency table.')
    })

    db.exec(`
        ALTER TABLE accounts
        ADD is_saving_account INTEGER NOT NULL 
        DEFAULT FALSE
    `, (err) => {
        if (err) {
            console.error(err.message)
            throw Error(err)
        }
        console.log('Table accounts altered')
    })
}

module.exports = main
