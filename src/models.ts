import {Database} from "sqlite";
import {NextApiResponse} from "next";

export async function selectAccounts(db: Database, res: NextApiResponse) {
    return await db.all(`
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
}

export async function selectBalances(db: Database, res: NextApiResponse, {dateStart, dateEnd}) {
    return await db.all(`
        SELECT adb.* 
        FROM account_date_balances adb
        WHERE adb.at_date BETWEEN ? AND ?
        ORDER BY adb.at_date
    `, [dateStart, dateEnd]
    ).then((result) => {
        // console.log("Select account_date_balances done")
        return result
    }, (err) => {
        console.error(err.message)
        res.status(500).json({error: true})
        throw err
    })
}

async function selectAccountBalanceBeforeDate(db: Database, res: NextApiResponse, {accountId, beforeDate}) {
    const result = await db.all(`
        SELECT adb.*
        FROM account_date_balances adb
        WHERE adb.account_id = ? AND adb.at_date < ?
        ORDER BY adb.at_date DESC 
        LIMIT 1
    `, [accountId, beforeDate]
    ).then((result) => {
        return result
    }, (err) => {
        console.error(err.message)
        res.status(500).json({error: true})
        throw err
    })

    const defaultBalance = {value: 0, account_id: accountId}
    return (result.length > 0 ? result[0] : defaultBalance)
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

export async function selectPayments(db: Database, res: NextApiResponse, {dateStart, dateEnd}) {
    return await db.all(`
        SELECT otp.*, cur.iso_code as currency_iso_code, cur.symbol as currency_symbol
        FROM one_time_payments otp
        LEFT JOIN currencies cur on otp.currency_id = cur.id
        WHERE otp.at_date IS NULL OR otp.at_date BETWEEN ? AND ?
        ORDER BY otp.at_date NULLS FIRST, otp.amount NULLS LAST
    `, [dateStart, dateEnd]
    ).then((result) => {
        return result
    }, (err) => {
        console.error(err.message)
        res.status(500).json({error: true})
        throw err
    })
}
