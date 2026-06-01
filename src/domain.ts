import {addDays} from "date-fns";

import {AccountBalance, AccountData, Mode, PaymentData, PaymentSchedule, PaymentScheduleType} from "@/types";
import {dateToSql, euroWeekOffset, makeDatesGivenNumber, makeDatesGivenWeekday, nextDay, Week} from "@/utils/dates";

export class DayBalancesInfo {
  date: string
  payments: PaymentData[]
  accounts: AccountBalance[]
  total: number
  balances_touched: boolean

  constructor() {
    this.payments = [];
    this.accounts = [];
    this.total = 0;
    this.balances_touched = false;
  }
}


export function balancesByWeekday(payments: PaymentData[], accounts: AccountData[], week: Week): DayBalancesInfo[] {
  const result: DayBalancesInfo[] = Array.from({ length: 7 }, () => new DayBalancesInfo());

  for (const payment of payments) {
    const date = new Date(payment.at_date);
    if (!(week.start <= date && date <= week.end)) {
      continue;
    }

    const weekDay = euroWeekOffset(date);
    result[weekDay].payments.push(payment);
  }

  const dateMonday = week.start;
  let balancesByDate: Record<string, number>;
  let atDate: string;
  for (const account of accounts) {
    balancesByDate = Object.fromEntries(account.balances.map(b => [b.atDate, b.value]));

    let lastBalance: number = account.lastBalanceBefore?.value || 0;
    for (let i = 0; i < 7; i++) {
      atDate = dateToSql(addDays(dateMonday, i));
      result[i].accounts.push({
        atDate,
        account_id: account.id,
        value: (balancesByDate.hasOwnProperty(atDate) ? balancesByDate[atDate] : lastBalance),
        inferred: !balancesByDate.hasOwnProperty(atDate),
      });
      if (balancesByDate.hasOwnProperty(atDate)) {
        lastBalance = balancesByDate[atDate];
      }
    }
  }

  for (let i = 0; i < 7; i++) {
    result[i].date = dateToSql(addDays(dateMonday, i));
  }

  for (const dayBalances of result) {

    for (const balance of dayBalances.accounts) {
      dayBalances.total += balance.value;
      if (!balance.inferred) {
        dayBalances.balances_touched = true;
      }
    }

  }

  return result;
}


export class PeriodBudget {
  period: { type: Mode, start: Date, end: Date }

  payments: PaymentData[]
  saldo: number

  value_before: { plan: number, fact?: number }
  value_after: { plan: number, fact?: number }

  constructor() {
    this.payments = [];
    this.value_before = {plan: 0};
    this.value_after = {plan: 0};
  }

}


export function makeBudgetsByWeek(payments: PaymentData[], accounts: AccountData[], weeks: Week[]): PeriodBudget[] {
  const result: PeriodBudget[] = weeks.map(() => new PeriodBudget());

  let [total, explicitTotal] = [0, false];
  const prevSunday = addDays(weeks[0].start, -1);
  const accountValues: Record<number, number> = {};
  const balancesByDate: Record<string, AccountBalance[]> = {}
  for (const account of accounts) {
    // баланс идёт на какую-то дату до запрошенного периода weeks и поскольку он
    // последний записанный, то считаем что входящий первого периода совпадает с их суммой
    total += account.lastBalanceBefore?.value || 0;
    accountValues[account.id] = account.lastBalanceBefore?.value || 0;
    // если среди балансов есть хоть одна запись за воскресенье пред. недели, то считаем что были заполнены и fact := plan
    if (account.lastBalanceBefore && account.lastBalanceBefore.atDate === dateToSql(prevSunday)) {
      explicitTotal = true;
    }

    // строим индекс заполнений остатков { dateStr -> balance[] }
    for (const balance of account.balances) {
      if (!balancesByDate.hasOwnProperty(balance.atDate)) {
        balancesByDate[balance.atDate] = [];
      }
      balancesByDate[balance.atDate].push({...balance, account_id: account.id});
    }
  }
  result[0].value_before = (explicitTotal ? {plan: total, fact: total} : {plan: total});

  const totalByDate: Record<string, number> = {}
  for (const dateStr of Object.keys(balancesByDate).sort()) {
    // применяем балансы по аккаунтам
    for (const balance of balancesByDate[dateStr]) {
      accountValues[balance.account_id] = balance.value;
    }
    // теперь можем выписать явный остаток на данный день
    totalByDate[dateStr] = Object.values(accountValues).reduce((a, b) => a + b, 0);
  }
  // console.log(totalByDate);

  let week: Week;
  let budget: PeriodBudget;
  for (let w = 0; w < weeks.length; w++) {
    [week, budget] = [weeks[w], result[w]];
    budget.period = {type: Mode.week, start: week.start, end: week.end};

    budget.payments = payments.filter((p) => {
      const date = new Date(p.at_date);
      return week.start <= date && date <= week.end;
    });
    budget.saldo = budget.payments.map(pData => -pData.amount).reduce((a, b) => a + b, 0);
    budget.value_after = { plan: (budget.value_before.fact || budget.value_before.plan) + budget.saldo };

    // проставим budget.value_after.fact из индекса балансов по датам (если есть)
    if (totalByDate.hasOwnProperty(dateToSql(budget.period.end))) {
      budget.value_after.fact = totalByDate[dateToSql(budget.period.end)];
    }

    // входящий следующего периода = исходящий текущего
    if (result[w + 1]) {
      result[w + 1].value_before = budget.value_after;
    }

  }

  return result;
}


export function generateScheduleDates(
  schedule: PaymentSchedule, untilDate: string | undefined, limit: number = undefined
): Array<Date> {
  // надо сформировать массив дат в которые нужны конкретные платежи
  // для этого из полу-интервала (applied_until, untilDate] надо выбрать дни с подходящим number
  const intervalStart = (
    schedule.applied_until ? nextDay(new Date(schedule.applied_until)) : new Date(schedule.date_start)
  );
  const intervalEnd = (untilDate ? nextDay(new Date(untilDate)) : undefined);
  if (schedule.type === PaymentScheduleType.monthly) {
    return makeDatesGivenNumber(intervalStart, intervalEnd, schedule.number, limit);
  } else {  // weekly
    return makeDatesGivenWeekday(intervalStart, intervalEnd, schedule.number, limit);
  }
}
