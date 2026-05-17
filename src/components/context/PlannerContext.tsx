import {createContext, useContext, useEffect, useState} from "react";
import {usePathname, useRouter} from "next/navigation";

import {Mode, PlannerState} from "@/types";
import {dateToSql} from "@/utils/dates";

const PlannerContext = createContext(null);

export function PlannerProvider({ searchParams, children }) {
  const router = useRouter();
  const pathname = usePathname();

  // --- INIT FROM URL ---
  const initialMode = searchParams.mode;
  const initialDate = searchParams.date ? new Date(searchParams.date) : new Date();

  const [mode, setMode] = useState<Mode>(initialMode);
  const [currentDate, setCurrentDate] = useState<Date>(initialDate);

  // --- SYNC TO URL ---
  useEffect(() => {
    const params = new URLSearchParams();

    params.set("mode", mode);
    params.set("date", dateToSql(currentDate));

    router.replace(`${pathname}?${params.toString()}`);
  }, [mode, currentDate]);

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
    >
      {children}
    </PlannerContext.Provider>
  );
}

export const usePlannerContext = () => useContext<PlannerState>(PlannerContext);
