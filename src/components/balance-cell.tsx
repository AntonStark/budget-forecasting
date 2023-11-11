import {useState} from "react";
import {AccountBalance} from "@/types";
import {setBalance} from "@/utils/api";
import {refreshBalancesEvent} from "@/pages/main";

type BalanceCellProps = {
    accountId: number
    balance: AccountBalance,
    date: string,
    options?: any
}

export const BalanceCell = ({accountId, balance, date, options}: BalanceCellProps) => {
    const classNames = new Set()
    if (balance.inferred) {
        classNames.add("inferred")
    }
    if (options && options.today) {
        classNames.add("today")
    }

    const [cellValue, setCellValue] = useState<any>(balance.value)
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
        const value = e.target.value;
        // console.log("value", value)
        console.log('handleInputBlur balance', balance)
        if (value) {
            setBalance({
                accountId: accountId,
                atDate: date,
                value: value
            }).then((rep) => {
                // console.log('setBalance rep.value: ', rep.value)
                document.dispatchEvent(refreshBalancesEvent)
                setCellValue(rep.value)
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
        cellContent = cellValue
    } else {
        cellContent = (
            <input type="number" autoFocus onBlur={handleInputBlur} onKeyDown={handleInputKeyDown}
                   defaultValue={!balance.inferred ? balance.value : ""}/>
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

    return (
        <td className={Array.from(classNames).join(' ')} {...cellProps}>{cellContent}</td>
    )
}
