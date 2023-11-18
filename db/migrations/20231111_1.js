const main = (db) => {
    db.exec(
        `CREATE UNIQUE INDEX IF NOT EXISTS account_date_balances_account_id_at_date 
        ON account_date_balances (account_id, at_date)
    `, (err) => {
        if (err) {
            return console.error(err.message);
        }
        console.log('Index account_date_balances_account_id_at_date created')
    })
}

module.exports = main
