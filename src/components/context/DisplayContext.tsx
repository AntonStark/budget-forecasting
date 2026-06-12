import {createContext, useContext, useState} from "react";
import {AccountsRowsDisplay, DisplaySettings, PaymentsSort} from "@/types";

const DisplaySettingsContext = createContext<DisplaySettings | null>(null);

export function DisplaySettingsProvider({children}) {
  const [paymentsSort, setPaymentsSort] = useState<PaymentsSort>("as_is" as PaymentsSort);
  const [accountsRows, setAccountsRows] = useState<AccountsRowsDisplay>("display" as AccountsRowsDisplay);

  return (
    <DisplaySettingsContext.Provider value={{paymentsSort, setPaymentsSort, accountsRows, setAccountsRows}}>
      {children}
    </DisplaySettingsContext.Provider>
  );
}

// @ts-ignore
export const useDisplaySettingsContext = () => useContext<DisplaySettings>(DisplaySettingsContext);
