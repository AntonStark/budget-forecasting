'use client'

import React, {useState} from "react";

import {saveOnceOfPayment, saveScheduledPayment} from "@/adapters/api";

import {DisplaySettingsProvider} from "@/components/context/DisplayContext";
import {PlannerProvider} from "@/components/context/PlannerProvider";
import BalanceModal from "@/components/modals/BalanceModal";
import ExpenseModal from "@/components/modals/ExpenseModal";
import { LeftPanel } from "./LeftPanel";

import Header from "./Header";

export default function PaymentsTableLayout({children}) {
  const [showExpenseModal, setShowExpenseModal] = useState<boolean>(false);
  const [showBalanceModal, setShowBalanceModal] = useState<boolean>(false);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <PlannerProvider>
          <Header
            onAdd={() => setShowExpenseModal(true)}
            onLog={() => setShowBalanceModal(true)}
          />

          <DisplaySettingsProvider>
            <LeftPanel/>

            {children}
          </DisplaySettingsProvider>
        </PlannerProvider>
      </div>

      {showExpenseModal &&
          <ExpenseModal
              onClose={() => setShowExpenseModal(false)}
              onSubmitOnce={saveOnceOfPayment}
              onSubmitScheduled={saveScheduledPayment}
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
