import * as fs from 'node:fs/promises';
import {Database} from "sqlite";
import {NextApiRequest, NextApiResponse} from "next";

import {connect} from "@/utils/database";
import {accountToJson} from "@/schema/account";
import {dateIntervalToDatesArray, dateToDateString} from "@/utils/dates";

let db: Database = null

export default async (req: NextApiRequest, res: NextApiResponse) => {
    // console.log(req)
    console.log('GET /api/accounts/export/')
    const [dateStartStr, dateEndStr] = [req.query.date_start, req.query.date_end]

    db = await connect(db)

    const dates = dateIntervalToDatesArray([dateStartStr, dateEndStr])
    // console.log('dates', dates.map(dateToDateString))
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
        SELECT * FROM account_date_balances
        WHERE at_date BETWEEN ? AND ?
        ORDER BY at_date
    `, [dateStartStr, dateEndStr]
    ).then((result) => {
        // console.log("Select account_date_balances done")
        return result
    }, (err) => {
        console.error(err.message)
        res.status(500).json({error: true})
        throw err
    })
    const accountsData = accounts.map(accObj => accountToJson(accObj, balances, dates))
    // console.log('accountsData', accountsData)

    const fileName = ['data', dateStartStr, dateEndStr].join('_') + '.csv'
    const fileHeader = ['', ...dates.map(dateToDateString)]
    const accountRows = accountsData.map(accountJson => {
        const accountName = accountJson.name
        const balanceValues = accountJson.balances.map(balanceObj => balanceObj.value)
        return [accountName, ...balanceValues]
    })
    const content = dataToCSV([fileHeader, ...accountRows])

    await fs.writeFile('./db/exports/' + fileName, content, { flag: 'wx' })
        .then((result) => {
            res.status(201).json({success: true})
        }, (err) => {
            if (err.code === "EEXIST") {
                res.status(200).json({success: true})
                return
            }
            console.error(err);
            res.status(500).json({
                error: true,
                message: err.message,
            })
        });
}

function dataToCSV(data: Array<Array<unknown>>): string {
    const escapeCell = cellContent => '"' + cellContent + '"'
    const lines = data.map(rowData => rowData.map(escapeCell).join(','))
    return lines.join('\n')
}
