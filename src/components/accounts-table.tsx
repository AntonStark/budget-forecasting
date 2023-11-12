import {AccountData} from "@/types";
import {dateToDateString, dateToISODateString} from "@/utils/dates";
import {BalanceCell} from "@/components/balance-cell";
import {useState} from "react";


export type FocusCell = {
    account: number
    date: string
}

export function AccountTableWrapper({data}) {
    return (
        <div id="account_by_days_table_wrapper">
            <AccountsTable data={data}/>
        </div>
    )
}


function AccountsTable({data}) {
    // console.log(data)
    if (!data) return

    const {accounts, dates, isoDates} = data
    const [focusCell, setFocusCell] = useState(undefined)

    return (
        <table id="account_by_days_table" className="styled-table">
            <thead>
                <AccountsTableHeader dates={dates}/>
            </thead>
            <tbody id="account_by_days_table__body">{
                accounts.map(
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

const AccountsTableHeader = ({dates}) => {
    // console.log(dates)
    const today = new Date()

    const makeClassNamesStr = (dateStr, index) => {
        const classNames = new Set()
        const date = new Date(dateStr)

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
    const {id, name, balances}: AccountData = accountData
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

    return (
        <tr>
            <td key={"title"}>{name}</td>
            {
                balances.map((balanceObj, index) =>
                    <BalanceCell accountId={id}
                                 date={isoDates[index]}
                                 options={makeOptions(index)}
                                 {...balanceObj}
                                 focusCell={focusCell}
                                 setFocusCell={setFocusCell}
                                 key={`account_${id}-${isoDates[index]}`}/>)
            }
        </tr>
    )
}
