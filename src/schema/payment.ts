import {PaymentCategorySchema, PaymentData, PaymentOutSchema, ScheduleShortSchema} from "@/types";

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

function serializeScheduleInfo(paymentObj: PaymentData): ScheduleShortSchema | null {
  if (!(paymentObj.schedule_type && paymentObj.schedule_number && paymentObj.schedule_date_start)) {
    return null;
  }
  return {
    type: paymentObj.schedule_type,
    number: paymentObj.schedule_number,
    date_start: paymentObj.schedule_date_start
  };
}

function serializeCategoryInfo(paymentObj: PaymentData): PaymentCategorySchema | null {
  if (!(paymentObj.category_id && paymentObj.category_name && paymentObj.category_color && paymentObj.category_order)) {
    return null;
  }

  return {
    id: paymentObj.category_id,
    name: paymentObj.category_name,
    color: paymentObj.category_color,
    order: paymentObj.category_order
  };
}

export function serializePayment(paymentObj: PaymentData): PaymentOutSchema {
  return {
    id: paymentObj.id,
    description: paymentObj.description,
    at_date: paymentObj.at_date,
    amount: paymentObj.amount,
    value: serializePaymentValue(paymentObj),
    category: serializeCategoryInfo(paymentObj),
    currency_iso_code: paymentObj.currency_iso_code,
    currency_symbol: paymentObj.currency_symbol,
    account_id: paymentObj.account_id,
    schedule: serializeScheduleInfo(paymentObj)
  }
}
