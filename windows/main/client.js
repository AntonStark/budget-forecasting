"use strict";

import { displayAccountTableData } from "../../common/ui.js"


async function requestData() {
    const data = await window.data.getAll()
    displayAccountTableData(data)
}

document.getElementById('get_data_button').addEventListener('click', requestData)
document.getElementById('display_checkpoint_window_button').addEventListener('click', () => {
    window.gui.displayCheckpointWindow()
})
