import pkg from "better-sqlite3";
const {Database} = pkg;
import parseArgs from "minimist";

import {connect} from "../../src/utils/database.ts";

const argv = parseArgs(process.argv, {
    string: ['f'],
    alias: {'file': 'f'}
})

const fileName = argv['f']
if (!fileName) {
    console.error('Migration file name required after "-f" or "--file" key');
    throw Error('Migration file not found')
}

// const migrationFile = `./db/migrations/${fileName}`
const migrationFile = `../migrations/${fileName}`;
const migration = (await import(migrationFile)).default;
console.log('Running: ', migration);

const db: Database = connect(null);

try {
    migration(db);
} catch (err) {
    console.error(err.message);
}
db.close();
