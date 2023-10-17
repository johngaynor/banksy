import axios from "axios";

// export function apiCall(method, path, data) {
//   return new Promise(async (resolve, reject) => {
//     const fullPath = "http://localhost:8000/" + path;
//     const headers = {};

//     if (method.toLowerCase() === "post") {
//       const csrf = await getCSRFToken();
//       headers["X-CSRFToken"] = csrf;
//     }

//     return axios[method.toLowerCase()](fullPath, data, {
//       headers,
//       withCredentials: true,
//     })
//       .then((res) => {
//         return resolve(res.data);
//       })
//       .catch((err) => {
//         if (err && err.response && err.response.data._unauthorized) {
//           window.location.reload(false);
//         } else if (err.response) {
//           return reject(err.response.data.error);
//         } else {
//           return reject(
//             "Error retrieving data from the server. Please try again in a moment."
//           );
//         }
//       });
//   });
// }

export function apiCall(method, path, data) {
  return new Promise(async (resolve, reject) => {
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

export function getCSRFToken() {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await axios.get("http://localhost:8000/api/csrf");

      const htmlContent = response.data;
      const match = htmlContent.match(
        /name="csrfmiddlewaretoken" value="(.+?)"/
      );
      const csrfToken = match ? match[1] : null;

      console.log("CRSF TOKEN:", csrfToken);

      // write it to the cookies
      document.cookie = `csrftoken=${csrfToken}; path=/; SameSite=Lax; Secure`;

      resolve(csrfToken);
    } catch (error) {
      reject("Failed to obtain CSRF token");
    }
  });
}
