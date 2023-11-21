import {useEffect, useState} from "react";

import {AccountTableWrapper} from "@/components/accounts-table";
import {settingToIntervalBounds} from "@/utils/dates";
import {getAccounts} from "@/utils/api";
import {DateRangeSettings} from "@/types";


function DatesSettingBlock({dateRangeSetting, setDateRangeSetting}) {
    const handleChange = (e) => {
        setDateRangeSetting(e.target.value)
        console.log("dateRangeSetting will be:", e.target.value)
    }

    const [dateStart, dateEnd] = settingToIntervalBounds(dateRangeSetting as DateRangeSettings)
    const periodTitle = new Date(dateStart).toLocaleDateString('en', {"month": "long", "year": "numeric"})

    return (
        <>
            <p>
                <label htmlFor="select_date_range">Display:</label>
                <select id="select_date_range" name="select_date_range"
                        defaultValue={dateRangeSetting} onChange={handleChange}>
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


export default function Main() {
    const [data, setData] = useState(null)
    const [dateRangeSetting, setDateRangeSetting] = useState(DateRangeSettings.Previous_7_Days)

    const fetchAccountsData = () => {
        const [dateStart, dateEnd] = settingToIntervalBounds(dateRangeSetting as DateRangeSettings)
        getAccounts({dateStart, dateEnd}).then((data) => setData(data))
    }
    useEffect(fetchAccountsData, [dateRangeSetting])
    useEffect(() => {
        document.addEventListener(refreshBalancesEvent.type, fetchAccountsData)
    }, [])

    return (
        <div>
            <h1>Lets account!</h1>

            <div id="accounts_panel">
                <DatesSettingBlock dateRangeSetting={dateRangeSetting} setDateRangeSetting={setDateRangeSetting}/>
                <AccountTableWrapper data={data}/>
            </div>
        </div>
    )
}
