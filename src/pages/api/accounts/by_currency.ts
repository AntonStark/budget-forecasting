import {Database} from "sqlite";
import {NextApiRequest, NextApiResponse} from "next";

import {selectAccounts, selectBalances, selectLastBalancesBeforeDate} from "@/models";
import {accountToJson} from "@/schema/account";
import {connect} from "@/utils/database";
import {dateIntervalToDatesArray, dateToDateString, dateToISODateString} from "@/utils/dates";

let db: Database = null

export default async (req: NextApiRequest, res: NextApiResponse) => {
    // console.log(req)
    console.log('GET /api/accounts/by_currency/')

    db = await connect(db)

    const groupsByCurrency = await db.all(`
        SELECT * FROM accounts_group_by_currency ag 
        JOIN currencies on ag.currency_id = currencies.id
        ORDER BY ag.order_number DESC NULLS LAST
    `)
    // console.log(groupsByCurrency)

    const accounts = await selectAccounts(db, res)
    // console.log(accounts)

    const balances = await selectBalances(db, res, {
        dateStart: req.query.date_start,
        dateEnd: req.query.date_end,
    })
    // console.log(balances)

    const lastPreviousBalances = await selectLastBalancesBeforeDate(db, res, {
        accounts: accounts,
        beforeDate: req.query.date_start
    })

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
                .map(accObj => accountToJson(accObj, balances, lastPreviousBalances[accObj.id], dates))
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
                .map(accObj => accountToJson(accObj, balances, lastPreviousBalances[accObj.id], dates))
            ),
            dates: dates.map(dateToDateString),
            isoDates: dates.map(dateToISODateString),
            groupInfo: {
                title: "сбережения",
            }
        }
    })
}
