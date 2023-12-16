import {AccountData, AccountShortData, BalanceData} from "@/types";
import {dateToISODateString} from "@/utils/dates";

export function accountToJsonShort(accountObj): AccountShortData {
    return {
        id: accountObj.id,
        title: accountObj.title,
        iso_code: accountObj.iso_code,
        name: `${accountObj.title}, ${accountObj.iso_code}`,
        in_use: accountObj.in_use,
    }
}

export function accountToJson(accountObj, balanceData: Array<BalanceData>, dates): AccountData {
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
        ...accountToJsonShort(accountObj),
        balances: balancesArray,
    }
}
