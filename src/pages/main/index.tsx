import React from "react";

import PaymentsPlanner from "@/components/layouts/main";


export const refreshBalancesEvent = new Event('refreshBalances')


export default function Main() {
    return (
      <PaymentsPlanner/>
    )
}
