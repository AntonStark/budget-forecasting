import {Database} from "sqlite";
import {NextApiRequest, NextApiResponse} from "next";

import {connect} from "@/utils/database";
import {accountToJson} from "@/schema/account";
import {dateIntervalToDatesArray, dateToDateString, dateToISODateString} from "@/utils/dates";

let db: Database = null

export default async (req: NextApiRequest, res: NextApiResponse) => {
    // console.log(req)
    console.log('GET /api/accounts/by_currency/')
    const [dateStartStr, dateEndStr] = [req.query.date_start, req.query.date_end]

    db = await connect(db)

    const groupsByCurrency = await db.all(`
        SELECT * FROM accounts_group_by_currency ag 
        JOIN currencies on ag.currency_id = currencies.id
        ORDER BY ag.order_number DESC NULLS LAST
    `)
    // console.log(groupsByCurrency)

    // todo вынести получение данных в models.ts и переиспользовать в разных api-файлах
    const accounts = await db.all(`
        SELECT acc.*, cur.iso_code FROM accounts acc
        JOIN currencies cur on acc.currency_id = cur.id
        ORDER BY acc.order_number
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
        spendingGroups: groupsByCurrency.map(group => ({
            accounts: (
                accounts
                .filter(accObj => accObj.currency_id === group.currency_id && !accObj.is_saving_account)
                .map(accObj => accountToJson(accObj, balances, dates))
            ),
            dates: dates.map(dateToDateString),
            isoDates: dates.map(dateToISODateString),
            groupInfo: {
                title: group.iso_code.toLowerCase(),
                in_use: group.in_use,
                balances: [],   // todo
            }
        })),
        savingAccountsGroup: {
            accounts: (
                accounts.filter(accObj => accObj.is_saving_account)
                .map(accObj => accountToJson(accObj, balances, dates))
            ),
            dates: dates.map(dateToDateString),
            isoDates: dates.map(dateToISODateString),
            groupInfo: {
                title: "сбережения",
            }
        }
    })
}
