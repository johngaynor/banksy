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
  try {
    console.log("assigning categories");
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

    const retObj = {
      good: data.filter((t) => t.Category !== 400),
      bad: data.filter((t) => t.Category === 400),
    };

    return retObj;
  } catch (error) {
    throw error;
  }
}
