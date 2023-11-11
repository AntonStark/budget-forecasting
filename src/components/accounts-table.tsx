import {AccountData} from "@/types";
import {dateToDateString, dateToISODateString} from "@/utils/dates";
import {BalanceCell} from "@/components/balance-cell";


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

    return (
        <table id="account_by_days_table" className="styled-table">
            <thead>
                <AccountsTableHeader dates={dates}/>
            </thead>
            <tbody id="account_by_days_table__body">{
                accounts.map(
                    (accountData) =>
                        <AccountRow accountData={accountData} isoDates={isoDates} key={accountData.name}/>
                )
            }</tbody>
        </table>
    )
}

const AccountsTableHeader = ({dates}) => {
    // console.log(dates)
    const today = new Date()

    return (
        <tr id="account_by_days_table__dates_row">
            <td key={"corner"}/>
            {/*insert empty cell at the corner*/}
            {
                dates.map((dateStr, index) =>
                    <td key={index} className={(dateStr === dateToDateString(today) ? "today" : "")}>
                        {dateStr}
                    </td>)
            }
        </tr>
    )
}

const AccountRow = ({accountData, isoDates}) => {
    const {id, name, balances}: AccountData = accountData

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
                    <BalanceCell balance={balanceObj} accountId={id} date={isoDates[index]} options={makeOptions(index)}
                                 key={`account_${id}-${isoDates[index]}`}/>)
            }
        </tr>
    )
}
