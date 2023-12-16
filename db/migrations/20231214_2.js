const main = (db) => {
    db.exec(`
        ALTER TABLE accounts
        ADD order_number INTEGER 
        DEFAULT 0
    `, (err) => {
        if (err) {
            console.error(err.message)
            throw Error(err)
        }
        console.log('Table accounts altered')
    })
}

module.exports = main
