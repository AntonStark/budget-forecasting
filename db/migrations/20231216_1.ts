import {Database} from "better-sqlite3";

const main = (db: Database) => {
    try {
        db.exec(`
            ALTER TABLE currencies
                ADD symbol TEXT
        `);
    }
    catch (err) {
        if (err) {
            console.error(err.message)
            throw Error(err)
        }
    }
    console.log('Table currencies altered')
}

export default main;
