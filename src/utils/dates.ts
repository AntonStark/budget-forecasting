export function settingToDateStringsArray(datesSetting): Array<string> | undefined {
    const today = new Date()

    let depth, dates
    if (datesSetting === "previous_7_days") {
        depth = -7
    } else if (datesSetting === "previous_30_days") {
        depth = -30
    }

    if (depth) {
        const arrayRange = (start, stop, step) => Array.from(
            {length: (stop - start) / step + 1},
            (value, index) => start + index * step
        )
        const dateDeltas = arrayRange(depth, 2, 1)
        dates = dateDeltas.map(days => {
            let res = new Date(today)
            res.setDate(res.getDate() + days)
            return res.toLocaleDateString('en', {month: "short", day: "numeric"})
        })
    }
    return dates
}

export const dateToDateString = (date) => `${date.getUTCFullYear()}-${date.getUTCMonth()+1}-${date.getUTCDate()}`
export const dateToISODateString = (date) => date.toISOString().slice(0, 10)

export function settingToIntervalBounds(datesSetting): [string, string] {
    const today = new Date()
    const advance = 2

    let depth, bounds
    if (datesSetting === "previous_7_days") {
        depth = -7
    } else if (datesSetting === "previous_30_days") {
        depth = -30
    }

    if (depth) {
        bounds = [depth, advance].map(days => {
            let res = new Date(today)
            res.setDate(res.getDate() + days)
            return dateToISODateString(res)
        })
    }
    return bounds
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
