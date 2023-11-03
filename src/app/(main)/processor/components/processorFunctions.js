import Papa from "papaparse";

// processFile handles the initial processing/category assigning by:
// 1. use papaparse to parse the file
// 2. match file to one of user's banks via the file headers
// 3. use keywords to match each transaction's description to a category
// 4. if a category is found, set it, otherwise set it to flagged
// 5. standardize transactions to have date/amount/type/description format
// 6. put any flagged transactions in separate object to process
export function processFile(file, userBanks, userCategories) {
  return new Promise(async (resolve, reject) => {
    try {
      const assignCategories = (results) => {
        const transactions = results.data.filter(
          (row) => row.DatePosted !== ""
        );
        const headers = Object.keys(transactions[0]);
        const bank = userBanks.find(
          (bank) =>
            headers.includes(bank.date) &&
            headers.includes(bank.description) &&
            headers.includes(bank.amount)
        );

        if (!bank) {
          reject("no bank was found");
        }

        for (const transaction of transactions) {
          let category;
          for (const categoryName in userCategories) {
            const match = userCategories[categoryName].keys.find((key) =>
              transaction[bank.description].toLowerCase().includes(key)
            );

            if (match) {
              category = categoryName;
              break;
            }

            if (!transaction[bank.amount].includes("-")) {
              category = "income";
              break;
            }
          }

          transaction["category"] = category ?? "flag";

          // sanitizing row
          const desc = transaction[bank.description].toLowerCase();
          const type = transaction[bank.amount].includes("-")
            ? "withdrawal"
            : "deposit";
          const amount = parseFloat(
            transaction[bank.amount]
              .replace("-", "")
              .replace("$", "")
              .replace(",", "")
          );

          // setting up column structure
          transaction.date = transaction[bank.date];
          transaction.amount = amount;
          transaction.description = desc;
          transaction.type = type;
          // deleting old columns
          delete transaction[bank.date];
          delete transaction[bank.amount];
          delete transaction[bank.description];
        }

        const filteredTransactions = {
          filtered: transactions.filter((t) => t.category !== "flag"),
          flagged: transactions.filter((t) => t.category === "flag"),
        };

        resolve(filteredTransactions);
      };

      Papa.parse(file, {
        header: true,
        complete: assignCategories,
      });
    } catch (error) {
      reject(error);
    }
  });
}

// generateSummary generates a summary of the transactions by:
// 1. generating template for top level stats and individual views
// 2. inserting standardized views into the template from DB
// 3. loop through transactions and add amount to appropriate places
// 4. clean up numbers (prevent xx.000000001)
export function generateSummary(userViews, data) {
  const template = { spending: 0, income: 0, savings: 0, views: [] };

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
        retObj.savings += row.amount;
      } else {
        retObj.spending += row.amount;
        retObj.savings -= row.amount;
      }

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
