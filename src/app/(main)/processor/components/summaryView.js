import React, { useEffect } from "react";

import { useProcessorState } from "../context";

export default function SummaryView() {
  const { data, summaryViews } = useProcessorState();

  useEffect(() => {
    const template = { spending: 0, income: 0, views: [] };

    // filling out template views. can't just import summaryViews directly into template.views because it references the same object and multiple re-renders will multiply quantities.
    for (const summaryView of summaryViews) {
      const { categories, ...view } = { spending: 0, ...summaryView };

      view.categories = {};
      for (const c of categories) {
        view.categories[c] = 0;
      }

      template.views.push(view);
    }

    const summary = data
      .filter((r) => r.category !== "ignore")
      .reduce((acc, row) => {
        const retObj = { ...acc };

        // handling top level income vs. spending
        if (row.category === "income") {
          retObj.income += row.amount;
        } else retObj.spending += row.amount;

        // handling views
        for (const view of retObj.views) {
          for (const category in view.categories) {
            let match = false;

            if (
              view.aggregates[category] &&
              view.aggregates[category].includes(row.category)
            ) {
              match = true;
            } else if (row.category === category) {
              match = true;
            }

            if (match) {
              view.categories[category] += row.amount;
              view.spending += row.amount;
            }
          }
        }

        return retObj;
      }, template);

    console.log(summary);
  });

  return <h1>hello</h1>;
}
