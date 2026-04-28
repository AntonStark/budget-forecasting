import {Database} from "better-sqlite3";
import * as parseArgs from "minimist";

import {connect} from "@/utils/database";

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
const migration = require(migrationFile);
console.log('Running: ', migration);

const db: Database = await connect(null);

try {
    migration(db);
} catch (err) {
    console.error(err.message);
}
db.close();
