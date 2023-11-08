import sqlite3 from "sqlite3";
import {open} from "sqlite";
import {dateIntervalToDatesArray, dateToDateString, dateToISODateString} from "../../utils/dates";

let db = null

export default async (req, res) => {
    // console.log(req)

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
    `, (err) => {
        if (err) {
            return console.error(err.message);
        }
        console.log("Select accounts done")
    })
    // console.log(accounts)

    const balances = await db.all(`
        SELECT * FROM account_date_balances
        WHERE at_date BETWEEN ? AND ?
        ORDER BY at_date
    `, [req.query.date_start, req.query.date_end],
    (err) => {
        if (err) {
            return console.error(err.message);
        }
        console.log("Select account_date_balances done")
    })
    console.log(balances)

    // console.log("query", [req.query.date_start, req.query.date_end])
    const dates = dateIntervalToDatesArray(
        [req.query.date_start, req.query.date_end]
    )
    // console.log('dates', dates.map(dateToDateString))

    res.status(200).json({
        currencies: currencies,
        dates: dates.map(dateToDateString),
        accounts: accounts.map(accObj => accountToJson(accObj, balances, dates))
    })
}

function accountToJson(accountObj, balanceData, dates) {
    console.log("dates", dates)
    const dbAccountBalances = balanceData.filter(balanceObj => balanceObj.account_id === accountObj.id)
    const dateToBalance = Object.fromEntries(dbAccountBalances.map(balance => [balance.at_date, balance]))
    const indexToDate = dates.map(dateToISODateString)

    const balancesBuf = new Array(dates.length)
    let previousDayBalance
    for (let i = 0; i < dates.length; i++) {
        const dateBalance = dateToBalance[indexToDate[i]]
        if (!dateBalance) {
            if (previousDayBalance) {
                // take from previous as inferred
                balancesBuf[i] = {...previousDayBalance, inferred: true}
            } else {  // no previous balance, todo need additional query for last available balance
                balancesBuf[i] = {value: '?'}
            }
        } else {
            balancesBuf[i] = previousDayBalance = dateBalance
        }
    }
    console.log("dateToBalance", dateToBalance)
    // todo append calculated values for dates
    //  пройти по массиву дат (делая из них строки ISO даты)
    //  1. если на дату нет значения смотреть на прошлый день
    //  2. если вообще нет = надо делать дозапрос...
    return {
        name: `${accountObj.title}, ${accountObj.iso_code}`,
        balances: balancesBuf
    }
}
