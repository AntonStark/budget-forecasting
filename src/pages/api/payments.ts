import {Database} from "sqlite";
import {NextApiRequest, NextApiResponse} from "next";

import {connect} from "@/utils/database";
import {PaymentData} from "@/types";

let db: Database = null

export default async (req: NextApiRequest, res: NextApiResponse) => {
    // console.log(req)
    console.log('GET /api/payments/')

    db = await connect(db)

    const payments = await db.all(`
        SELECT otp.*, cur.iso_code as currency_iso_code, cur.symbol as currency_symbol
        FROM one_time_payments otp
        LEFT JOIN currencies cur on otp.currency_id = cur.id
        WHERE otp.at_date IS NULL OR otp.at_date BETWEEN ? AND ?
        ORDER BY otp.at_date NULLS FIRST, otp.amount NULLS LAST
    `, [req.query.date_start, req.query.date_end]
    ).then((result) => {
        return result
    }, (err) => {
        console.error(err.message)
        res.status(500).json({error: true})
        throw err
    })
    // console.log(payments)

    res.status(200).json({
        payments: payments.map((paymentObj: PaymentData) => ({
            id: paymentObj.id,
            description: paymentObj.description,
            at_date: paymentObj.at_date,
            value: serializePaymentValue(paymentObj),
            account_id: paymentObj.account_id,
        }))
    })
}

function serializePaymentValue(paymentObj): string {
    if (!(paymentObj.currency_iso_code && paymentObj.amount)) {
        return ''
    }
    if (paymentObj.currency_iso_code.toUpperCase() === 'RUB') {
        return `${paymentObj.amount}${paymentObj.currency_symbol}`
    } else {
        return `${paymentObj.currency_symbol}${paymentObj.amount}`
    }
}
