import {settingToIntervalBounds} from "@/utils/dates";
import {DateRangeSettings} from "@/types";
import {useEffect, useState} from "react";
import {getPayments} from "@/utils/api";

export function PaymentsTable({dateRangeSetting}) {
    const [payments, setPayments] = useState(null)

    const fetchPaymentsData = () => {
        const [dateStart, dateEnd] = settingToIntervalBounds(dateRangeSetting as DateRangeSettings)
        getPayments({dateStart, dateEnd}).then(data => setPayments(data.payments))
    }
    useEffect(fetchPaymentsData, [dateRangeSetting])

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
