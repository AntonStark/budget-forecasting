import {addDays, addWeeks, endOfMonth, endOfWeek, format, startOfMonth, startOfWeek} from "date-fns";

import {Mode} from "@/types";
import {ru} from "date-fns/locale";

export function euroWeekOffset(date: Date) {
  // go back `getUTCDay` number of days returns previous Sunday (count starts from Sunday)
  // 0..6 = Sunday .. Saturday
  // +6 % 7 makes 6, 0, 1, .. 5 = Sunday .. Saturday => 0..6 = Monday .. Sunday
  return (date.getUTCDay() + 6) % 7;
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
      const dateMonday = startOfWeek(today, { weekStartsOn: 1 });
      const dateSunday = endOfWeek(today, { weekStartsOn: 1 });
      return [dateMonday, dateSunday];
    case Mode.month:
      let monthStart = new Date(today);
      monthStart.setUTCDate(1);
      let monthEnd = new Date(monthStart)
      monthEnd.setUTCMonth(monthEnd.getUTCMonth() + 1, 0)
      return [monthStart, monthEnd];
    default:
      throw Error('Unknown type in mode: ' + mode);
  }
}

export const dateToDateString = (date: Date): string => `${date.getUTCDate()}`;
export const dateToSql = (date: Date): string => format(date, 'yyyy-MM-dd');

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

export const formatWeek = (week: Week) => (
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


export const nextDay = (date: Date) => addDays(date, 1);

export function makeDatesGivenNumber(
  intervalStart: Date,
  intervalEnd: Date | undefined,
  day: number,
  limit: number = undefined,
): Array<Date> {
  // console.log({intervalStart, intervalEnd, day, limit, regularMode})

  let atDay: Date;
  atDay = new Date(intervalStart);
  atDay.setDate(day);
  if (atDay < intervalStart) {
    atDay.setMonth(atDay.getMonth() + 1);
  }

  const result: Array<Date> = []
  while (intervalEnd ? atDay < intervalEnd : result.length < (limit || 1)) {
    result.push(new Date(atDay));
    atDay.setMonth(atDay.getMonth() + 1);
  }
  return result;
}

export function makeDatesGivenWeekday(
  intervalStart: Date,
  intervalEnd: Date | undefined,
  day: number,
  limit: number = undefined,
) {
  let atDay: Date;
  atDay = addDays(startOfWeek(intervalStart, { weekStartsOn: 1 }), day - 1);
  if (atDay < intervalStart) {
    atDay.setDate(atDay.getDate() + 7);
  }

  const result: Array<Date> = []
  while (intervalEnd ? atDay < intervalEnd : result.length < (limit || 1)) {
    result.push(new Date(atDay));
    atDay.setDate(atDay.getDate() + 7);
  }
  return result;
}
