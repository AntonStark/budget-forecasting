const main = (db) => {
    db.exec(`
        ALTER TABLE accounts
        ADD in_use INTEGER NOT NULL 
        DEFAULT TRUE
    `, (err) => {
        if (err) {
            return console.error(err.message);
        }
        console.log('Table accounts altered')
    })
}

module.exports = main
