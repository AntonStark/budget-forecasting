import {settingToIntervalDates} from "@/utils/dates";
import {Mode} from "@/types";
import {useEffect, useState} from "react";
import {getPayments} from "@/utils/api";

export function PaymentsTable({mode}: {mode: Mode}) {
    const [payments, setPayments] = useState(null)

    const fetchPaymentsData = () => {
        const [dateStart, dateEnd] = settingToIntervalDates(mode);
        getPayments(dateStart, dateEnd).then(data => setPayments(data.payments))
    }
    useEffect(fetchPaymentsData, [mode]);

    if (!payments) return
    // console.log('PaymentsTable', payments)
    return (
        <table className="styled-table">
            <thead><tr>
                <td>описание</td>
                <td>когда</td>
                <td>сумма</td>
            </tr></thead>
            <tbody>
                {payments.map(paymentData =>
                    <tr key={paymentData.id}>
                        <td>{paymentData.description}</td>
                        <td>{paymentData.at_date}</td>
                        <td>{paymentData.value}</td>
                    </tr>
                )}
            </tbody>
        </table>
    )
}
