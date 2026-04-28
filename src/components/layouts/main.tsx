import React, {useEffect, useState} from "react";
import {motion} from "framer-motion";

import Header from "@/components/widgets/Header";
import WeekTable from "@/components/widgets/WeekTable";
import MonthTable from "@/components/widgets/MonthTable";
import ExpenseModal from "@/components/widgets/ExpenseModal";
import {usePlannerContext} from "@/components/context/PlannerContext";

import {getPayments, savePayment} from "@/utils/api";
import {Mode, PaymentData} from "@/types";
import {settingToIntervalDates} from "@/utils/dates";

export default function PaymentsPlanner() {
  const [showModal, setShowModal] = useState(false);
  const { mode, currentDate } = usePlannerContext();

  const [payments, setPayments] = useState<PaymentData[]>([]);

  useEffect(() => {
    const [dateStart, dateEnd] = settingToIntervalDates(mode, currentDate);
    getPayments(dateStart, dateEnd).then(data => setPayments(data.payments));
  }, [mode, currentDate]);
  console.log(payments);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <Header onAdd={() => setShowModal(true)}/>

        <motion.div
          key={mode}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {mode === Mode.week ? <WeekTable payments={payments} /> : <MonthTable payments={payments} />}
        </motion.div>
      </div>

      {showModal &&
          <ExpenseModal
              onClose={() => setShowModal(false)}
              onSubmit={savePayment}
          />
      }
    </div>
  );
}
