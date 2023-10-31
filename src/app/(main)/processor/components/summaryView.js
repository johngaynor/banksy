import { ConstructionOutlined } from "@mui/icons-material";
import React, { useEffect } from "react";

import { useProcessorState } from "../context";

export default function SummaryView() {
  const { data, userCategories } = useProcessorState();

  useEffect(() => {
    if (data) {
      const summaryObj = {};

      for (const category in userCategories) {
        summaryObj[category] = 0;
      }

      const summary = data
        .filter((r) => r.category !== "ignore")
        .reduce((acc, row) => {
          const retObj = { ...acc };

          for (const category in retObj) {
            if (category === row.category) {
              retObj[category] += row.amount;
              retObj[category] = Math.round(retObj[category] * 100) / 100; // fixing JS imprecision
            }
          }
          return retObj;
        }, summaryObj);

      console.log(summary);
    }
  });

  return <h1>hello</h1>;
}
