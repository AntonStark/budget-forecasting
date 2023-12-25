import * as fs from 'node:fs/promises';
import {Database} from "sqlite";
import {NextApiRequest, NextApiResponse} from "next";

import {selectAccounts, selectBalances, selectLastBalancesBeforeDate} from "@/models";
import {accountToJson} from "@/schema/account";
import {connect} from "@/utils/database";
import {dateIntervalToDatesArray, dateToDateString} from "@/utils/dates";

let db: Database = null

export default async (req: NextApiRequest, res: NextApiResponse) => {
    // console.log(req)
    console.log('GET /api/accounts/export/')
    const [dateStartStr, dateEndStr] = [req.query.date_start, req.query.date_end]

    db = await connect(db)

    const dates = dateIntervalToDatesArray([dateStartStr, dateEndStr])
    // console.log('dates', dates.map(dateToDateString))
    const accounts = await selectAccounts(db, res)
    // console.log(accounts)

    const balances = await selectBalances(db, res, {
        dateStart: dateStartStr,
        dateEnd: dateEndStr,
    })

    const lastPreviousBalances = await selectLastBalancesBeforeDate(db, res, {
        accounts: accounts,
        beforeDate: req.query.date_start
    })

    const accountsData = accounts.map(accObj => accountToJson(accObj, balances, lastPreviousBalances[accObj.id], dates))
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
