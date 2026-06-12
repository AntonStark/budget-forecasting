'use client'

import React, {useEffect, useState} from "react";

import {usePlannerContext} from "@/components/context/PlannerProvider";
import WeekTable from "@/components/widgets/WeekTable";

import {getAccounts, getPayments} from "@/adapters/api";
import {AccountData, Mode, PaymentData} from "@/types";
import {settingToIntervalDates} from "@/utils/dates";

export default function Page() {
  const { currentDate } = usePlannerContext();
  const [payments, setPayments] = useState<PaymentData[]>([]);
  const [accounts, setAccounts] = useState<AccountData[]>([]);
  const [needRefresh, setNeedRefresh] = useState<boolean>(false);

  useEffect(() => {
    const [dateStart, dateEnd] = settingToIntervalDates(Mode.week, currentDate);
    getPayments(dateStart, dateEnd).then(data => setPayments(data.payments));
    getAccounts({dateStart, dateEnd}).then(data => setAccounts(data.accounts));
    setNeedRefresh(false);
  }, [currentDate, needRefresh]);

  return (
    <WeekTable currentDate={currentDate}
               payments={payments}
               accounts={accounts}
               refreshHandle={() => setNeedRefresh(true)}/>
  )
}
