import {Database} from "better-sqlite3";
import {NextApiRequest, NextApiResponse} from "next";

import {selectAccounts, selectBalances, selectLastBalancesBeforeDate} from "@/models";
import {accountToJson} from "@/schema/account";
import {connect} from "@/utils/database";
import {dateIntervalToDatesArray, dateToDateString, dateToISODateString, parseJsDateToSql} from "@/utils/dates";

let db: Database = null

export default async (req: NextApiRequest, res: NextApiResponse) => {
    // console.log(req)
    console.log('GET /api/accounts/', req.query)

    db = await connect(db)

    const currencies = db.prepare("SELECT * FROM currencies").all();
    // console.log(currencies)

    let accounts = await selectAccounts(db, res)
    const onlyInUse = req.query.in_use === 'true';
    if (onlyInUse) {
        accounts = accounts.filter(accountData => accountData.in_use);
    }
    // console.log(accounts)

    const balances = await selectBalances(db, res, {
        dateStart: parseJsDateToSql(req.query.date_start),
        dateEnd: parseJsDateToSql(req.query.date_end),
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
        currencies: currencies,
        dates: dates.map(dateToDateString),
        isoDates: dates.map(dateToISODateString),
        accounts: accounts.map(accObj => accountToJson(accObj, balances, lastPreviousBalances[accObj.id]))
    })
}
