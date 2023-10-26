"use strict";

import { displayAccountTableData } from "../../common/ui.js"
import { AccountsDAO } from "../../common/accounts_dao.js"

function getDates() {
    let dateStart, dateEnd

    const datesSettingBlock = document.getElementById('dates_setting_block')
    const datesSetting = (
        Array.from(datesSettingBlock.children)
            .filter(elem => elem.tagName === 'INPUT' && elem.checked)
    )[0].value

    if (datesSetting === 'previous_7_days') {
        dateStart = new Date()
        dateStart.setDate(-7)
        dateEnd = new Date()
        dateEnd.setDate(2)
    }

    return [dateStart, dateEnd]
}

async function requestData() {
    const data = await window.data.getAll()
    displayAccountTableData(data)

    const accounts_dao = new AccountsDAO()
    accounts_dao.setDates(...getDates())
}
requestData()

document.getElementById('display_checkpoint_window_button').addEventListener('click', () => {
    window.gui.displayCheckpointWindow()
})

console.log(getDates())
