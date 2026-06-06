import React from "react";
import { List, Rows3, Palette } from "lucide-react";
import { useDisplaySettingsContext } from "@/components/context/DisplayContext";
import {PaymentsSort} from "@/types";


export function LeftPanel() {
  const {paymentsSort, setPaymentsSort} = useDisplaySettingsContext();

  return (
    <div className="flex flex-col gap-2 bg-white rounded-2xl shadow-sm h-60 w-16 px-3 py-4 -ml-22"
         style={{position: "fixed"}}>
      <FilterButton
        active={paymentsSort === PaymentsSort.asIs}
        onClick={() => setPaymentsSort(PaymentsSort.asIs)}
      >
        <List size={18} />
      </FilterButton>

      <FilterButton
        active={paymentsSort === PaymentsSort.category}
        onClick={() => setPaymentsSort(PaymentsSort.category)}
      >
        <Rows3 size={18} />
      </FilterButton>

      <FilterButton
        active={paymentsSort === PaymentsSort.coloredCategory}
        onClick={() => setPaymentsSort(PaymentsSort.coloredCategory)}
      >
        <Palette size={18} />
      </FilterButton>
    </div>
  );
}


function FilterButton({active, onClick, children}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {

  return (
    <button
      onClick={onClick}
      className={`
        w-9 h-9 rounded-xl transition
        flex items-center justify-center
        ${
          active
            ? "bg-gray-900 text-white"
            : "hover:bg-gray-100 text-gray-600"
        }
      `}
    >
      {children}
    </button>
  );
}
