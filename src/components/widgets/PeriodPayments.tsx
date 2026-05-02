import React from "react";
import {PaymentData} from "@/types";

function PaymentChip({payment} : {payment: PaymentData}) {
  return (
    <div className="grid grid-cols-3 text-xs">
      <div className="col-span-2 text-right text-wrap pr-2">
        {payment.description}
      </div>
      <div className="text-right whitespace-nowrap">
        {payment.amount}
      </div>
    </div>
  );
}

export default function PeriodPayments({payments}) {
  if (payments.length === 0) {
    return (
      <div className="text-gray-400 text-xs">—</div>
    );
  }

  return (
    <div className="space-y-1">
      {payments.map((pData, pi) => <PaymentChip key={pi} payment={pData}/>)}
    </div>
  )
}
