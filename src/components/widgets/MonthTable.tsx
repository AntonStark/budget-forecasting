'use client'

import Link from "next/link";
import React from "react";

import {PaymentChip} from "@/components/widgets/PaymentChip";
import {usePlannerContext} from "@/components/context/PlannerProvider";
import {makeBudgetsByWeek, PeriodBudget} from "@/domain";
import {Mode} from "@/types";
import {formatWeek} from "@/utils/dates";
import {serializeSearchParams} from "@/utils/searchParams";

const BASE_WIDTH = 66;

export default function MonthTable({weeks, payments, accounts}) {
  const { setMode } = usePlannerContext();

  const periods: PeriodBudget[] = makeBudgetsByWeek(payments, accounts, weeks);

  const nPayments = periods.map(week => week.payments.length);
  const paymentNRows = nPayments.reduce((a, b) => Math.max(a, b), 0) + 2;

  let paymentRowsTemplate: string[] = [];
  for (let n = 1; n <= paymentNRows; ++n) {
    paymentRowsTemplate.push(`[payments-${n}] auto`);
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm">
      <div className="p-4 overflow-x-auto">
        <div
          className={`grid grid-cols-${3 * weeks.length}`}
          style={{
            gridAutoColumns: `${BASE_WIDTH}px`,
            gridTemplateRows: `
            [header] auto
            ${paymentRowsTemplate.join('\n')}
            [plan-total] auto
            [fact-total] auto`
          }}
        >
          {/* Заголовки */}
          {weeks.map((week, i) => (
            <div
              key={`h${i}`}
              className="col-span-3 z-20 text-center text-xs text-gray-500"
              style={{gridRow: "header", gridColumnStart: 3 * i + 1}}
            >
              <Link
                href={`${Mode.week}?${serializeSearchParams(week.start)}`}
                onNavigate={() => setMode(Mode.week)}
              >{formatWeek(week)}</Link>
            </div>
          ))}

          {/* ЭЛЕМЕНТЫ ФОНА */}
          <div className="border-b z-10" style={{gridRow: "header", gridColumn: `1 / ${3 * weeks.length + 1}`}}/>
          <div className="h-20" style={{gridRow: `payments-${paymentNRows}`, gridColumn: `1 / ${3 * weeks.length + 1}`}}/>
          <div className="border-t z-10" style={{gridRow: "plan-total", gridColumn: `1 / ${3 * weeks.length + 1}`}}/>

          {/* Контент */}
          {periods.map((week, w_i) => (
            <React.Fragment key={w_i}>
              {/* Подложка колонок с текстом */}
              <div className={`col-span-2 ${week.period.active ? "bg-blue-50" : "bg-gray-50"}`}
                   style={{gridRow: `header / -1`, gridColumnStart: 3 * w_i + 1}}/>

              {/* Расходы */}
              {week.payments.map((pData, r_i) => (
                <PaymentChip payment={pData} periodIndex={w_i} rowIndex={r_i} key={r_i}/>
              ))}

              {/* Итоги */}
              <div
                className="col-span-3 text-right p-1 text-xs text-gray-500"
                style={{gridRow: "plan-total", gridColumnStart: 3 * w_i + 1}}>
                {week.value_after.plan}
              </div>
              <div
                className="col-span-3 text-right px-1 text-xs"
                style={{gridRow: "fact-total", gridColumnStart: 3 * w_i + 1}}>
                {week.value_after.fact || ""}
              </div>

              {/* Вертикальная граница колонки, кроме последней */}
              {w_i !== periods.length - 1 && (
                <div className="border-l z-10 border-gray-300"
                     style={{gridColumnStart: 3 * w_i + 4, gridRow: "1 / -1", width: 0}}/>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
