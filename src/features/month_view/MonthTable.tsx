'use client'

import Link from "next/link";
import React from "react";

import {
  makeCategoryConfig,
  makePaymentLayoutByCategory,
  makeSimplePaymentLayout,
  PaymentSection
} from "@/features/month_view/PaymentSection";
import {usePlannerContext} from "@/shared/contexts/PlannerProvider";
import {useDisplaySettingsContext} from "@/shared/contexts/DisplayContext";

import {makeBudgetsByWeek, PeriodBudget} from "@/domain";
import {AccountData, Mode, PaymentOutSchema, PaymentsSort} from "@/types";
import {formatWeek, Week} from "@/utils/dates";
import {serializeSearchParams} from "@/utils/searchParams";

const BASE_WIDTH = 66;

export default function MonthTable({weeks, payments, accounts}: {
  weeks: Week[],
  payments: PaymentOutSchema[],
  accounts: AccountData[]
}) {
  const { setMode } = usePlannerContext();
  const { paymentsSort } = useDisplaySettingsContext();

  const categoryConfig = makeCategoryConfig(payments);
  const periods: PeriodBudget[] = makeBudgetsByWeek(payments, accounts, weeks);

  let paymentsLayout = (
    paymentsSort === PaymentsSort.asIs
      ? makeSimplePaymentLayout(periods)
      : makePaymentLayoutByCategory(periods, categoryConfig)
  );

  return (
    <div className="bg-white rounded-2xl shadow-sm">
      <div className="p-4 overflow-x-auto">
        <div
          className={`grid grid-cols-${3 * weeks.length}`}
          style={{
            gridAutoColumns: `${BASE_WIDTH}px`,
            gridTemplateRows: `
            [header] auto
            ${paymentsLayout.gridTemplateRows}
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
          <div className="border-t z-10" style={{gridRow: "plan-total", gridColumn: `1 / ${3 * weeks.length + 1}`}}/>

          {/* Контент */}
          <PaymentSection periods={periods} paymentsLayout={paymentsLayout} categoryDisplayConfig={categoryConfig}/>

          {periods.map((week, w_i) => (
            <React.Fragment key={w_i}>
              {/* Фон колонок описания */}
              <div className={`col-span-2 ${week.period.active ? "bg-blue-50" : "bg-gray-50"}`}
                   style={{gridRow: `header / -1`, gridColumnStart: 3 * w_i + 1}}/>

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
