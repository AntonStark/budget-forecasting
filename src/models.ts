import {Database} from "better-sqlite3";
import {NextApiResponse} from "next";
import {AccountShortData, BalanceData} from "@/types";

export async function selectAccounts(db: Database, res: NextApiResponse) {
    const stmt = db.prepare<[], AccountShortData>(`
        SELECT acc.*, cur.iso_code FROM accounts acc
        JOIN currencies cur on acc.currency_id = cur.id
        ORDER BY acc.order_number
    `);

    try {
        return stmt.all();
    } catch (err) {
        console.error(err.message)
        res.status(500).json({error: true})
        throw err
    }
}

export async function selectBalances(db: Database, res: NextApiResponse, {dateStart, dateEnd}) {
    const stmt = db.prepare<string[], BalanceData>(`
        SELECT adb.* 
        FROM account_date_balances adb
        WHERE adb.at_date BETWEEN ? AND ?
        ORDER BY adb.at_date
    `);

    try {
        // @ts-ignore
        return stmt.all([dateStart, dateEnd]);
    } catch (err) {
        console.error(err.message)
        res.status(500).json({error: true})
        throw err
    }
}

async function selectAccountBalanceBeforeDate(db: Database, res: NextApiResponse, {accountId, beforeDate}) {
    const stmt = db.prepare(`
        SELECT adb.*
        FROM account_date_balances adb
        WHERE adb.account_id = ? AND adb.at_date < ?
        ORDER BY adb.at_date DESC 
        LIMIT 1
    `);

    try {
        const result = stmt.all([accountId, beforeDate]);
        const defaultBalance = {value: 0, account_id: accountId}
        return (result.length > 0 ? result[0] : defaultBalance)
    } catch (err) {
        console.error(err.message)
        res.status(500).json({error: true})
        throw err;
    }
}

export async function selectLastBalancesBeforeDate(db: Database, res: NextApiResponse, {accounts, beforeDate}) {
    const result = {}
    for (const accountObj of accounts) {
        result[accountObj.id] = await selectAccountBalanceBeforeDate(db, res, {
            accountId: accountObj.id,
            beforeDate: beforeDate,
        })
    }
    // console.log(result)
    return result
}
