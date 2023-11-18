const parseArgs = require('minimist')
const argv = parseArgs(process.argv, opts={
    string: ['f'],
    alias: {
        'file': 'f',
    }
})

const fileName = argv['f']
if (!fileName) {
    console.error('Migration file name required after "-f" or "--file" key')
    return
}

// const migrationFile = `./db/migrations/${fileName}`
const migrationFile = `../migrations/${fileName}`
const migration = require(migrationFile)
console.log('Running: ', migration)

const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database(
    "./db/data.db",
    sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
    (err) => {
        if (err) {
            return console.error(err.message);
        }
    }
)
migration(db)
db.close()
