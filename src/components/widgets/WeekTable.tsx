import React from "react";

export default function WeekTable() {
  const days = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

  return (
    <div className="rounded-2xl shadow-sm">
      <div className="p-4">
        <div className="grid grid-cols-7 gap-2">
          {days.map((day) => (
            <div key={day} className="text-xs text-gray-500">
              {day}
            </div>
          ))}

          {days.map((day, i) => (
            <div
              key={i}
              className="h-24 rounded-xl bg-gray-50 p-2 text-sm text-gray-700"
            >
              —
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
