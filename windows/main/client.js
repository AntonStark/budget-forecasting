"use strict";

import { displayAccountTableData } from "../../common/ui.js"


async function requestData() {
    const data = await window.data.getAll()
    displayAccountTableData(data)
}
requestData()

document.getElementById('display_checkpoint_window_button').addEventListener('click', () => {
    window.gui.displayCheckpointWindow()
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
