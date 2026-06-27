import {PaymentData, ScheduleShortSchema} from "@/types";

export function serializePaymentValue(paymentObj: PaymentData): string {
  if (!paymentObj.currency_iso_code && !paymentObj.amount) {
    return ''
  }
  if (paymentObj.currency_iso_code) {
    if (paymentObj.currency_iso_code.toUpperCase() === 'RUB') {
      return `${paymentObj.amount}${paymentObj.currency_symbol}`
    } else {
      return `${paymentObj.currency_symbol}${paymentObj.amount}`
    }
  } else {
    return String(paymentObj.amount);
  }
}

export function serializeScheduleInfo(paymentObj: PaymentData): ScheduleShortSchema | null {
  if (paymentObj.schedule_type && paymentObj.schedule_number && paymentObj.schedule_date_start) {
    return {
      type: paymentObj.schedule_type,
      number: paymentObj.schedule_number,
      date_start: paymentObj.schedule_date_start
    };
  }
  else {
    return null;
  }
}

export function serializePayment(paymentObj: PaymentData) {
  return {
    id: paymentObj.id,
    description: paymentObj.description,
    at_date: paymentObj.at_date,
    amount: paymentObj.amount,
    value: serializePaymentValue(paymentObj),
    currency_iso_code: paymentObj.currency_iso_code,
    currency_symbol: paymentObj.currency_symbol,
    account_id: paymentObj.account_id,
    schedule: serializeScheduleInfo(paymentObj)
  }
}
