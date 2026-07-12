'use client'

import {usePathname, useRouter, useSearchParams} from "next/navigation"
import {createContext, useContext, useEffect, useState} from "react";

import {ExpenseModalData, Mode, PlannerState} from "@/types";
import {parseSearchParams, serializeSearchParams} from "@/utils/searchParams";

const PlannerContext = createContext<PlannerState | null>(null);

export function PlannerProvider({children}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // --- INIT FROM URL ---
  const modePart = (pathname && pathname.split('/').length > 2 ? pathname.split('/')[2] : "");
  // console.log('modePart', modePart);
  const initialMode = modePart in Mode ? modePart as Mode : Mode.month;
  // console.log('initialMode', initialMode);

  const [mode, setMode] = useState<Mode>(initialMode);
  const [currentDate, setCurrentDate] = useState<Date>(parseSearchParams(Object.fromEntries(searchParams)));

  const [showExpenseModal, setShowExpenseModal] = useState<boolean>(false);
  const [showBalanceModal, setShowBalanceModal] = useState<boolean>(false);
  const [editingPayment, setEditingPayment] = useState<ExpenseModalData | null>(null);

  // --- SYNC TO URL ---
  useEffect(() => {
    router.replace(`${pathname}?${serializeSearchParams(currentDate)}`);
  }, [currentDate]);
  useEffect(() => {
    router.push(`${mode}?${serializeSearchParams(currentDate)}`);
  }, [mode]);

  // --- NAVIGATION ---
  const next = () => {
    setCurrentDate((prev) => {
      const d = new Date(prev);
      if (mode === Mode.week) d.setDate(d.getDate() + 7);
      else d.setMonth(d.getMonth() + 1);
      return d;
    });
  };

  const prev = () => {
    setCurrentDate((prev) => {
      const d = new Date(prev);
      if (mode === Mode.week) d.setDate(d.getDate() - 7);
      else d.setMonth(d.getMonth() - 1);
      return d;
    });
  };

  return (
    <PlannerContext.Provider
      value={{
        mode, setMode,
        currentDate, setCurrentDate, next, prev,
        showExpenseModal, setShowExpenseModal,
        showBalanceModal, setShowBalanceModal,
        editingPayment, setEditingPayment
    }}>
      { children }
    </PlannerContext.Provider>
  )
}

// @ts-ignore
export const usePlannerContext = () => useContext<PlannerState>(PlannerContext);
