import sqlite3 from "sqlite3";
import {open, Database} from "sqlite";
import {NextApiRequest, NextApiResponse} from "next";

import {dateIntervalToDatesArray, dateToDateString, dateToISODateString} from "@/utils/dates";
import {AccountData, BalanceData} from "@/types";

let db: Database = null

export default async (req: NextApiRequest, res: NextApiResponse) => {
    // console.log(req)
    console.log('GET /api/accounts/', req.body)

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
        currencies: currencies,
        dates: dates.map(dateToDateString),
        isoDates: dates.map(dateToISODateString),
        accounts: accounts.map(accObj => accountToJson(accObj, balances, dates))
    })
}

function accountToJson(accountObj, balanceData: Array<BalanceData>, dates): AccountData {
    // console.log("dates", dates)
    const dbAccountBalances = balanceData.filter(balanceObj => balanceObj.account_id === accountObj.id)
    const dateToBalance = Object.fromEntries(dbAccountBalances.map(balance => [balance.at_date, balance]))
    const indexToDate = dates.map(dateToISODateString)

    const balancesArray = new Array(dates.length)
    let previousDayBalance
    for (let i = 0; i < dates.length; i++) {
        const dateBalance = dateToBalance[indexToDate[i]]
        if (!dateBalance) {
            if (previousDayBalance) {
                // take from previous as inferred
                balancesArray[i] = {...previousDayBalance, inferred: true, at_date: indexToDate[i]}
            } else {  // no previous balance, todo need additional query for last available balance
                balancesArray[i] = {value: '?', at_date: indexToDate[i]}
            }
        } else {
            balancesArray[i] = previousDayBalance = dateBalance
        }
    }
    // console.log("dateToBalance", dateToBalance)

    return {
        id: accountObj.id,
        name: `${accountObj.title}, ${accountObj.iso_code}`,
        balances: balancesArray,
    }
}
