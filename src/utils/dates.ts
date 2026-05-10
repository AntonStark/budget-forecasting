import {startOfMonth, endOfMonth, startOfWeek, addWeeks, endOfWeek, format} from "date-fns";

import {Mode} from "@/types";
import {ru} from "date-fns/locale";

export function euroWeekOffset(date: Date) {
  // go back `getUTCDay` number of days returns previous Sunday (count starts from Sunday)
  // 0..6 = Sunday .. Saturday
  // +6 % 7 makes
  // 6, 0, 1, .. 5 = Sunday .. Saturday => 0..6 = Monday .. Sunday
  return (date.getUTCDay() + 6) % 7;
}

function weekBounds(date: Date): [Date, Date] {
  const dateMonday = startOfWeek(date, { weekStartsOn: 1 });
  const dateSunday = endOfWeek(date, { weekStartsOn: 1 });
  return [dateMonday, dateSunday];
}

export function getWeek(date: Date): Week {
  const start = startOfWeek(date, { weekStartsOn: 1 });
  const end = endOfWeek(date, { weekStartsOn: 1 });
  return {start, end}
}


export function settingToIntervalDates(
  mode: Mode,
  currentDate: Date | undefined = undefined
): [Date, Date] {
  const today = currentDate || new Date();

  switch (mode) {
    case Mode.week:
      return weekBounds(today);
    case Mode.month:
      let monthStart = new Date(today);
      monthStart.setUTCDate(1);
      let monthEnd = new Date(monthStart)
      monthEnd.setUTCMonth(monthEnd.getUTCMonth() + 1, 0)
      return [monthStart, monthEnd];
    default:
      throw Error('Unknown type in mode: ' + mode)
  }
}

export const dateToDateString = (date) => `${date.getUTCDate()}`
export const dateToISODateString = (date) => date.toISOString().slice(0, 10)


export function dateToSql(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}

export function parseJsDateToSql(dateStr: string): string {
  const dt = new Date(dateStr);
  // вместо tz-aware создаём дату без таймзоны
  return dateToSql(dt);
}


export function formatMonth(date: Date) {
  return date.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}

export function formatWeek(date: Date) {
  const {start, end} = getWeek(date);
  return `${start.getDate()}–${end.getDate()} ${end.toLocaleDateString("en-US", {month: "short"})}`;
}


export const formatWeek2 = (week: Week) => (
  `${format(week.start, "d", {locale: ru})}-${format(week.end, "d MMM", {locale: ru})}`
);


export interface Week {
  start: Date,
  end: Date
}

export function getWeeksOfMonth(date = new Date()): Week[] {
  const monthStart = startOfMonth(date);
  const monthEnd = endOfMonth(date);

  const weeks: Week[] = [];

  let current = startOfWeek(monthStart, { weekStartsOn: 1 }); // 1 = понедельник

  while (current <= monthEnd) {
    const weekStart = current;
    const weekEnd = endOfWeek(current, { weekStartsOn: 1 });

    weeks.push({
      start: weekStart,
      end: weekEnd,
    });

    current = addWeeks(current, 1);
  }

  return weeks;
}
