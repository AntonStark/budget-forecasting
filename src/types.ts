export interface BalanceData {
    account_id: number
    at_date: string
    value: number
    inferred?: boolean
}

export interface AccountBalance {
    at_date: string
    value: number
    inferred?: boolean
}

export interface AccountShortData {
    id: number
    name: string
    in_use: boolean
}

export interface AccountData extends AccountShortData{
    balances: Array<AccountBalance>
}

export enum DateRangeSettings {
    Previous_7_Days = "previous_7_days",
    Previous_30_Days = "previous_30_days",
    Weekly = "weekly",
    Monthly = "monthly"
}
