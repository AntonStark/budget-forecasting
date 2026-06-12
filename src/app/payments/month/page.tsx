'use client'

import React, {useEffect, useState} from "react";

import {usePlannerContext} from "@/components/context/PlannerProvider";
import MonthTable from "@/components/widgets/MonthTable";

import {getAccounts, getPayments} from "@/adapters/api";
import {AccountData, Mode, PaymentData} from "@/types";
import {settingToIntervalDates} from "@/utils/dates";

export default function Page() {
  const { currentDate } = usePlannerContext();
  const [payments, setPayments] = useState<PaymentData[]>([]);
  const [accounts, setAccounts] = useState<AccountData[]>([]);

  useEffect(() => {
    const [dateStart, dateEnd] = settingToIntervalDates(Mode.month, currentDate);
    getPayments(dateStart, dateEnd).then(data => setPayments(data.payments));
    getAccounts({dateStart, dateEnd}).then(data => setAccounts(data.accounts));
  }, [currentDate]);

  return (
    <MonthTable currentDate={currentDate} payments={payments} accounts={accounts}/>
  );
}
