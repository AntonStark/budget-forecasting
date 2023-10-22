"use strict";

import { displayAccountTableData } from "./ui.js"


async function requestData(e) {
    const data = await window.data.getAll()
    displayAccountTableData(data)
}

document.getElementById('get_data_button').addEventListener('click', requestData)
