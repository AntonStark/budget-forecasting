import { createContext, useContext, useState } from "react";

import {Mode} from "@/types";

const PlannerContext = createContext(null);

export function PlannerProvider({ children }) {
  const [mode, setMode] = useState<Mode>("week");
  const [currentDate, setCurrentDate] = useState(new Date());

  const next = () => {
    setCurrentDate((prev) => {
      const d = new Date(prev);
      if (mode === "week") d.setDate(d.getDate() + 7);
      else d.setMonth(d.getMonth() + 1);
      return d;
    });
  };

  const prev = () => {
    setCurrentDate((prev) => {
      const d = new Date(prev);
      if (mode === "week") d.setDate(d.getDate() - 7);
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

export const usePlannerContext = () => useContext(PlannerContext);
