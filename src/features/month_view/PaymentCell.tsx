import {PaymentOutSchema} from "@/types";
import React from "react";

export function PaymentCell({payment, periodIndex, gridRow, colored = false}: {
  payment: PaymentOutSchema,
  periodIndex: number,
  gridRow: string,
  colored?: boolean
}) {
  return (
    <>
      <div className="col-span-2 p-1 text-right text-xs text-wrap z-10"
           style={{
             gridColumnStart: 3 * periodIndex + 1,
             gridRow: gridRow,
             background: colored ? payment.category?.color : ""
           }}>
        {payment.description}
      </div>

      <div className="text-right p-1 text-xs whitespace-nowrap"
           style={{gridColumnStart: 3 * periodIndex + 3, gridRow: gridRow}}
      >
        {payment.amount}
      </div>
    </>
  );
}
