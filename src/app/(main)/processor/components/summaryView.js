import { ConstructionOutlined } from "@mui/icons-material";
import React, { useEffect } from "react";

import { useProcessorState } from "../context";

export default function SummaryView() {
  const { data, userCategories, summaryViews } = useProcessorState();

  useEffect(() => {
    const summaryTemplate = { total: 0, income: 0, views: [] };

    for (const summaryView of summaryViews) {
      const { categories, ...view } = summaryView;

      view.total = 0;
      view.categories = {};

      if (view.aggregate) {
        // console.log("aggregate view", categories);
        for (const category of categories) {
          view.categories[category.name] = 0;
        }
        view.aggregateRef = categories;
      } else {
        // console.log("standard view", categories);
        for (const category of categories) {
          view.categories[category] = 0;
        }
      }
      summaryTemplate.views.push(view);
    }

    console.log(summaryTemplate); // summaryTemplate built by now
    //   }
    // building template for summary obj
    //   const summaryObj = {};
    //   for (const category in userCategories) {
    //     if (category !== "ignore") {
    //       summaryObj[category] = 0;
    //     }
    //   }
    //   const summary = data
    //     .filter((r) => r.category !== "ignore")
    //     .reduce((acc, row) => {
    //       const retObj = { ...acc };
    //       for (const category in retObj) {
    //         if (category === row.category) {
    //           retObj[category] += row.amount;
    //           retObj[category] = Math.round(retObj[category] * 100) / 100; // fixing JS imprecision
    //         }
    //       }
    //       return retObj;
    //     }, summaryObj);
    //   console.log(summary);
    // }
  });

  return <h1>hello</h1>;
}
