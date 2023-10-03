import axios from "axios";

export function apiCall(method, path, data) {
  return new Promise((resolve, reject) => {
    return axios[method.toLowerCase()](path, data)
      .then((res) => {
        return resolve(res.data);
      })
      .catch((err) => {
        if (err && err.response && err.response.data._unauthorized) {
          window.location.reload(false);
        } else if (err.response) {
          return reject(err.response.data.error);
        } else {
          return reject(
            "Error retrieving data from the server. Please try again in a moment."
          );
        }
      });
  });
}
