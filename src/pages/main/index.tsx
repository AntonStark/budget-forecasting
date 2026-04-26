import React from "react";

import PaymentsPlanner from "@/components/layouts/main";
import {PlannerProvider} from "@/components/context/PlannerContext";


export const refreshBalancesEvent = new Event('refreshBalances')

export async function getServerSideProps(context) {
  const { query } = context;

  return {
    props: {
      initialParams: {
        mode: query.mode ?? null,
        date: query.date ?? null,
      },
    },
  };
}

export default function Main({ initialParams }) {
    // console.log('Main page initialParams:', initialParams)
    return (
        <PlannerProvider searchParams={initialParams}>
            <PaymentsPlanner/>
        </PlannerProvider>
    )
}
