import {useState} from "react";
import {BalanceData} from "@/types";

type BalanceCellProps = {
    balance: BalanceData,
    date: string,
    options?: any
}

export const BalanceCell = ({balance, date, options}: BalanceCellProps) => {
    const classNames = []
    if (balance.inferred) {
        classNames.push("inferred")
    }
    if (options && options.today) {
        classNames.push("today")
    }

    const [focusCell, setFocusCell] = useState<any>()
    const isFocusedCell = () => focusCell && focusCell.account === balance.account_id && focusCell.date === date

    const handleCellClick = (e) => {
        setFocusCell({
            account: balance.account_id,
            date: date
        })
        e.stopPropagation()
        e.preventDefault()

    }
    const handleInputBlur = (e) => {
        setFocusCell(undefined)
        console.log("value", e.target.value)    // todo submit
    }
    const handleInputKeyDown = (e) => {
        switch (e.key) {
            case "Enter":
            case "Escape":
                e.target.blur()
                break;
            case "ArrowUp":
                setFocusCell({
                    ...focusCell,
                    account: focusCell.account_id - 1
                })
                break
            case "ArrowDown":
                setFocusCell({
                    ...focusCell,
                    account: focusCell.account_id + 1
                })
                break
        }
        // console.log(e.key)
    }

    let cellContent
    if (!isFocusedCell()) {
        cellContent = balance.value
    } else {
        cellContent = (
            <input type="number" autoFocus onBlur={handleInputBlur} onKeyDown={handleInputKeyDown}
                   defaultValue={!balance.inferred ? balance.value : ""}/>
        )
    }

    if (options && options.protected) {
        return (
            <td className={classNames.join(' ')} data-date={date}
                onDoubleClickCapture={handleCellClick}
            >{cellContent}</td>
        )
    } else {
        return (
            <td className={classNames.join(' ')} data-date={date}
                onClick={handleCellClick}
            >{cellContent}</td>
        )
    }
}