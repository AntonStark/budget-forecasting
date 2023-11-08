export async function getAccounts({dateStart, dateEnd}) {
    return fetch('/api/get-accounts?' + new URLSearchParams({
        date_start: dateStart,
        date_end: dateEnd,
    })).then((res) => res.json())
}
