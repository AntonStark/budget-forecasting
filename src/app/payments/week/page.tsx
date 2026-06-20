// 'use client' // note теперь серверный компонент

import React from "react";

import {getAccounts, getPayments} from "@/app/actions";
import WeekTable from "@/components/widgets/WeekTable";

import {AccountData, Mode} from "@/types";
import {getWeek, settingToIntervalDates} from "@/utils/dates";
import {parseSearchParams} from "@/utils/searchParams";

export default async function Page({ searchParams }) {
  const currentDate = parseSearchParams(await searchParams);

  const [dateStart, dateEnd] = settingToIntervalDates(Mode.week, currentDate);
  const payments = await getPayments(dateStart, dateEnd);
  const accounts: AccountData[] = await getAccounts(dateStart, dateEnd);

  return (
    <WeekTable week={getWeek(currentDate)} payments={payments} accounts={accounts}/>
  )
}
