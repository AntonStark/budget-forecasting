'use client'

import React from "react";

import Header from "@/shared/components/Header";
import { LeftPanel } from "@/shared/components/LeftPanel";
import {PlannerProvider} from "@/shared/contexts/PlannerProvider";
import {DisplaySettingsProvider} from "@/shared/contexts/DisplayContext";
import BalanceModal from "@/features/modals/BalanceModal";
import ExpenseModal from "@/features/modals/ExpenseModal";

export default function PaymentsTableLayout({children}) {

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <PlannerProvider>
        <div className="max-w-5xl mx-auto space-y-6">
          <Header/>

          <DisplaySettingsProvider>
            <LeftPanel/>

            {children}
          </DisplaySettingsProvider>
        </div>

        <ExpenseModal/>
        <BalanceModal onSubmit={console.log}/>
      </PlannerProvider>
    </div>
  );
}
