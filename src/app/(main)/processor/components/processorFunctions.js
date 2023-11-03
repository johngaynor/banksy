import Papa from "papaparse";

export function parseRawFile(file) {
  return new Promise(async (resolve, reject) => {
    try {
      Papa.parse(file, {
        header: true,
        complete: function (results) {
          const transactions = results.data.filter(
            (row) => row.DatePosted !== ""
          );
          resolve(transactions);
        },
      });
    } catch (error) {
      reject(error);
    }
  });
}

export function generateSummary(userViews, data) {
  const template = { spending: 0, income: 0, views: [] };

  // filling out template views. can't just import userViews directly into template.views because it references the same object and multiple re-renders will multiply quantities.
  for (const userView of userViews) {
    const { categories, ...view } = { spending: 0, ...userView };

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

  // cleaning up math
  summary.spending = parseFloat(summary.spending.toFixed(2));
  summary.income = parseFloat(summary.income.toFixed(2));
  for (const view of summary.views) {
    view.spending = parseFloat(view.spending.toFixed(2));
    for (const category in view.categories) {
      view.categories[category] = parseFloat(
        view.categories[category].toFixed(2)
      );
    }
  }

  return summary;
}
