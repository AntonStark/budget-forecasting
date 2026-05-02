import React from "react";

import {PaymentData} from "@/types";
import {formatWeek2, getWeeksOfMonth, Week} from "@/utils/dates";
import PeriodPayments from "@/components/widgets/PeriodPayments";

function groupPaymentsByWeek(payments: PaymentData[], weeks: Week[]) {
  return weeks.map((week) => {
    return payments.filter((p) => {
      const d = new Date(p.at_date);
      return week.start <= d && d <= week.end;
    });
  });
}

const BASE_WIDTH = 50;

export default function MonthTable({currentDate, payments}) {
  const weeks = getWeeksOfMonth(currentDate);
  const grouped = groupPaymentsByWeek(payments, weeks);

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
              className="col-span-4 row-start-1 text-xs text-gray-500"
              style={{borderBottom: "1px solid black"}}
            >
              <a href={`?mode=week&date=${week.start}`}>{formatWeek2(week)}</a>
            </div>
          ))}

          {/* Контент */}
          {grouped.map((weekPayments, i) => (
          <div
            key={i}
            className="col-span-4 row-start-2 bg-gray-50 p-2 h-40 overflow-auto"
            style={{borderBottom: "1px solid black"}}
          >
            <PeriodPayments payments={weekPayments}/>
          </div>
          ))}

          {/* Подвал */}
          {grouped.map((weekPayments, i) => (
          <div
            key={i}
            className="col-span-4 text-right"
          >
            итог
          </div>
          ))}
        </div>
      </div>
    </div>
  );
}
