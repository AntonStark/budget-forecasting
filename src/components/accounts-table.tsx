import {useState} from "react";

import {BalanceCell} from "@/components/balance-cell";
import {AccountData} from "@/types";
import {updateAccount} from "@/utils/api";
import {dateToDateString, dateToISODateString} from "@/utils/dates";


export type FocusCell = {
    account: number
    date: string
}

export function AccountTableWrapper({data}) {
    const [hideNotInUse, setHideNotInUse] = useState(true)
    const spanAccountsHidden = (
        <span id="account_by_days_table_annotation">
            Accounts not in use are hidden <a onClick={() => setHideNotInUse(false)}>show</a>
        </span>
    )
    const spanAccountsNotHidden = (
        <span id="account_by_days_table_annotation">
            Accounts not in use are shown <a onClick={() => setHideNotInUse(true)}>hide</a>
        </span>
    )

    return (
        <div id="account_by_days_table_wrapper">
            <AccountsTable data={data} hideNotInUse={hideNotInUse}/>
            {hideNotInUse ? spanAccountsHidden : spanAccountsNotHidden}
        </div>
    )
}


function AccountsTable({data, hideNotInUse}) {
    // console.log(data)
    if (!data) return

    const {accounts, dates, isoDates} = data
    const [focusCell, setFocusCell] = useState(undefined)

    const accountsInUse = accounts.filter(accountData => accountData.in_use)
    const accountsToDisplay = (hideNotInUse ? accountsInUse : accounts)

    return (
        <table id="account_by_days_table" className="styled-table">
            <thead>
                <AccountsTableHeader dates={dates} isoDates={isoDates}/>
            </thead>
            <tbody id="account_by_days_table__body">
            {
                accountsToDisplay.map(
                    (accountData) =>
                        <AccountRow accountData={accountData}
                                    isoDates={isoDates}
                                    focusCell={focusCell}
                                    setFocusCell={setFocusCell}
                                    key={accountData.name}/>
                )
            }</tbody>
        </table>
    )
}

const AccountsTableHeader = ({dates, isoDates}) => {
    // console.log(dates)
    const today = new Date()

    const makeClassNamesStr = (dateStr, index) => {
        const classNames = new Set()
        const date = new Date(isoDates[index])

        classNames.add("balance-cell")
        if (dateStr === dateToDateString(today)) {
            classNames.add("today")
        }
        if (date.getDay() === 6 || date.getDay() === 0) {
            classNames.add("weekend")
        }

        return (classNames.size ? Array.from(classNames).join(' ') : undefined)
    }

    return (
        <tr id="account_by_days_table__dates_row">
            <td key={"corner"}/>
            {/*insert empty cell at the corner*/}
            <td className="flag-in-use">in use</td>
            {
                dates.map((dateStr, index) =>
                    <td key={index} className={makeClassNamesStr(dateStr, index)}>
                        {dateStr}
                    </td>)
            }
        </tr>
    )
}

const AccountRow = ({accountData, isoDates, focusCell, setFocusCell}) => {
    const {id, name, in_use, balances}: AccountData = accountData
    // console.log('accountData', accountData)
    // console.log(`[RENDER AccountRow:${id}]`)

    const makeOptions = (index) => {
        const options = {}

        const today = new Date()
        if (isoDates[index] === dateToISODateString(today)) {
            options["today"] = true
        } else {
            options["protected"] = true
        }

        return options
    }

    const switchAccountUseFlag = async (e) => {
        // console.log('switchAccountUseFlag', e.target.checked)
        const res = await updateAccount(id, {inUse: e.target.checked})
        if (res.error) {
            // restore value in UI
            e.target.checked = !e.target.checked
        }
    }

    return (
        <tr>
            <td key={"title"}>{name}</td>
            <td className="flag-in-use"><input type="checkbox" defaultChecked={Boolean(in_use)} onChange={switchAccountUseFlag}/></td>
            {
                balances.map((balanceObj, index) =>
                    <BalanceCell
                        accountId={id}
                        date={isoDates[index]}
                        options={makeOptions(index)}
                        {...balanceObj}
                        focusCell={focusCell}
                        setFocusCell={setFocusCell}
                        key={`account_${id}-${isoDates[index]}`}
                    />)
            }
        </tr>
    )
}
