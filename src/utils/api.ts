import {ExpenseFormData} from "@/types";
import {dateToISODateString} from "@/utils/dates";

export async function getAccounts({dateStart, dateEnd, inUseOnly = true}) {
    return fetch('/api/accounts?' + new URLSearchParams({
        date_start: dateStart,
        date_end: dateEnd,
        in_use: String(inUseOnly),
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

export async function updateAccount(id, {inUse}) {
    console.log(`updateAccount id:${id}`, {inUse})
    return fetch('/api/accounts/' + id, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            in_use: inUse,
        })
    }).then((res) => res.json())
}

export async function getPayments(dateStart: Date, dateEnd: Date) {
    return fetch('/api/payments?' + new URLSearchParams({
        date_start: dateToISODateString(dateStart),
        date_end: dateToISODateString(dateEnd),
    })).then((res) => res.json())
}

async function saveOnceOfPayment({description, amount, atDate}) {
    return fetch('/api/payments', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({description, amount, at_date: atDate})
    }).then((res) => res.json())
}

export async function savePayment(expenseFormData: ExpenseFormData) {
    const {amount, description} = expenseFormData;
    if (expenseFormData.type === "once") {
        // @ts-ignore
        const atDate = expenseFormData.plannedAt.date;
        await saveOnceOfPayment({amount, description, atDate});
    }
}


export async function saveBalance({accountId, atDate, value}) {
    return fetch('/api/balance', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({account_id: accountId, at_date: atDate, value})
    }).then((res) => res.json());
}
