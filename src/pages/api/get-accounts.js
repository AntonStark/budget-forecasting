import sqlite3 from "sqlite3";
import { open, Database } from "sqlite";

let db = null

export default async (req, res) => {
    // Check if the database instance has been initialized
    if (!db) {
        // If the database instance is not initialized, open the database connection
        db = await open({
            filename: "./db/data.db",
            driver: sqlite3.Database,
        });
    }

    const currencies = await db.all("SELECT * FROM currencies")
    // console.log(currencies)

    const accounts = await db.all(`
        SELECT * FROM accounts
        JOIN currencies on accounts.currency_id = currencies.id
    `)
    console.log(accounts)

    const mockDates = ['2023-10-11', '2023-10-12', '2023-10-13', '2023-10-15']
    const mockBalances = [
        [100, 90, 70, 60],
        [50, 48, 45, 44]
    ]

    res.status(200).json({
        currencies: currencies,
        dates: mockDates,
        accounts: accounts.map((accObj, index) => ({
            name: `${accObj.title}, ${accObj.iso_code}`,
            balances: mockBalances[index % 2]
        }))
    })
}
