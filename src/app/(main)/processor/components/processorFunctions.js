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
