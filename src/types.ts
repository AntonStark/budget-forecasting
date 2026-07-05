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

  currency_iso_code: string | null
  currency_symbol: string | null
  category_id: number | null
  category_name: string | null
  category_color: string | null

  account_id: number | null

  schedule_type: string | null
  schedule_number: number | null
  schedule_date_start: string | null
}

export interface PaymentInSchema {
  description: string
  at_date: string
  amount: number
  schedule_id?: number
  categoryId?: number
}

export interface ScheduleShortSchema {
  type: string
  number: number
  date_start: string
}

export interface PaymentCategorySchema {
  id: number
  name: string
  color: string
}

export interface PaymentOutSchema {
  id: number
  description: string
  at_date: string

  amount: number
  value: string
  currency_iso_code: string | null
  currency_symbol: string | null

  account_id: number | null
  category: PaymentCategorySchema | null
  schedule: ScheduleShortSchema | null
}

export type PlannerState = {
  mode: Mode;
  setMode: (m: Mode) => void;

  currentDate: Date;
  setCurrentDate: (d: Date) => void;

  next: () => void;
  prev: () => void;

  showExpenseModal: boolean;
  setShowExpenseModal: (v: boolean) => void;

  showBalanceModal: boolean;
  setShowBalanceModal: (v: boolean) => void;

  editingPayment: ExpenseModalData | null;
  setEditingPayment: (p: ExpenseModalData | null) => void;
};

export enum PaymentType {once = "once", regular = "regular"}

interface PaymentDataBase {
  amount: number
  description: string
}

export interface OncePaymentData extends PaymentDataBase {
  plannedAt: {date: string}
  category?: {id: number}
}

export enum PaymentScheduleType {monthly = "monthly", weekly = "weekly"}

export interface ScheduledPaymentData extends PaymentDataBase {
  schedule: {type: PaymentScheduleType, number: number}
}

export interface PaymentSchedule {
  id: number
  type: PaymentScheduleType
  number: number
  applied_until: string
  date_start: string
  date_end: string
}

export enum PaymentsSort {asIs = "as_is", category = "category", coloredCategory = "colored_category"}

export enum AccountsRowsDisplay {display = "display", hide = "hide"}

export interface DisplaySettings {
  paymentsSort: PaymentsSort
  setPaymentsSort: (s: PaymentsSort) => void

  accountsRows: AccountsRowsDisplay
  setAccountsRows: (s: AccountsRowsDisplay) => void
}

export type ExpenseModalData =
  | {
  id?: number;
  type: PaymentType.once;
  amount: number;
  description: string;
  category: PaymentCategorySchema | null;
  date: string;
}
  | {
  id?: number;
  type: PaymentType.regular;
  amount: number;
  description: string;
  category: PaymentCategorySchema | null;
  scheduleType: PaymentScheduleType;
  scheduleNumber: number;
};
