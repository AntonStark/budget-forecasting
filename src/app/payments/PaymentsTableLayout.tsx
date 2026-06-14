'use client'

import React from "react";

import {DisplaySettingsProvider} from "@/components/context/DisplayContext";
import {PlannerProvider} from "@/components/context/PlannerProvider";
import BalanceModal from "@/components/modals/BalanceModal";
import ExpenseModal from "@/components/modals/ExpenseModal";

import { LeftPanel } from "./LeftPanel";
import Header from "./Header";

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
