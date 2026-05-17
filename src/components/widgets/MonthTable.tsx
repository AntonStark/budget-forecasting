import React from "react";

import {formatWeek, getWeeksOfMonth} from "@/utils/dates";
import PeriodPayments from "@/components/widgets/PeriodPayments";
import {makeBudgetsByWeek, PeriodBudget} from "@/domain";

const BASE_WIDTH = 50;

export default function MonthTable({currentDate, payments, accounts}) {
  const weeks = getWeeksOfMonth(currentDate);
  const budgets = makeBudgetsByWeek(payments, accounts, weeks);

  return (
    <div className="bg-white rounded-2xl shadow-sm">
      <div className="p-4 overflow-x-auto">
        <div
          className="grid gap-1"
          style={{
            gridAutoColumns: `${BASE_WIDTH}px`,
            gridTemplateRows: "auto 1fr"
          }}
        >
          {/* Заголовки */}
          {weeks.map((week, i) => (
            <div
              key={`h${i}`}
              className="col-span-4 row-start-1 text-center text-xs text-gray-500"
              style={{borderBottom: "1px solid black"}}
            >
              <a href={`?mode=week&date=${week.start}`}>{formatWeek(week)}</a>
            </div>
          ))}
          {budgets.map((weekBudget, i) => <OneWeekColumn key={i} weekBudget={weekBudget}/>)}
        </div>
      </div>
    </div>
  );
}


function OneWeekColumn({weekBudget}: {weekBudget: PeriodBudget}) {
  return (
    <>
      {/* Контент */}
      <div
        className="col-span-4 row-start-2 bg-gray-50 p-2 h-40 overflow-auto"
        style={{borderBottom: "1px solid black"}}
      >
        <PeriodPayments payments={weekBudget.payments}/>
      </div>

      {/* Итоги */}
      <div className="col-span-4 row-start-3 text-right text-xs text-gray-300">
        {weekBudget.value_after.plan}
      </div>
      <div className="col-span-4 row-start-4 text-right text-xs">
        {weekBudget.value_after.fact || ""}
      </div>
    </>
  )
}
