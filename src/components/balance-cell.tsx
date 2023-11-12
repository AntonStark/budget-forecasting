import {useState} from "react";
import {setBalance} from "@/utils/api";
import {refreshBalancesEvent} from "@/pages/main";

type BalanceCellProps = {
    accountId: number
    value: number
    inferred?: boolean
    date: string
    options?: any
}

export const BalanceCell = ({accountId, value, inferred, date, options}: BalanceCellProps) => {
    // console.log(`[RENDER BalanceCell:${accountId}:${date}] value=${value}`)

    const classNames = new Set()
    if (inferred) {
        classNames.add("inferred")
    }
    if (options && options.today) {
        classNames.add("today")
    }

    // todo state focusCell должен быть на уровне таблицы, тогда может и стрелки заработают
    const [focusCell, setFocusCell] = useState<any>()
    const isFocusedCell = () => focusCell && focusCell.account === accountId && focusCell.date === date

    const handleCellClick = () => {
        setFocusCell({
            account: accountId,
            date: date
        })
    }
    const handleInputBlur = (e) => {
        const inputValue = e.target.value;
        // console.log("value", value)
        if (inputValue) {
            setBalance({
                accountId: accountId,
                atDate: date,
                value: inputValue
            }).then((rep) => {
                // console.log('setBalance rep.value: ', rep.value)
                document.dispatchEvent(refreshBalancesEvent)
            })
        }
        setFocusCell(undefined)
    }
    const handleInputKeyDown = (e) => {
        switch (e.key) {
            case "Enter":
                e.target.blur()
                break;
            case "Escape":
                setFocusCell(undefined)
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
        cellContent = value
    } else {
        cellContent = (
            <input type="number" autoFocus onBlur={handleInputBlur} onKeyDown={handleInputKeyDown}
                   defaultValue={!inferred ? value : ""}/>
        )
    }

    const cellProps = {
        "data-date": date,
    }
    if (options && options.protected) {
        cellProps["onDoubleClick"] = handleCellClick
    } else {
        cellProps["onClick"] = handleCellClick
    }

    const classNameStr = (classNames.size ? Array.from(classNames).join(' ') : undefined)

    return (
        <td className={classNameStr} {...cellProps}>{cellContent}</td>
    )
}
