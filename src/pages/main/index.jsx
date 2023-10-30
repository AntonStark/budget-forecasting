"use strict";


import {useEffect, useState} from "react";

import {displayAccountTableData} from "../../../common/ui";

export default function Main() {
    const [data, setData] = useState(null)

    useEffect(() => {
        fetch('/api/get-data')
            .then((res) => res.json())
            .then((data) => {
                setData(data)
                displayAccountTableData(data)
            })
    }, [])

    return (
        <div>
            <h1>Lets account!</h1>

            <p id="dates_setting_block">
                Dates:
                <label htmlFor="previous_7_days">previous 7 days</label>
                <input type="radio" id="previous_7_days" name="dates" value="previous_7_days" checked/>
            </p>

            <div id="account_by_days_table_wrapper">
                <table id="account_by_days_table" className="styled-table">
                    <thead>
                        <tr id="account_by_days_table__dates_row"/>
                    </thead>
                    <tbody id="account_by_days_table__body"/>
                </table>
            </div>

            <p>
                <input type="button" value="Write checkpoint" id="display_checkpoint_window_button"/>
            </p>
        </div>
    )
}
