export interface BalanceData {
    account_id: number
    at_date: string
    value: number
    inferred?: boolean
}

export interface AccountData {
    name: string
    balances: Array<BalanceData>
}
