"use strict";

import {useEffect, useState} from "react";

import {AccountTableWrapper} from "../../components/accounts_table";


function DatesSettingBlock() {
    const [dateRangeSetting, setDateRangeSetting] = useState("previous_7_days")
    const handleChange = (e) => {
        setDateRangeSetting(e.target.value)
        console.log(dateRangeSetting)
        console.log(e)
    }

    return (
        <p id="dates_setting_block">
            Dates:
            <label htmlFor="previous_7_days">previous 7 days</label>
            <input type="radio" id="previous_7_days" name="dates" value="previous_7_days" checked
                   onChange={handleChange}/>
            <label htmlFor="previous_30_days">previous 30 days</label>
            <input type="radio" id="previous_30_days" name="dates" value="previous_30_days"
                   onChange={handleChange}/>
        </p>
    )
}


export default function Main() {
    const [data, setData] = useState(null)

    useEffect(() => {
        fetch('/api/get-data')
            .then((res) => res.json())
            .then((data) => {
                setData(data)
            })
    }, [])

    return (
        <div>
            <h1>Lets account!</h1>

            <DatesSettingBlock/>

            <AccountTableWrapper data={data}/>

            <p>
                <input type="button" value="Write checkpoint" id="display_checkpoint_window_button"/>
            </p>
        </div>
    )
}
