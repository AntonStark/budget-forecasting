import React from "react";

export default function MonthTable() {
  const weeks = ["Неделя 1", "Неделя 2", "Неделя 3", "Неделя 4"];

  return (
    <div className="rounded-2xl shadow-sm">
      <div className="p-4">
        <div className="grid grid-cols-4 gap-3">
          {weeks.map((week) => (
            <div key={week} className="text-xs text-gray-500">
              {week}
            </div>
          ))}

          {weeks.map((week, i) => (
            <div
              key={i}
              className="h-32 rounded-xl bg-gray-50 p-3 text-sm text-gray-700"
            >
              —
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
