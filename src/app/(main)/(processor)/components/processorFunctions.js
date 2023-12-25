import Papa from "papaparse";
import axios from "axios";

// processFile handles the initial processing/category assigning by:
// 1. use papaparse to parse the file
// 2. match file to one of user's banks via the file headers
// 3. use keywords to match each transaction's description to a category
// 4. if a category is found, set it, otherwise set it to flagged
// 5. standardize transactions to have date/amount/type/description format
// 6. put any flagged transactions in separate object to process

export function assignCategories(results, bank, userCategories) {
  // console.log(results, bank, userCategories);
  const csv = results.data
    .filter((r) => r[bank.date] && r[bank.description] && r[bank.amount])
    .map((f) => {
      const t = {};
      t.date = f[bank.date];
      t.description = f[bank.description].toLowerCase();
      t.amount = parseFloat(
        f[bank.amount].replace("-", "").replace("$", "").replace(",", "")
      );
      t.type = f[bank.amount].includes("-") ? "withdrawal" : "deposit";
      t.category = null;
      return t;
    });

  for (const transaction of csv) {
    let category = null;
    for (const categoryName in userCategories) {
      const match = userCategories[categoryName].keys.find((key) =>
        transaction.description.includes(key)
      );

      // checking for income, does this mean i can get rid of income keywords?
      if (transaction.type === "deposit") {
        category = "income";
        break;
      }

      if (match) {
        category = categoryName;
        break;
      }
    }

    transaction.category = category;
  }

  const filteredTransactions = {
    filtered: csv.filter((t) => t.category !== null),
    flagged: csv.filter((t) => t.category === null),
  };

  return filteredTransactions;
}

export function processFile(file, userBanks) {
  return new Promise(async (resolve, reject) => {
    try {
      const matchBank = (results) => {
        const transactions = results.data;
        const headers = Object.keys(transactions[0]);
        let bank = userBanks.find(
          (b) =>
            headers.includes(b.date) &&
            headers.includes(b.description) &&
            headers.includes(b.amount)
        );

        if (!bank) {
          // console.log("No default bank found");
          resolve({ csv: results, headers });
        } else {
          // console.log("Bank found");
          resolve({ csv: results, bank });
        }
      };

      Papa.parse(file, {
        header: true,
        complete: matchBank,
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
export function generateSummary(userViews, data, userCategories) {
  const template = {
    spending: 0,
    income: 0,
    savings: 0,
    month: 0,
    views: [],
    summary: {},
  };

  for (const category in userCategories) {
    template.summary[category] = {
      id: userCategories[category].ref,
      amount: 0,
    };
  }

  // console.log(template); this much is working

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

        retObj.summary[row.category].amount += row.amount; // adding to ref to put in history
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
  summary.savings = parseFloat(summary.savings.toFixed(2));
  for (const category in summary.summary) {
    summary.summary[category].amount = parseFloat(
      summary.summary[category].amount.toFixed(2)
    );
  }
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

// for (const t of transactions) {
// }

// if (!bank) {
//   reject("no bank was found");
//   // start workflow for entering custom headers
//   bank = { date: "test", description: "test desc", amount: 1232 };
// }

// console.log(bank);
