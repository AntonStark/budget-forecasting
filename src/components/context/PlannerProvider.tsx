'use client'

import {usePathname, useRouter, useSearchParams} from "next/navigation"
import {createContext, useContext, useEffect, useState} from "react";

import {Mode, PlannerState} from "@/types";
import {dateToSql} from "@/utils/dates";

const PlannerContext = createContext<PlannerState | null>(null);

export function PlannerProvider({children}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // --- INIT FROM URL ---
  const modePart = (pathname && pathname.split('/').length > 2 ? pathname.split('/')[2] : "");
  console.log('modePart', modePart);
  const initialMode = modePart in Mode ? modePart as Mode : Mode.month;
  console.log('initialMode', initialMode);
  const dateParam = searchParams?.get('date');
  const initialDate = dateParam ? new Date(dateParam) : new Date();

  const [mode, setMode] = useState<Mode>(initialMode);
  const [currentDate, setCurrentDate] = useState<Date>(initialDate);

  // --- SYNC TO URL ---
  useEffect(() => {
    const params = new URLSearchParams({'date': dateToSql(currentDate)});
    router.replace(`${pathname}?${params.toString()}`);
  }, [currentDate]);
  useEffect(() => {
    const params = new URLSearchParams({'date': dateToSql(currentDate)});
    router.push(`${mode}?${params.toString()}`);
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
      value={{ mode, setMode, currentDate, setCurrentDate, next, prev }}
    >{ children }</PlannerContext.Provider>
  )
}

// @ts-ignore
export const usePlannerContext = () => useContext<PlannerState>(PlannerContext);
