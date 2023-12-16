import {Database} from "sqlite";
import {NextApiRequest, NextApiResponse} from "next";

import {dateIntervalToDatesArray, dateToDateString, dateToISODateString} from "@/utils/dates";
import {accountToJson} from "@/schema/account";
import {connect} from "@/utils/database";

let db: Database = null

export default async (req: NextApiRequest, res: NextApiResponse) => {
    // console.log(req)
    console.log('GET /api/accounts/', req.body)

    db = await connect(db)

    const currencies = await db.all("SELECT * FROM currencies")
    // console.log(currencies)

    const accounts = await db.all(`
        SELECT * FROM accounts
        JOIN currencies on accounts.currency_id = currencies.id
    `).then((result) => {
        // console.log("Select accounts done")
        return result
    }, (err) => {
        console.error(err.message)
        res.status(500).json({error: true})
        throw err
    })
    // console.log(accounts)

    const balances = await db.all(`
        SELECT adb.*, cur.iso_code as currency_iso_code 
        FROM account_date_balances adb
        JOIN currencies cur on adb.currency_id = cur.id
        WHERE adb.at_date BETWEEN ? AND ?
        ORDER BY adb.at_date
    `, [req.query.date_start, req.query.date_end]
    ).then((result) => {
        // console.log("Select account_date_balances done")
        return result
    }, (err) => {
        console.error(err.message)
        res.status(500).json({error: true})
        throw err
    })
    // console.log(balances)

    // console.log("query", [req.query.date_start, req.query.date_end])
    const dates = dateIntervalToDatesArray(
        [req.query.date_start, req.query.date_end]
    )
    // console.log('dates', dates.map(dateToDateString))

    res.status(200).json({
        currencies: currencies,
        dates: dates.map(dateToDateString),
        isoDates: dates.map(dateToISODateString),
        accounts: accounts.map(accObj => accountToJson(accObj, balances, dates))
    })
}
