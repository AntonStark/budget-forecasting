import React, {useState} from "react";
import { motion } from "framer-motion";

import Header from "@/components/widgets/Header";
import WeekTable from "@/components/widgets/WeekTable";
import MonthTable from "@/components/widgets/MonthTable";
import ExpenseModal from "@/components/widgets/ExpenseModal";
import {PlannerProvider, usePlannerContext} from "@/components/context/PlannerContext";

import {savePayment, getPayments} from "@/utils/api";

export default function PaymentsPlanner() {
  const [showModal, setShowModal] = useState(false);
  const { mode } = usePlannerContext();

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
          {mode === "week" ? <WeekTable /> : <MonthTable />}
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
