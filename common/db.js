import { verbose } from "sqlite3"

const sqlite3 = verbose()


let db = new sqlite3.Database(':memory:', (err) => {
    if (err) {
        return console.error(err.message)
    }
    console.log('Connected to the in-memory SQlite database.')
});

db.close((err) => {
    if (err) {
        return console.error(err.message)
    }
    console.log('Close the database connection.')
})

function getDates() {
    let dates = null
    const datesSettingBlock = document.getElementById('dates_setting_block')
    const datesSetting = (
        Array.from(datesSettingBlock.children)
            .filter(elem => elem.tagName === 'INPUT' && elem.checked)
    )[0].value

    if (datesSetting === 'previous_7_days') {
        const today = new Date()
        const arrayRange = (start, stop, step) => Array.from(
            { length: (stop - start) / step + 1 },
            (value, index) => start + index * step
        )
        const dateDeltas = arrayRange(-7, 2, 1)
        dates = dateDeltas.map(days => {
            let res = new Date(today)
            res.setDate(res.getDate() + days)
            return res
        })
    }

    return dates
}

console.log(getDates())
