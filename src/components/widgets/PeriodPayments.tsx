import React, {useRef, useState} from "react";
import {PaymentData} from "@/types";
import {EditableCell} from "@/components/widgets/EditableCell";

function PaymentChip({payment} : {payment: PaymentData}) {
  return (
    <div className="grid grid-cols-3 border-gray-300">
      <div className="col-span-2 text-right bg-gray-50 text-wrap">{payment.description}</div>
      <div className="text-right whitespace-nowrap">{payment.amount}</div>
    </div>
  );
}


export default function PeriodPayments({payments, period}) {
  return (
    <div className="text-xs">
      {payments.map((pData, pi) => <PaymentChip key={pi} payment={pData}/>)}
    </div>
  )
}

export function PaymentChipCompact({payment, onUpdate, rowIndex, colIndex} : {
  payment: PaymentData,
  onUpdate: (arg0: string) => void,
  rowIndex: number,
  colIndex: number
}) {
  const valueCellRef = useRef(null);
  const descriptionCellRef = useRef(null);

  function isOutsideClick(event: MouseEvent) {
    const notOnValueCell = valueCellRef.current && !valueCellRef.current.contains(event.target);
      const notOnDescriptionCell = descriptionCellRef.current && !descriptionCellRef.current.contains(event.target);
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
      <div ref={valueCellRef} className="text-sm text-right whitespace-nowrap"
           style={{gridRow: `payment-${rowIndex+1}-v`, gridColumnStart: 2* colIndex + 4}}>
        {payment.amount}
      </div>

      <div ref={descriptionCellRef}
           className="col-span-2 text-sm text-wrap"
           style={{gridRow: `payment-${rowIndex+1}-d`, gridColumnStart: 2* colIndex + 3}}
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
  const valueCellRef = useRef(null);
  const descriptionCellRef = useRef(null);

  function isOutsideClick(event: MouseEvent) {
    const notOnValueCell = valueCellRef.current && !valueCellRef.current.contains(event.target);
      const notOnDescriptionCell = descriptionCellRef.current && !descriptionCellRef.current.contains(event.target);
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
