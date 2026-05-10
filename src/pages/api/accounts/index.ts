import {Database} from "better-sqlite3";
import {NextApiRequest, NextApiResponse} from "next";

import {accountToJson} from "@/schema/account";
import {listAccounts} from "@/sqlite/accounts";
import {getBalancesBetween, selectBalanceBeforeDate} from "@/sqlite/balances";
import {AccountShortData, BalanceData} from "@/types";
import {connect} from "@/utils/database";
import {parseJsDateToSql} from "@/utils/dates";

let db: Database = null

export default async (req: NextApiRequest, res: NextApiResponse) => {
    // console.log(req)
    if (req.method == 'GET') {
        try {
            await handleListAccounts(req, res);
        } catch (err) {
            console.error(err.message);
            res.status(500).json({error: true});
            throw err;
        }
    }
}


async function handleListAccounts(req: NextApiRequest, res: NextApiResponse) {
    console.log('GET /api/accounts/', req.query)
    let {date_start, date_end, in_use} = req.query;
    // console.log("queryparams", {date_start, date_end, in_use})
    date_start = Array.isArray(date_start) ? date_start[0] : date_start;
    date_end = Array.isArray(date_end) ? date_end[0] : date_end;

    db = await connect(db);

    let accounts: AccountShortData[] = listAccounts(db);
    if (in_use === 'true') {
        accounts = accounts.filter(accountData => accountData.in_use);
    }
    // console.log(accounts)

    const balances: BalanceData[] = getBalancesBetween(db, parseJsDateToSql(date_start), parseJsDateToSql(date_end));
    // console.log(balances)

    const lastPreviousBalances = {};
    for (const accountObj of accounts) {
        lastPreviousBalances[accountObj.id] = selectBalanceBeforeDate(db, accountObj.id, date_start);
    }

    res.status(200).json({
        accounts: accounts.map(accObj => accountToJson(accObj, balances, lastPreviousBalances[accObj.id]))
    })
}
