"use strict";

import { displayAccountTableData } from "../../common/ui.js"


async function requestData() {
    const data = await window.data.getAll()
    displayAccountTableData(data)
}

function displayCheckpointWindow() {
    window.gui.displayCheckpointWindow()
}

document.getElementById('get_data_button').addEventListener('click', requestData)
document.getElementById('display_checkpoint_window_button').addEventListener('click', displayCheckpointWindow)
