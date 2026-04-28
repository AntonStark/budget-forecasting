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
    title: string
    iso_code: string
    name: string
    in_use: boolean
}

export interface AccountData extends AccountShortData{
    balances: Array<AccountBalance>
}

export enum Mode {week = "week", month = "month"}

export interface PaymentData {
    id: number
    description: string
    at_date: string
    amount: number
    currency_iso_code: string
    currency_symbol: string
    account_id?: number
}

export interface PaymentInSchema {
    description: string
    at_date: string
    amount: number
}

export type PlannerState = {
  mode: Mode;
  setMode: (m: Mode) => void;

  currentDate: Date;
  setCurrentDate: (d: Date) => void;

  next: () => void;
  prev: () => void;
};

export type PaymentType = "once" | "monthly";

export interface ExpenseFormData {
    type: PaymentType
    amount: number
    description: string
    plannedAt: {dayOfMonth: number} | {date: string}
}
