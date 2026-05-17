export interface BalanceInfo {
  atDate: string
  value: number
  inferred?: boolean
}

export interface AccountBalance extends BalanceInfo {
  account_id: number
}

export interface AccountShortData {
  id: number
  title: string
  iso_code: string
  name: string
  in_use: boolean
}

export interface AccountData extends AccountShortData{
  balances: Array<BalanceInfo>
  lastBalanceBefore: BalanceInfo | undefined
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
  payment_schedule_id?: number
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

export type PaymentScheduleType = "monthly";

export interface PaymentSchedule {
  id: number
  type: PaymentScheduleType
  number: number
  applied_until: string
  date_start: string
  date_end: string
}
