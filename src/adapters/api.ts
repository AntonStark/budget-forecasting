import {OncePaymentData, ScheduledPaymentData} from "@/types";
import {dateToSql} from "@/utils/dates";

// ==== ACCOUNTS ====


export async function getAccounts({dateStart, dateEnd, inUseOnly = true}) {
    return doJsonGet('/api/accounts', {
        date_start: dateStart,
        date_end: dateEnd,
        in_use: String(inUseOnly),
    });
}

export async function setBalance({accountId, atDate, value}) {
    console.log('setBalance', {accountId, atDate, value});
    return doJsonPost('/api/balance', {account_id: accountId, at_date: atDate, value});
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


// ==== PAYMENTS ====


export async function getPayments(dateStart: Date, dateEnd: Date) {
    return doJsonGet('/api/payments', {
        date_start: dateToSql(dateStart),
        date_end: dateToSql(dateEnd),
    })
}

export async function saveOnceOfPayment(expenseFormData: OncePaymentData) {
    const {amount, description} = expenseFormData;
    return await doJsonPost('/api/payments', {description, amount, at_date: expenseFormData.plannedAt.date});
}

export async function saveScheduledPayment(expenseFormData: ScheduledPaymentData) {
    const {amount, description, schedule} = expenseFormData;
    return await doJsonPost('/api/payments/with_schedule', {description, amount, schedule});
}


// ==== HELPERS ====

async function doJsonPost(url: string, bodyArg: any) {
    return fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(bodyArg)
    }).then((res) => res.json());
}

async function doJsonGet(url: string, queryparams: Record<string, any>) {
    return fetch(
      (url.endsWith('?') ? url : `${url}?`)
      + new URLSearchParams(queryparams)).then((res) => res.json()
    );
}
