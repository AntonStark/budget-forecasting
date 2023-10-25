document.getElementById('checkpoint_save_button').addEventListener('click', () => {
    window.close()
})

const renderAccountInputs = (data) => {
    const container = document.getElementById('checkpoint_accounts_container')

    for (const accountData of data.accounts) {
        const pElem = document.createElement('p')
        const labelElem = document.createElement('label')
        const inputElem = document.createElement('input')
        labelElem.textContent = accountData.name
        labelElem.htmlFor = inputElem.id = `account_balance_input_${accountData.name}`
        inputElem.type = 'number'
        pElem.append(labelElem, inputElem)
        container.append(pElem)
    }
}

const data = await window.data.getAll()
renderAccountInputs(data)
