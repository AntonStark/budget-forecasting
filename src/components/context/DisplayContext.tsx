import {createContext, useContext, useState} from "react";
import {DisplaySettings} from "@/types";

const DisplaySettingsContext = createContext(null);

export function DisplaySettingsProvider({children}) {
  const [paymentsSort, setPaymentsSort] = useState("as_is");
  const [accountsRows, setAccountsRows] = useState("display");

  return (
    <DisplaySettingsContext.Provider value={{paymentsSort, setPaymentsSort, accountsRows, setAccountsRows}}>
      {children}
    </DisplaySettingsContext.Provider>
  );
}

export const useDisplaySettingsContext = () => useContext<DisplaySettings>(DisplaySettingsContext);
