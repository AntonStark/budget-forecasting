const main = (db) => {
    db.exec(`
        ALTER TABLE currencies
        ADD symbol TEXT 
    `, (err) => {
        if (err) {
            console.error(err.message)
            throw Error(err)
        }
        console.log('Table currencies altered')
    })
}

module.exports = main
