import {Mode} from "@/types";

function weekBounds(weekday: Date): [Date, Date] {
  // go back `getUTCDay` number of days returns previous Sunday (count starts from Sunday)
  // 0..6 = Sunday .. Saturday
  // +6 % 7 makes
  // 6, 0, 1, .. 5 = Sunday .. Saturday => 0..6 = Monday .. Sunday
  const euroWeekOffset = (weekday.getUTCDay() + 6) % 7;

  let dateMonday = new Date(weekday);
  dateMonday.setUTCDate(dateMonday.getUTCDate() - euroWeekOffset);
  let dateSunday = new Date(dateMonday);
  dateSunday.setUTCDate(dateSunday.getUTCDate() + 6);
  return [dateMonday, dateSunday];
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

export function dateIntervalToDatesArray([dateStartStr, dateEndStr]): Array<Date> {
  const d1 = new Date(dateStartStr + ' 00:00:00.000Z')
  const d2 = new Date(dateEndStr + ' 00:00:00.000Z')

  const _MS_PER_DAY = 1000 * 60 * 60 * 24
  const utc1 = Date.UTC(d1.getFullYear(), d1.getMonth(), d1.getDate())
  const utc2 = Date.UTC(d2.getFullYear(), d2.getMonth(), d2.getDate())
  const daysCount = Math.floor(Math.abs(utc2 - utc1) / _MS_PER_DAY) + 1
  const dateStart = new Date(Math.min(d1.getTime(), d2.getTime()))

  return Array.from({length: daysCount}, (_, dayDiff) => {
    let res = new Date(dateStart)
    res.setDate(res.getDate() + dayDiff)
    return res
  })
}

export function formatMonth(date: Date) {
  return date.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}

export function formatWeek(date: Date) {
  const start = new Date(date);
  const day = start.getDay() || 7;
  start.setDate(start.getDate() - day + 1);

  const end = new Date(start);
  end.setDate(start.getDate() + 6);

  return `${start.getDate()}–${end.getDate()} ${end.toLocaleDateString("en-US", {
    month: "short",
  })}`;
}
