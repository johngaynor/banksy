import React, { useEffect } from "react";

import { useProcessorState } from "../context";

export default function SummaryView() {
  const { data, summaryViews } = useProcessorState();

  useEffect(() => {
    const summaryTemplate = { spending: 0, income: 0, views: [] };

    for (const summaryView of summaryViews) {
      const { categories, ...view } = summaryView;

      view.spending = 0;
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

    // console.log(summaryTemplate); // summaryTemplate built by now

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
            if (view.aggregate) {
              // handling aggregate views
              const categoryOptions = view.aggregateRef.find(
                (r) => r.name === category
              ).aggregate;

              if (categoryOptions.includes(row.category)) {
                match = true;
              }
            } else if (row.category === category) {
              // handling standard views
              match = true;
            }

            if (match) {
              view.categories[category] += row.amount;
              view.spending += row.amount;
            }
          }
        }

        return retObj;
      }, summaryTemplate);

    console.log(summary.views);
  });

  return <h1>hello</h1>;
}
