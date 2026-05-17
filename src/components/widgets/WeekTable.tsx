import React from "react";

import {setBalance} from "@/adapters/api";
import BalanceCell from "@/components/widgets/BalanceCell";
import PeriodPayments from "@/components/widgets/PeriodPayments";
import {balancesByWeekday, DayBalancesInfo} from "@/domain";
import {AccountData, PaymentData} from "@/types";
import {getWeek} from "@/utils/dates";


export default function WeekTable({currentDate, payments, accounts, refreshHandle}: {
  currentDate: Date,
  payments: PaymentData[],
  accounts: AccountData[],
  refreshHandle: () => void,
}) {
  const week = getWeek(currentDate);
  const dayTitles = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

  return (
    <div className="bg-white rounded-2xl shadow-sm">
      <div className="p-4">
        <div className="grid grid-cols-8 gap-1">
          {/* ПЕРВАЯ КОЛОНКА */}
          <div className="row-start-1 border-bottom"/>
          <div className="row-start-2 border-bottom"/>
          {/* Заголовки счетов*/}
          <div className="row-start-3 text-right text-xs border-bottom">
            {accounts.map((acc) => <div key={acc.id}>{acc.title}</div>)}
          </div>
          <div className="row-start-4"></div>

          {balancesByWeekday(payments, accounts, week).map((dayBalances, d) => (
            <OneDayColumn key={d} d={d} dayBalances={dayBalances} dayTitles={dayTitles} refreshHandle={refreshHandle}/>
          ))}
        </div>
      </div>
    </div>
  );
}


function OneDayColumn(
  {dayBalances, dayTitles, d, refreshHandle}:
  {dayBalances: DayBalancesInfo, dayTitles: string[], d: number, refreshHandle: () => void }
) {
  return (
    <>
      {/* Заголовки - дни недели */}
      <div className="row-start-1 text-center text-xs text-gray-500 border-bottom"
      >{dayTitles[d]}</div>

      {/* Расходы по дням */}
      <div className="row-start-2 bg-gray-50 p-2 h-24 text-sm text-gray-700 border-bottom">
        <PeriodPayments payments={dayBalances.payments}/>
      </div>

      {/* Остатки на счетах по дням */}
      <div className="row-start-3 text-right text-xs border-bottom">
        {dayBalances.accounts.map((balanceObj, i) => (
          <BalanceCell
            key={`${i},${d}`}
            value={balanceObj.value}
            inferred={balanceObj.inferred}
            editable={true}
            onSubmit={(value: number) => {
              setBalance({
                accountId: balanceObj.account_id,
                atDate: balanceObj.atDate,
                value
              }) && refreshHandle();
            }}
          />
        ))}
      </div>

      {/* Итог за день */}
      <div key={`${d}_sum`} className="row-start-4 text-right text-xs">
        {dayBalances.balances_touched ? dayBalances.total : ""}
      </div>
    </>
  );
}
