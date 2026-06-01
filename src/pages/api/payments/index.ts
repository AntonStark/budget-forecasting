import {Database} from "better-sqlite3";
import {NextApiRequest, NextApiResponse} from "next";

import {connect} from "@/utils/database";
import {PaymentData, ScheduleShortSchema} from "@/types";
import {createPayment, ensureScheduledPayments, listPayments, updatePayment} from "@/sqlite/payments";

let db: Database = null

export default async (req: NextApiRequest, rep: NextApiResponse) => {
    // console.log(req)
    switch (req.method) {
        case 'GET':
            console.log('GET /api/payments/');
            await handleListPayments(req, rep);
            break;
        case 'POST':
            console.log('POST /api/payments/');
            await handleCreatePayment(req, rep);
            break;
        case 'PATCH':
            console.log('PUT /api/payments/');
            await handleUpdatePayment(req, rep);
            break;
    }
}

async function handleListPayments(req: NextApiRequest, res: NextApiResponse) {
    let {date_start, date_end} = req.query;
    date_start = Array.isArray(date_start) ? date_start[0] : date_start;
    date_end = Array.isArray(date_end) ? date_end[0] : date_end;

    db = connect(db);

    ensureScheduledPayments(db, date_end);
    const payments = listPayments(db, date_start, date_end)
    // console.log(payments)

    res.status(200).json({
        payments: payments.map((paymentObj: PaymentData) => ({
            id: paymentObj.id,
            description: paymentObj.description,
            at_date: paymentObj.at_date,
            amount: paymentObj.amount,
            value: serializePaymentValue(paymentObj),
            account_id: paymentObj.account_id,
            schedule: serializeScheduleInfo(paymentObj)
        }))
    })
}

async function handleCreatePayment(req: NextApiRequest, res: NextApiResponse) {
    const {description, amount, at_date} = req.body;

    db = connect(db);
    console.log('description', description);

    createPayment(db, {description, amount, at_date})

    res.status(200).json(JSON.stringify({status: "OK"}));
}

async function handleUpdatePayment(req: NextApiRequest, res: NextApiResponse) {
    const {id, description, amount, at_date} = req.body;

    db = connect(db);

    updatePayment(db, amount, description, at_date, id);

    res.status(200).json(JSON.stringify({status: "OK"}));
}

function serializePaymentValue(paymentObj: PaymentData): string {
    if (!paymentObj.currency_iso_code && !paymentObj.amount) {
        return ''
    }
    if (paymentObj.currency_iso_code) {
        if (paymentObj.currency_iso_code.toUpperCase() === 'RUB') {
            return `${paymentObj.amount}${paymentObj.currency_symbol}`
        } else {
            return `${paymentObj.currency_symbol}${paymentObj.amount}`
        }
    } else {
        return String(paymentObj.amount);
    }
}

function serializeScheduleInfo(paymentObj: PaymentData): ScheduleShortSchema {
    return {
        type: paymentObj.schedule_type,
        number: paymentObj.schedule_number,
        date_start: paymentObj.schedule_date_start
    };
}
