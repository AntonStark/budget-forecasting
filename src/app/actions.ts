'use server'

import {refresh, revalidatePath} from "next/cache";

import {connect} from "@/utils/database";
import {AccountBalance, AccountShortData, OncePaymentData, ScheduledPaymentData} from "@/types";
import {
  createPayment,
  createScheduledPayment,
  ensureScheduledPayments, listPaymentCategories,
  listPayments,
  updatePayment
} from "@/sqlite/payments";
import {dateToSql, parseJsDateToSql} from "@/utils/dates";
import {serializePayment} from "@/schema/payment";
import {listAccounts} from "@/sqlite/accounts";
import {getBalancesBetween, saveBalance, selectBalanceBeforeDate} from "@/sqlite/balances";
import {accountToJson} from "@/schema/account";
import {generateScheduleDates} from "@/domain";


// ==== ACCOUNTS ====

export async function getAccounts(dateStart: Date, dateEnd: Date, inUse: boolean = true) {
  const [date_start, date_end] = [dateToSql(dateStart), dateToSql(dateEnd)];

  const db = connect();

  let accounts: AccountShortData[] = listAccounts(db);
  if (inUse) {
    accounts = accounts.filter(accountData => accountData.in_use);
  }
  // console.log(accounts)

  const balances: AccountBalance[] = getBalancesBetween(db, parseJsDateToSql(date_start), parseJsDateToSql(date_end));
  // console.log(balances)

  const lastPreviousBalances = {};
  for (const accountObj of accounts) {
    lastPreviousBalances[accountObj.id] = selectBalanceBeforeDate(db, accountObj.id, parseJsDateToSql(date_start));
  }

  return accounts.map(accObj => accountToJson(accObj, balances, lastPreviousBalances[accObj.id]));
}

export async function setBalance({accountId, atDate, value}) {
  const db = connect();

  saveBalance(db, accountId, atDate, value);

  revalidatePath('/payments/week');
}

// ==== PAYMENTS ====

export async function getPayments(dateStart: Date, dateEnd: Date) {
  const [date_start, date_end] = [dateToSql(dateStart), dateToSql(dateEnd)];

  const db = connect();

  ensureScheduledPayments(db, date_end);
  const payments = listPayments(db, date_start, date_end);
  return payments.map(serializePayment);
}

export async function saveOnceOfPayment(expenseFormData: OncePaymentData) {
  const {amount, description} = expenseFormData;
  const at_date = expenseFormData.plannedAt.date;
  const categoryId = expenseFormData.category?.id;

  const db = connect();

  createPayment(db, {description, amount, at_date, categoryId})

  revalidatePath('/payments/week');
}

export async function saveScheduledPayment(expenseFormData: ScheduledPaymentData) {
  const {amount, description, schedule} = expenseFormData;

  const db = connect();

  // для создания расписания надо завести следом его первый экземпляр
  const scheduleParams = {...schedule, date_start: dateToSql(new Date())}
  const exemplarDate = (generateScheduleDates(scheduleParams, undefined, 1))[0];

  createScheduledPayment(db, {description, amount, at_date: dateToSql(exemplarDate)}, scheduleParams);
}

export async function updateOnceOfPayment(expenseFormData: Partial<OncePaymentData>, paymentId: number) {
  const {amount, description} = expenseFormData;

  const db = connect();

  updatePayment(db, amount, description, expenseFormData.plannedAt?.date, expenseFormData.category?.id, paymentId);

  refresh();
}


export async function fetchPaymentCategories() {
  const db = connect();

  return listPaymentCategories(db);
}
