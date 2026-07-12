import {addDays} from "date-fns";

import {AccountBalance, AccountData, Mode, PaymentOutSchema, PaymentScheduleType} from "@/types";
import {dateToSql, euroWeekOffset, makeDatesGivenNumber, makeDatesGivenWeekday, nextDay, Week} from "@/utils/dates";

export class DayBalancesInfo {
  date: string
  dayOfWeek: number
  isToday: boolean

  payments: PaymentOutSchema[]
  accounts: AccountBalance[]

  balances_touched: boolean
  total: number
  spending_delta: number | null
  spending_delta_mean: number | null

  constructor() {
    this.isToday = false;
    this.payments = [];
    this.accounts = [];
    this.balances_touched = false;
    this.total = 0;
    this.spending_delta = this.spending_delta_mean = null;
  }
}

const dailySpendingConfig = {
  weekdays: 2400,
  weekends: 3600
}
const weekSpending = dailySpendingConfig.weekdays * 5 + dailySpendingConfig.weekends * 2;


export function balancesByWeekday(payments: PaymentOutSchema[], accounts: AccountData[], week: Week): DayBalancesInfo[] {
  const result: DayBalancesInfo[] = Array.from({ length: 7 }, () => new DayBalancesInfo());

  for (const payment of payments) {
    const date = new Date(payment.at_date);
    if (!(week.start <= date && date <= week.end)) {
      continue;
    }

    const weekDay = euroWeekOffset(date);
    result[weekDay].payments.push(payment);
  }

  let incomingTotal = 0;
  const dateMonday = week.start;
  for (const account of accounts) {
    let balancesByDate: Record<string, number> = Object.fromEntries(account.balances.map(b => [b.atDate, b.value]));

    let lastBalance: number = account.lastBalanceBefore?.value || 0;
    incomingTotal += lastBalance;
    for (let i = 0; i < 7; i++) {
      let atDate = dateToSql(addDays(dateMonday, i));
      let [value, inferred] = (balancesByDate.hasOwnProperty(atDate) ? [balancesByDate[atDate], false] : [lastBalance, true]);
      result[i].accounts.push({ atDate, value, inferred, account_id: account.id });
      if (balancesByDate.hasOwnProperty(atDate)) {
        lastBalance = balancesByDate[atDate];
      }
    }
  }

  const today = dateToSql(new Date());
  for (let i = 0; i < 7; i++) {
    result[i].date = dateToSql(addDays(dateMonday, i));
    result[i].dayOfWeek = i + 1;

    if (result[i].date === today) {
      result[i].isToday = true;
    }
  }

  let [lastExplicitTotal, paymentsTotal, daysBetween] = [incomingTotal, 0, 0];
  for (const dayBalances of result) {
    dayBalances.payments = dayBalances.payments.sort((p1, p2) => p1.id - p2.id);

    let currentDayPayments = dayBalances.payments.map(payment => payment.amount).reduce((a, b) => a + b, 0);
    paymentsTotal += currentDayPayments;
    daysBetween += 1;

    dayBalances.balances_touched = dayBalances.accounts.map(balance => balance.inferred).includes(false);

    if (dayBalances.balances_touched) {
      for (const balance of dayBalances.accounts) {
        dayBalances.total += balance.value;
      }

      // считаем траты помимо запланированных - "spending"
      dayBalances.spending_delta = dayBalances.total + paymentsTotal - lastExplicitTotal;
      dayBalances.spending_delta_mean = Math.round(dayBalances.spending_delta / daysBetween);
      [lastExplicitTotal, paymentsTotal, daysBetween] = [dayBalances.total, 0, 0];
    }
    else {
      // для прогнозируемых остатков применяем ориентировочный расход по отношению к прошлому дню
      const prevDayTotal =  dayBalances.dayOfWeek > 1 ? result[dayBalances.dayOfWeek - 2].total : incomingTotal;
      const dailySpending = dayBalances.dayOfWeek < 6 ? dailySpendingConfig.weekdays : dailySpendingConfig.weekends;
      dayBalances.total = prevDayTotal - currentDayPayments - dailySpending;
    }

  }

  return result;
}


export class PeriodBudget {
  period: { type: Mode, start: Date, end: Date, active: boolean }

  payments: PaymentOutSchema[]
  saldo: number

  value_before: { plan: number, fact?: number }
  value_after: { plan: number, fact?: number }

  constructor() {
    this.payments = [];
    this.value_before = {plan: 0};
    this.value_after = {plan: 0};
  }

}


export function makeBudgetsByWeek(payments: PaymentOutSchema[], accounts: AccountData[], weeks: Week[]): PeriodBudget[] {
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
    budget.period = {type: Mode.week, start: week.start, end: week.end, active: week.active};

    budget.payments = (payments
      .filter(
        (p) => {
          const date = new Date(p.at_date);
          return week.start <= date && date <= week.end;
        }
      )
      .sort((p1, p2) => p1.id - p2.id));
    budget.saldo = budget.payments.map(pData => -pData.amount).reduce((a, b) => a + b, 0) - weekSpending;
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


interface PaymentScheduleInfo {
  type: PaymentScheduleType
  number: number
  applied_until?: string
  date_start: string
}

export function generateScheduleDates(
  schedule: PaymentScheduleInfo, untilDate: string | undefined, limit: number | undefined = undefined
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
