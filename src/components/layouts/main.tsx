import React, {useEffect, useState} from "react";
import {motion} from "framer-motion";

import Header from "@/components/widgets/Header";
import WeekTable from "@/components/widgets/WeekTable";
import MonthTable from "@/components/widgets/MonthTable";
import ExpenseModal from "@/components/widgets/ExpenseModal";
import {usePlannerContext} from "@/components/context/PlannerContext";

import {getAccounts, getPayments, savePayment} from "@/utils/api";
import {AccountData, Mode, PaymentData} from "@/types";
import {settingToIntervalDates} from "@/utils/dates";
import BalanceModal from "@/components/widgets/BalanceModal";

export default function PaymentsPlanner() {
  const [showExpenseModal, setShowExpenseModal] = useState<boolean>(false);
  const [showBalanceModal, setShowBalanceModal] = useState<boolean>(false);
  const { mode, currentDate } = usePlannerContext();

  const [payments, setPayments] = useState<PaymentData[]>([]);
  const [accounts, setAccounts] = useState<AccountData[]>([]);

  useEffect(() => {
    const [dateStart, dateEnd] = settingToIntervalDates(mode, currentDate);
    getPayments(dateStart, dateEnd).then(data => setPayments(data.payments));
    getAccounts({dateStart, dateEnd}).then(data => setAccounts(data.accounts));
  }, [mode, currentDate]);
  // console.log(payments);
  console.log(accounts);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <Header
          onAdd={() => setShowExpenseModal(true)}
          onLog={() => setShowBalanceModal(true)}
        />

        <motion.div
          key={mode}
          initial={{opacity: 0, y: 10}}
          animate={{opacity: 1, y: 0}}
          transition={{duration: 0.2}}
        >
          {mode === Mode.week ?
            <WeekTable currentDate={currentDate} payments={payments} accounts={accounts}/> :
            <MonthTable currentDate={currentDate} payments={payments}/>
          }
        </motion.div>
      </div>

      {showExpenseModal &&
          <ExpenseModal
              onClose={() => setShowExpenseModal(false)}
              onSubmit={savePayment}
          />
      }
      {showBalanceModal &&
          <BalanceModal
              onClose={() => setShowBalanceModal(false)}
              onSubmit={console.log}
          />
      }
    </div>
  );
}
