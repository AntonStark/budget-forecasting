import React, {useRef, useState} from "react";

import {PaymentOutSchema} from "@/types";
import {EditableCell} from "@/components/widgets/EditableCell";

export function PaymentChip({payment, periodIndex, rowIndex, colored = false} : {
  payment: PaymentOutSchema,
  periodIndex: number,
  rowIndex: number,
  colored?: boolean
}) {
  return (
    <>
      <div
        className="col-span-2 p-1 text-right text-xs text-wrap"
        style={{
          gridColumnStart: 3 * periodIndex + 1,
          gridRow: `payments-${rowIndex + 1}`,
          background: colored ? payment.category?.color : ""
      }}
      >{payment.description}</div>
      <div
        className="text-right p-1 text-xs whitespace-nowrap"
        style={{gridColumnStart: 3 * periodIndex + 3, gridRow: `payments-${rowIndex + 1}`}}
      >{payment.amount}</div>
    </>
  );
}

export function PaymentChipCompact({payment, onUpdate, enterEdit, rowIndex, colIndex, colored = false} : {
  payment: PaymentOutSchema,
  onUpdate: (arg0: string) => void,
  enterEdit: () => void,
  rowIndex: number,
  colIndex: number,
  colored?: boolean
}) {
  const valueCellRef = useRef<HTMLDivElement | null>(null);
  const descriptionCellRef = useRef<HTMLDivElement | null>(null);

  function isOutsideClick(event: MouseEvent) {
    const notOnValueCell = Boolean(valueCellRef.current && !valueCellRef.current.contains(event.target as Node));
    const notOnDescriptionCell = Boolean(descriptionCellRef.current && !descriptionCellRef.current.contains(event.target as Node));
    return notOnValueCell && notOnDescriptionCell;
  }

  function submitIfNeeded(val: string): boolean {
    // пустой ввод — ничего не отправляем
    if (val === '' || val === null) {
      return false;
    }

    onUpdate(val);
    return true;
  }

  return (
    <>
      <div ref={valueCellRef} className="col-span-2 px-1 pt-1 text-sm text-right whitespace-nowrap"
           style={{gridRow: `payment-${rowIndex+1}-v`, gridColumnStart: 2* colIndex + 3}}>
        <span className="not-hover:text-gray-200 px-3" onClick={enterEdit}>/</span>
        {payment.amount}
      </div>

      <div ref={descriptionCellRef}
           className="col-span-2 px-1 pb-1 text-sm text-wrap"
           style={{
             gridRow: `payment-${rowIndex+1}-d`,
             gridColumnStart: 2* colIndex + 3,
             background: colored ? payment.category?.color : ""
      }}
      >
        <EditableCell
          inputType={"text"}
          initialValue={payment.description}
          submitIfNeeded={submitIfNeeded}
          isOutsideClick={isOutsideClick}/>
      </div>
    </>
  );
}


export function PaymentChipAppender({onSubmit, rowIndex, colIndex} : {
  onSubmit: (arg0: number) => void,
  rowIndex: number,
  colIndex: number
}) {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const valueCellRef = useRef<HTMLDivElement | null>(null);
  const descriptionCellRef = useRef<HTMLDivElement | null>(null);

  function isOutsideClick(event: MouseEvent) {
    const notOnValueCell = Boolean(valueCellRef.current && !valueCellRef.current.contains(event.target as Node));
      const notOnDescriptionCell = Boolean(descriptionCellRef.current && !descriptionCellRef.current.contains(event.target as Node));
    return notOnValueCell && notOnDescriptionCell;
  }

  function submitIfNeeded(val: string): boolean {
    // пустой ввод — ничего не отправляем
    if (val === '' || val === '+' || val === null) {
      return false;
    }

    const numericValue = Number(val);
    onSubmit(numericValue);
    return true;
  }

  return (
    <>
      <div
        ref={valueCellRef}
        className="text-center text-sm not-hover:text-gray-500"
        style={{gridRow: `payment-${rowIndex + 1}-v`, gridColumnStart: 2 * colIndex + 4}}
      >
        <EditableCell
          editing={[isEditing, setIsEditing]}
          inputType={"number"}
          initialValue={'+'}
          submitIfNeeded={submitIfNeeded}
          isOutsideClick={isOutsideClick}/>
      </div>

      <div
        ref={descriptionCellRef}
        style={{gridRow: `payment-${rowIndex + 1}-d`, gridColumnStart: 2 * colIndex + 3}}>
        {isEditing ? "?" : ""}
      </div>
    </>
  )
}
