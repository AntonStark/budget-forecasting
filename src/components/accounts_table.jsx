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

    const {accounts, dates} = data

    return (
        <table id="account_by_days_table" className="styled-table">
            <thead>
                <AccountsTableHeader dates={dates}/>
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

const AccountsTableHeader = ({dates}) => {
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
