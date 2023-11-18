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
