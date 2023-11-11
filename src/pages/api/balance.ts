import sqlite3 from "sqlite3";
import {open, Database} from "sqlite";
import {NextApiRequest, NextApiResponse} from "next";

let db: Database = null

export default async (req: NextApiRequest, res: NextApiResponse) => {
    // console.log(req)
    console.log('POST /balance/', req.body)
    const {account_id, at_date, value} = req.body

    // Check if the database instance has been initialized
    if (!db) {
        // If the database instance is not initialized, open the database connection
        db = await open({
            filename: "./db/data.db",
            driver: sqlite3.Database,
        });
    }

    db.run(
        `INSERT INTO account_date_balances (account_id, at_date, value)
        VALUES (?, ?, ?)
        ON CONFLICT ( account_id, at_date ) DO
        UPDATE 
        SET value = ?
        WHERE account_id = ? and at_date = ?
        `,
        [account_id, at_date, value, value, account_id, at_date],
    ).then((result) => {
        res.status(200).json({value: value})
    }, (err) => {
        console.error(err)
        res.status(500).json({error: true})
    })
}
