import React from "react";

import {saveOnceOfPayment, setBalance, updateOnceOfPayment} from "@/adapters/api";
import BalanceCell from "@/components/widgets/BalanceCell";
import {PaymentChipAppender, PaymentChipCompact} from "@/components/widgets/PeriodPayments";
import {balancesByWeekday} from "@/domain";
import {AccountBalance, AccountData, PaymentData} from "@/types";
import {getWeek} from "@/utils/dates";


export default function WeekTable({currentDate, payments, accounts, refreshHandle}: {
  currentDate: Date,
  payments: PaymentData[],
  accounts: AccountData[],
  refreshHandle: () => void,
}) {
  const week = getWeek(currentDate);
  const dayTitles = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

  const dailyInfo = balancesByWeekday(payments, accounts, week);
  const nPayments = dailyInfo.map(dayInfo => dayInfo.payments.length);
  const paymentNRows = nPayments.reduce((a, b) => Math.max(a, b), 0) + 2;

  let paymentRowsTemplate = [];
  for (let n = 1; n <= paymentNRows; ++n) {
    paymentRowsTemplate.push(`[payment-${n}-v] auto [payment-${n}-d] auto`);
  }

  function makeSubmitDayPayment(date: string): (arg0: number) => void {
    return (amount) => {
      saveOnceOfPayment({ amount, description: '?', plannedAt: {date} }).then(() => refreshHandle());
    }
  }
  function makeUpdateDescription(payment: PaymentData): (arg0: string) => void {
    return (newDescription) => {
      updateOnceOfPayment({description: newDescription}, payment.id).then(() => refreshHandle());
    }
  }
  function makeSetBalance(balanceObj: AccountBalance): (arg0: number) => void {
    return (value: number) => {
      setBalance({
        accountId: balanceObj.account_id,
        atDate: balanceObj.atDate,
        value
      }).then(() => refreshHandle());
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm">
      <div className="p-4">
        <div
          className="grid grid-cols-16"
          style={{
            gridTemplateRows: `
            [header] auto
            ${paymentRowsTemplate.join('\n')}
            [balances] auto
            [totals] auto`
          }}>

          {/* ПЕРВАЯ КОЛОНКА */}
          {/* Заголовки счетов*/}
          <div className="col-span-2 text-right text-xs" style={{gridRow: "balances", gridColumnStart: 1}}>
            {accounts.map((acc) => <div key={`a_${acc.id}`}>{acc.title}</div>)}
          </div>

          {/* ПЕРВАЯ СТРОКА */}
          {/* Заголовки - дни недели */}
          {dayTitles.map((day, d) => (
            <div key={`h_${d}`} className="col-span-2 text-center text-sm text-gray-500"
                 style={{gridRow: "header", gridColumnStart: 2 * d + 3}}
            >{day}</div>
          ))}

          {/* ЭЛЕМЕНТЫ ФОНА */}
          <div className="border-t" style={{gridRow: "payment-1-v", gridColumn: "1 / -1"}}/>
          {Array.from({length: paymentNRows}, (v, i) => (
            <div key={`bg_${i}`}
                 className="bg-gray-50"
                 style={{gridRow: `payment-${i + 1}-d`, gridColumn: "1 / -1"}}/>
          ))}
          <div className="border-b h-20" style={{gridRow: `payment-${paymentNRows}-v`, gridColumn: "1 / -1"}}/>
          <div className="border-t" style={{gridRow: "totals", gridColumn: "1 / -1"}}/>

          {/* КОЛОНКИ ДНЕЙ */}
          {dailyInfo.map((dInfo, d) => (
            <React.Fragment key={d}>
              {/* Расходы */}
              {dInfo.payments.map((pData, pi) => (
                <PaymentChipCompact payment={pData} onUpdate={makeUpdateDescription(pData)} rowIndex={pi} colIndex={d}
                                    key={`p_${d}_${pi}`}/>
              ))}
              <PaymentChipAppender onSubmit={makeSubmitDayPayment(dInfo.date)} rowIndex={dInfo.payments.length}
                                   colIndex={d}/>

              {/* Остатки на счетах */}
              <div className="col-span-2 text-right text-xs"
                   style={{gridRow: "balances", gridColumnStart: 2 * d + 3}}>
                {dInfo.accounts.map((balanceObj, i) => (
                  <BalanceCell
                    value={balanceObj.value}
                    inferred={balanceObj.inferred}
                    onSubmit={makeSetBalance(balanceObj)}
                    key={`${i},${d}`}
                  />
                ))}
              </div>

              {/* Итог за день */}
              <div className="col-span-2 text-right text-xs" style={{gridRow: "totals", gridColumnStart: 2 * d + 3}}>
                {dInfo.balances_touched ? dInfo.total : ""}
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
