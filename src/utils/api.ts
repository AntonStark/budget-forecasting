export async function getAccounts({dateStart, dateEnd}) {
    return fetch('/api/accounts?' + new URLSearchParams({
        date_start: dateStart,
        date_end: dateEnd,
    })).then((res) => res.json())
}

export async function setBalance({accountId, atDate, value}) {
    console.log('setBalance', {accountId, atDate, value})
    return fetch('/api/balance', {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            account_id: accountId,
            at_date: atDate,
            value: value,
        })
    }).then((res) => res.json())
}