import {Database} from "better-sqlite3";
import {NextApiRequest, NextApiResponse} from "next";

import {connect} from "@/utils/database";
import {PaymentData} from "@/types";
import {createOneTimePayment, listOneTimePayments} from "@/sqlite/payments";

let db: Database = null

export default async (req: NextApiRequest, rep: NextApiResponse) => {
    // console.log(req)
    switch (req.method) {
        case 'GET':
            await handleListPayments(req, rep);
            break;
        case 'POST':
            await handleCreatePayment(req, rep);
            break;
    }
}

async function handleListPayments(req: NextApiRequest, res: NextApiResponse) {
    console.log('GET /api/payments/')

    db = await connect(db);

    const payments = listOneTimePayments(db, {
        dateStart: req.query.date_start,
        dateEnd: req.query.date_end,
    })
    // console.log(payments)

    res.status(200).json({
        payments: payments.map((paymentObj: PaymentData) => ({
            id: paymentObj.id,
            description: paymentObj.description,
            at_date: paymentObj.at_date,
            amount: paymentObj.amount,
            value: serializePaymentValue(paymentObj),
            account_id: paymentObj.account_id,
        }))
    })
}

async function handleCreatePayment(req: NextApiRequest, res: NextApiResponse) {
    console.log('POST /api/payments/')

    db = await connect(db)
    console.log('description', req.body['description']);

    createOneTimePayment(db, {
        description: req.body['description'],
        amount: req.body['amount'],
        at_date: req.body['at_date'],
    })

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
