import React, { useEffect } from "react";

import { useProcessorState } from "../context";

export default function SummaryView() {
  const { data, userCategories } = useProcessorState();

  console.log(userCategories);
  console.log("hi");

  useEffect(() => {
    if (data) {
      console.log(data);
      //   const summaryObj = {};

      //   for (const category in userCategories) {
      //     summaryObj[category] = 0;
      //   }

      //   const summary = newData.reduce((acc, row) => {
      //     const retObj = { ...acc };

      //     for (const category in retObj) {
      //       if (category === row.category) {
      //         retObj[category] += row.amount;
      //       }
      //     }
      //   }, summaryObj);

      //   console.log(summary);
    }
  });

  return <h1>hello</h1>;
}
