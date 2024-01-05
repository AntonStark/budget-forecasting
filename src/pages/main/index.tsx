import {useEffect, useState} from "react";
import {useRouter, useSearchParams} from "next/navigation";

import {AccountTableWrapper} from "@/components/accountsTable";
import {PaymentsTable} from "@/components/paymentsTable";
import {settingToIntervalBounds} from "@/utils/dates";
import {exportAccountData, getAccountsByCurrency} from "@/utils/api";
import {DateRangeSettings} from "@/types";


function DatesSettingBlock({dateRangeSetting, setDateRangeSetting}) {
    const handleChange = (e) => {
        setDateRangeSetting(e.target.value)
        console.log("dateRangeSetting will be:", e.target.value)
    }

    const [dateStart, dateEnd] = settingToIntervalBounds(dateRangeSetting as DateRangeSettings)
    const periodTitle = new Date(dateStart).toLocaleDateString('en', {
        month: "long",
        year: "numeric",
    })

    return (
        <>
            <p>
                <label htmlFor="select_date_range">Display </label>
                <select id="select_date_range" name="select_date_range"
                        value={dateRangeSetting} onChange={handleChange}>
                    <option value={DateRangeSettings.Previous_7_Days}>Previous 7 days</option>
                    <option value={DateRangeSettings.Weekly}>Weekly</option>
                    <option value={DateRangeSettings.Monthly}>Monthly</option>
                </select>
            </p>
            <h2>{periodTitle}</h2>
        </>
    )
}


export const refreshBalancesEvent = new Event('refreshBalances')

const TIME_DISPLAY_PARAM = 'dates-display'


export default function Main() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const dateRangeParam = searchParams.get(TIME_DISPLAY_PARAM)

    const [data, setData] = useState(null)
    const [dateRangeSetting, _setDateRangeSetting] = useState(DateRangeSettings.Previous_7_Days)

    if (dateRangeParam && dateRangeParam !== dateRangeSetting) {
        _setDateRangeSetting(dateRangeParam as DateRangeSettings)
    }

    const setDateRangeSetting = (value) => {
        _setDateRangeSetting(value)
        router.push(`/main?${TIME_DISPLAY_PARAM}=${value}`)
    }

    const fetchAccountsData = () => {
        const [dateStart, dateEnd] = settingToIntervalBounds(dateRangeSetting as DateRangeSettings)
        getAccountsByCurrency({dateStart, dateEnd}).then(data => setData(data))
    }
    useEffect(fetchAccountsData, [dateRangeSetting])
    useEffect(() => {
        document.addEventListener(refreshBalancesEvent.type, fetchAccountsData)
        return () => {
            document.removeEventListener(refreshBalancesEvent.type, fetchAccountsData)
        }
    }, [dateRangeSetting])

    const requestExportData = () => {
        const [dateStart, dateEnd] = settingToIntervalBounds(dateRangeSetting as DateRangeSettings)
        exportAccountData({dateStart, dateEnd}).then(res => {
            if (res.error) {
                window.alert('Error occurred\n' + res.message)
            } else if (res.success) {
                window.alert('File created in db/exports')
            } else {
                window.alert('Something went wrong')
            }
        })
        console.log('requestExportData')
    }

    return (
        <div>
            <h1>Lets account! ✍️💸📚</h1>

            <div id="main_content">
                <div id="accounts_panel">
                    <DatesSettingBlock dateRangeSetting={dateRangeSetting} setDateRangeSetting={setDateRangeSetting}/>
                    <AccountTableWrapper data={data}/>
                </div>

                <div id="payments_panel">
                    <PaymentsTable dateRangeSetting={dateRangeSetting}/>
                </div>
            </div>

            <div>
                <input type="button" value="Export data" onClick={requestExportData}/>
            </div>
        </div>
    )
}
