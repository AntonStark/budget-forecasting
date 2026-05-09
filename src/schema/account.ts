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

export function accountToJson(accountObj, balanceData: Array<BalanceData>, lastBalanceBefore: BalanceData): AccountData {
    const accountBalances = balanceData.filter(balanceObj => balanceObj.account_id === accountObj.id)
    // console.log("accountBalances", accountBalances)

    return {
        ...accountToJsonShort(accountObj),
        balances: accountBalances,
    }
}
