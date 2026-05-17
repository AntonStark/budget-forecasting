import {AccountData, AccountShortData, AccountBalance, BalanceInfo} from "@/types";

export function accountToJsonShort(accountObj): AccountShortData {
    return {
        id: accountObj.id,
        title: accountObj.title,
        iso_code: accountObj.iso_code,
        name: `${accountObj.title}, ${accountObj.iso_code}`,
        in_use: accountObj.in_use,
    }
}

export function accountToJson(accountObj, balanceData: Array<AccountBalance>, lastBalanceBefore: BalanceInfo | undefined): AccountData {
    const accountBalances = balanceData.filter(balanceObj => balanceObj.account_id === accountObj.id)
    // console.log("accountBalances", accountBalances)

    return {
        ...accountToJsonShort(accountObj),
        lastBalanceBefore,
        balances: accountBalances,
    }
}
