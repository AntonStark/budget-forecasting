import {DateRangeSettings} from "@/types";

function settingToIntervalDates(datesSetting: DateRangeSettings): [Date, Date] {
    const today = new Date()

    let dateStart, dateEnd, deltas
    switch (datesSetting) {
        case DateRangeSettings.Weekly:
            // go back `getUTCDay` number of days returns previous Sunday (count starts from Sunday)
            // and +1 makes this week's Monday
            // 0..6 = sunday .. saturday
            // +6 % 7
            // 6, 0, 1, .. 5 = sunday .. saturday
            const properWeekDay = (today.getUTCDay() + 6) % 7
            dateStart = new Date(today)
            dateStart.setUTCDate(dateStart.getUTCDate() - properWeekDay)
            dateEnd = new Date(dateStart)
            dateEnd.setUTCDate(dateEnd.getUTCDate() + 6)
            break
        case DateRangeSettings.Monthly:
            dateStart = new Date(today)
            dateStart.setUTCDate(1)
            dateEnd = new Date(dateStart)
            dateEnd.setUTCMonth(dateEnd.getUTCMonth() + 1, 0)
            break
        case DateRangeSettings.Previous_7_Days:
            deltas = [-7, 2]
            break
        default:
            throw Error('Unknown type in datesSetting: ' + datesSetting)
    }

    if (dateStart) {
        return [dateStart, dateEnd]
    }
    return deltas.map(days => {
        let res = new Date(today)
        res.setUTCDate(res.getUTCDate() + days)
        return res
    })
}

export const dateToDateString = (date) => `${date.getUTCDate()}`
export const dateToISODateString = (date) => date.toISOString().slice(0, 10)

export function settingToIntervalBounds(datesSetting: DateRangeSettings): [string, string] {
    const dateBounds = settingToIntervalDates(datesSetting)
    // @ts-ignore
    return dateBounds.map(dateToISODateString)
}

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
