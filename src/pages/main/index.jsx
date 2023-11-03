"use strict";

import {useEffect, useState} from "react";

import {AccountTableWrapper} from "../../components/accounts_table";
import Link from "next/link";


function DatesSettingBlock({dateRangeSetting, setDateRangeSetting}) {
    const handleChange = (e) => {
        setDateRangeSetting(e.target.value)
        console.log("dateRangeSetting will be:", e.target.value)
    }

    return (
        <p id="dates_setting_block">
            Dates:
            <label htmlFor="previous_7_days">previous 7 days</label>
            <input type="radio" id="previous_7_days" name="dates" value="previous_7_days"
                   checked={dateRangeSetting === "previous_7_days"} onChange={handleChange}/>
            <label htmlFor="previous_30_days">previous 30 days</label>
            <input type="radio" id="previous_30_days" name="dates" value="previous_30_days"
                   checked={dateRangeSetting === "previous_30_days"} onChange={handleChange}/>
        </p>
    )
}


export default function Main() {
    const [data, setData] = useState(null)
    const [dateRangeSetting, setDateRangeSetting] = useState("previous_7_days")

    useEffect(() => {
        fetch('/api/get-accounts-data')
            .then((res) => res.json())
            .then((data) => {
                setData(data)
            })
    }, [])

    const setDateRangeSettingCombinator = (value) => {
        setDateRangeSetting(value)
        setData({...data, dateRange: value})
    }

    return (
        <div>
            <h1>Lets account!</h1>

            <DatesSettingBlock dateRangeSetting={dateRangeSetting} setDateRangeSetting={setDateRangeSettingCombinator}/>

            <AccountTableWrapper data={data}/>

            <p>
                <Link href="/checkpoint">
                    <input type="button" value="Write checkpoint"/>
                </Link>
            </p>
        </div>
    )
}
