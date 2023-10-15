Processor functions

import Papa from "papaparse";

export function initUpload(file) {
return new Promise(async (resolve, reject) => {
try {
Papa.parse(file, {
header: true,
complete: function (results) {
const transactions = results.data;
resolve(transactions);
},
});
} catch (error) {
reject(error);
}
});
}
