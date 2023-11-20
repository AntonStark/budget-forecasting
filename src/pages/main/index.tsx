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

    return (
        <p id="dates_setting_block">
            <label htmlFor="select_date_range">Display:</label>
            <select id="select_date_range" name="select_date_range" defaultValue={dateRangeSetting} onChange={handleChange}>
                <option value={DateRangeSettings.Previous_7_Days}>Previous 7 days</option>
                <option value={DateRangeSettings.Weekly}>Weekly</option>
                <option value={DateRangeSettings.Monthly}>Monthly</option>
                <option value={DateRangeSettings.Previous_30_Days}>Previous 30 days</option>
            </select>
        </p>
    )
}


export const refreshBalancesEvent = new Event('refreshBalances')


export default function Main() {
    const [data, setData] = useState(null)
    const [dateRangeSetting, setDateRangeSetting] = useState("previous_7_days")

    useEffect(() => {
        const [dateStart, dateEnd] = settingToIntervalBounds(dateRangeSetting as DateRangeSettings)
        getAccounts({dateStart, dateEnd}).then((data) => setData(data))
    }, [dateRangeSetting])
    useEffect(() => {
        document.addEventListener(refreshBalancesEvent.type, () => {
            // console.log(`Got event ${refreshBalancesEvent.type}`)
            const [dateStart, dateEnd] = settingToIntervalBounds(dateRangeSetting as DateRangeSettings)
            getAccounts({dateStart, dateEnd}).then((data) => {
                setData(data)
                console.log('refreshBalancesEvent')
            })
        })
    }, [])

    return (
        <div>
            <h1>Lets account!</h1>

            <DatesSettingBlock dateRangeSetting={dateRangeSetting} setDateRangeSetting={setDateRangeSetting}/>

            <AccountTableWrapper data={data}/>
        </div>
    )
}
