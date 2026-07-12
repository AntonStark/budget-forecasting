import React from "react";

import {PaymentCategorySchema, PaymentOutSchema, PaymentsSort} from "@/types";
import {useDisplaySettingsContext} from "@/shared/contexts/DisplayContext";
import {PaymentCell} from "@/features/month_view/PaymentCell";
import {PeriodBudget} from "@/domain";


type CategorySection = { categoryId: number | undefined, suffix: string };

export function makeCategoryConfig(payments: PaymentOutSchema[]) {
  const categoryMap: Record<string, PaymentCategorySchema> = {}
  for (const payment of payments) {
    if (payment.category) {
      categoryMap[payment.category.id] = payment.category;
    }
  }

  const config: CategorySection[] = (
    Object.values(categoryMap)
      .sort((c1, c2) => c1.order - c2.order)
      .map(c => ({categoryId: c.id, suffix: String(c.id)}))
  );
  config.push({categoryId: undefined, suffix: 'nc'});
  return config;
}

export function makePaymentLayoutByCategory(periods: PeriodBudget[], categoryDisplayConfig: CategorySection[]) {
  let catRowCodes: string[][] = [];

  let rowCodes;
  for (const {categoryId, suffix} of categoryDisplayConfig) {
    rowCodes = [];

    let nPayments = periods.map(
      week => week.payments.filter(p => p.category?.id === categoryId).length
    );
    let paymentNRows = nPayments.reduce((a, b) => Math.max(a, b), 0);
    for (let n = 1; n < paymentNRows + 2; ++n) {
      rowCodes.push(`payments-${suffix}-${n}`);
    }
    catRowCodes.push(rowCodes);

  }

  return {
    catRowCodes,
    gridTemplateRows: catRowCodes.map(
      rowCodes => rowCodes.map(code => `[${code}] auto`).join('\n')
    ).join('\n')
  }
}

export function makeSimplePaymentLayout(periods: PeriodBudget[]) {
  const nPayments = periods.map(week => week.payments.length);
  const paymentNRows = nPayments.reduce((a, b) => Math.max(a, b), 0);

  let rowCodes: string[] = []
  for (let n = 1; n < paymentNRows + 3; ++n) {
    rowCodes.push(`payments-${n}`);
  }
  return {rowCodes, gridTemplateRows: rowCodes.map(code => `[${code}] auto`).join('\n')}
}

export function PaymentSection({periods, paymentsLayout, categoryDisplayConfig}: { periods: PeriodBudget[], paymentsLayout: any, categoryDisplayConfig: any }) {
  const {paymentsSort} = useDisplaySettingsContext();

  return (
    <>
      {periods.map((week, w_i) => (
          paymentsSort === PaymentsSort.asIs
            ? <PeriodPaymentsSimple payments={week.payments} periodIndex={w_i} rowCodes={paymentsLayout.rowCodes}
                                    key={w_i}/>
            : <PeriodPaymentsByCategory payments={week.payments} periodIndex={w_i}
                                        paymentsLayout={paymentsLayout} categoryDisplayConfig={categoryDisplayConfig} key={w_i}/>
        )
      )}
    </>
  );
}

function PeriodPaymentsSimple({payments, periodIndex, rowCodes}: {
  payments: PaymentOutSchema[],
  periodIndex: number,
  rowCodes: string[]
}) {
  const {paymentsSort} = useDisplaySettingsContext();

  return (
    <>
      {payments.map((pData, r_i) => (
        <PaymentCell payment={pData} periodIndex={periodIndex} gridRow={rowCodes[r_i]}
                     colored={paymentsSort === PaymentsSort.coloredCategory} key={r_i}/>
      ))}
      <div className="col-span-3 h-16" style={{
        gridRow: `${rowCodes[rowCodes.length - 1]}`,
        gridColumnStart: 3 * periodIndex + 1
      }}/>
    </>
  );
}

function PeriodPaymentsByCategory({payments, periodIndex, paymentsLayout, categoryDisplayConfig}: {
  payments: PaymentOutSchema[],
  periodIndex: number,
  paymentsLayout: any,
  categoryDisplayConfig: CategorySection[]
}) {

  return (
    <>
      {categoryDisplayConfig.map((section, index) => (
        <PeriodPaymentsSimple
          payments={payments.filter(p => p.category?.id === section.categoryId)}
          periodIndex={periodIndex}
          rowCodes={paymentsLayout.catRowCodes[index]}
          key={index}
        />
      ))}
    </>
  );
}
