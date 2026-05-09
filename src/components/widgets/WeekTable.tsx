import React from "react";

import {dateToISODateString, dateToSql, euroWeekOffset, getWeek, Week} from "@/utils/dates";
import {AccountData, BalanceData, PaymentData} from "@/types";
import PeriodPayments from "@/components/widgets/PeriodPayments";
import AccountBalance from "@/components/widgets/AccountBalance";
import {addDays} from "date-fns";

function groupByWeekday(items: PaymentData[]) {
  const result: PaymentData[][] = Array.from({ length: 7 }, () => []);

  for (const item of items) {
    const weekDay = euroWeekOffset(new Date(item.at_date));
    result[weekDay].push(item);
  }

  return result;
}

function balancesByWeekday(accounts: AccountData[], week: Week) {
  const result: BalanceData[][] = Array.from({ length: 7 }, () => []);

  const dateMonday = week.start;
  let balancesByDate;
  let atDate;
  for (const account of accounts) {
    balancesByDate = Object.fromEntries(account.balances.map(b => [b.at_date, b.value]));

    for (let i = 0; i < 7; i++) {
      atDate = dateToSql(addDays(dateMonday, i));
      result[i].push({
        account_id: account.id,
        at_date: atDate,
        value: balancesByDate[atDate],
      });
    }
  }

  return result;
}

export default function WeekTable({currentDate, payments, accounts}: {
  currentDate: Date,
  payments: PaymentData[],
  accounts: AccountData[],
}) {
  const week = getWeek(currentDate);
  const weekPayments = payments.filter((p) => {
    const d = new Date(p.at_date);
    return week.start <= d && d <= week.end;
  });
  const days = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

  return (
    <div className="bg-white rounded-2xl shadow-sm">
      <div className="p-4">
        <div className="grid grid-cols-8 gap-1">
          {/* Заголовки - дни недели */}
          <div className="row-start-1 border-bottom"/>
          {days.map((day) => (
            <div
              key={day}
              className="row-start-1 text-xs text-gray-500 border-bottom"
            >{day}</div>
          ))}

          {/* Расходы по дням */}
          <div className="row-start-2 border-bottom"/>
          {groupByWeekday(weekPayments).map((dayPayments, i) => (
            <div
              key={i}
              className="row-start-2 bg-gray-50 p-2 h-24 text-sm text-gray-700 border-bottom"
            >
              <PeriodPayments payments={dayPayments}/>
            </div>
          ))}

          {/* заголовки счетов*/}
          <div className="row-start-3 text-right text-sm">
            {accounts.map((acc) => <div key={acc.id}>{acc.title}</div>)}
          </div>
          {/* Остатки на счетах по дням */}
          {balancesByWeekday(accounts, week).map((dayBalances, j) => (
            <div key={j} className="row-start-3 text-right text-sm">
              {dayBalances.map((bData, i) => (
                <AccountBalance
                  key={i}
                  date={bData.at_date}
                  accountId={bData.account_id}
                  value={bData.value}
                  inferred={true}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
