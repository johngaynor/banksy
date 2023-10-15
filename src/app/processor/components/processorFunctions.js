import Papa from "papaparse";

export function initUpload(file) {
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

export function assignCategories(data, categoryKeys) {
  return new Promise(async (resolve, reject) => {
    try {
      console.log("assigning categories");
      const flaggedTransactions = {};
      for (const transaction of data) {
        const desc = transaction.Description.toLowerCase();

        for (const categoryName in categoryKeys) {
          const match = categoryKeys[categoryName].keys.find((key) =>
            desc.includes(key)
          );

          if (match) {
            transaction["Category"] = categoryKeys[categoryName].ref;
            break;
          }

          transaction["Category"] = categoryKeys["flag"].ref;
        }
      }

      for (const t in data) {
        if (data[t].Category === 400) {
          console.log(data[t].Description);
          flaggedTransactions[t] = data[t];
        }
      }

      console.log(flaggedTransactions);

      // console.log(data);
      resolve("Categories assigned successfully");
    } catch (error) {
      reject(error);
    }
  });
}
