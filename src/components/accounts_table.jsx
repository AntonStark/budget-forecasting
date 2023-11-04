export function AccountTableWrapper({data}) {
    return (
        <div id="account_by_days_table_wrapper">
            <AccountsTable data={data}/>
        </div>
    )
}

function AccountsTable({data}) {
    console.log(data)
    if (!data) return

    const {accounts, dates, dateRange} = data

    return (
        <table id="account_by_days_table" className="styled-table">
            <thead>
                <AccountsTableHeader dates={dates} dateRange={dateRange}/>
            </thead>
            <tbody id="account_by_days_table__body">{
                accounts.map(
                    (accountData) =>
                        <AccountRow accountData={accountData} key={accountData.name}/>
                )
            }</tbody>
        </table>
    )
}

const AccountsTableHeader = ({dates, dateRange}) => {
    console.log(dates, dateRange)

    if (dateRange === "previous_7_days" || dateRange === "previous_30_days") {
        const today = new Date()
        const depth = (dateRange === "previous_7_days" ? -7 : -30)
        const arrayRange = (start, stop, step) => Array.from(
            { length: (stop - start) / step + 1 },
            (value, index) => start + index * step
        )
        const dateDeltas = arrayRange(depth, 2, 1)
        dates = dateDeltas.map(days => {
            let res = new Date(today)
            res.setDate(res.getDate() + days)
            return res.toLocaleDateString('en', {month: "short", day: "numeric"})
        })
    }

    return (
        <tr id="account_by_days_table__dates_row">
            <td key={"corner"}/>
            {/*insert empty cell at the corner*/}
            {
                dates.map((dateStr, index) =>
                    <td key={index}>{dateStr}</td>)
            }
        </tr>
    )
}

const AccountRow = ({accountData}) => {
    const {name, balances} = accountData

    return (
        <tr>
            <td key={"title"}>{name}</td>
            {balances.map((balanceStr, index) =>
                <td key={index}>{balanceStr}</td>)
            }
        </tr>
    )
}
