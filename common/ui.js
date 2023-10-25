"use strict";

export function displayAccountTableData(data) {
    console.log('displayAccountTableData called')
    console.log(data)
    const tableId = 'account_by_days_table';
    const tableElem = document.getElementById(tableId)
    if (!tableElem) {
        console.error(`Elem with id: ${tableId} not found`)
        return
    }
    const tableHeaderElem = document.getElementById('account_by_days_table__dates_row')
    const tableBodyElem = document.getElementById('account_by_days_table__body')

    tableHeaderElem.append(document.createElement('td'))
    for (const dateStr of data.dates) {
        const td = document.createElement('td')
        td.textContent = dateStr
        tableHeaderElem.append(td)
    }

    for (const accountData of data.accounts) {
        const accountRow = document.createElement('tr')

        const titleCell = document.createElement('td')
        titleCell.textContent = accountData.name
        accountRow.append(titleCell)

        for (const balanceStr of accountData.balances) {
            const td = document.createElement('td')
            td.textContent = balanceStr
            accountRow.append(td)
        }

        tableBodyElem.append(accountRow)
    }
}
