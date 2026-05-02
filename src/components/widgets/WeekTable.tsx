import React from "react";

import {euroWeekOffset, getWeek} from "@/utils/dates";
import {PaymentData} from "@/types";
import PeriodPayments from "@/components/widgets/PeriodPayments";

function groupByWeekday(items: PaymentData[]) {
  const result: PaymentData[][] = Array.from({ length: 7 }, () => []);

  for (const item of items) {
    const day = euroWeekOffset(new Date(item.at_date));
    result[day].push(item);
  }

  return result;
}

export default function WeekTable({currentDate, payments}: {currentDate: Date, payments: PaymentData[]}) {
  const week = getWeek(currentDate);
  const weekPayments = payments.filter((p) => {
    const d = new Date(p.at_date);
    return week.start <= d && d <= week.end;
  });
  const days = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

  return (
    <div className="bg-white rounded-2xl shadow-sm">
      <div className="p-4">
        <div className="grid grid-cols-7 gap-1">
          {/* Заголовки */}
          {days.map((day) => (
            <div
              key={day}
              className="row-start-1 text-xs text-gray-500"
              style={{borderBottom: "1px solid black"}}
            >{day}</div>
          ))}

          {/* Контент */}
          {groupByWeekday(weekPayments).map((dayPayments, i) => (
            <div
              key={i}
              className="row-start-2 bg-gray-50 p-2 h-24 text-sm text-gray-700"
              style={{borderBottom: "1px solid black"}}
            >
              <PeriodPayments payments={dayPayments}/>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
