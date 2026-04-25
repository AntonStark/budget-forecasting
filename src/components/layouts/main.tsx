import React, {useState} from "react";
import { motion } from "framer-motion";

import ModeSwitcher from "@/components/widgets/ModeSwitcher";
import WeekTable from "@/components/widgets/WeekTable";
import MonthTable from "@/components/widgets/MonthTable";
import ExpenseModal from "@/components/widgets/ExpenseModal";
import {savePayment} from "@/utils/api";

export default function PaymentsPlanner() {
  const [mode, setMode] = useState("week");
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <ModeSwitcher mode={mode} setMode={setMode} onAdd={() => setShowModal(true)} />
        </motion.div>

        <motion.div
          key={mode}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {mode === "week" ? <WeekTable /> : <MonthTable />}
        </motion.div>
      </div>

      {showModal && <ExpenseModal onClose={() => setShowModal(false)} onSubmit={savePayment} />}
    </div>
  );
}
