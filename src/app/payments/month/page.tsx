export const dynamic = 'force-dynamic'

import React from "react";

import {getAccounts, getPayments} from "@/app/actions";
import MonthTable from "@/components/widgets/MonthTable";

import {AccountData, Mode} from "@/types";
import {getWeeksOfMonth, settingToIntervalDates} from "@/utils/dates";
import {parseSearchParams} from "@/utils/searchParams";

export default async function Page({ searchParams }) {
  const currentDate = parseSearchParams(await searchParams);

  const [dateStart, dateEnd] = settingToIntervalDates(Mode.month, currentDate);
  const payments = await getPayments(dateStart, dateEnd);
  const accounts: AccountData[] = await getAccounts(dateStart, dateEnd);

  return (
    <MonthTable weeks={getWeeksOfMonth(currentDate)} payments={payments} accounts={accounts}/>
  );
}
