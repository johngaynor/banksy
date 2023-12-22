import { sql } from "@vercel/postgres";
import { jwtVerify } from "jose";
import { SHA512 } from "jshashes";

export const authFunctions = {
  login: async function (email, password) {
    const hash = new SHA512().b64(password);
    const { rows } =
      await sql`SELECT user_id, first_name, email FROM users where email = ${email} and password = ${hash};`;

    console.log("rows", rows);

    return rows.length === 1 ? rows[0] : null;
  },

  getJwtSecretKey: function () {
    const secret = process.env.JWT_SECRET_KEY;
    if (!secret || secret.length === 0) {
      throw new Error("Environment variable for JWT_SECRET_KEY is not set.");
    }
    return secret;
  },

  verifyAuth: async function (token, secret) {
    try {
      const verified = await jwtVerify(token, new TextEncoder().encode(secret));
      return verified.payload;
    } catch (error) {
      throw new Error("There is no token stored in cookies.");
    }
  },

  registerUser: async function (email, password, fname, lname) {
    try {
      const hash = new SHA512().b64(password);
      const { rows } = await sql`
      insert into users (first_name, last_name, email, password, account_status, date_created) values
      (${fname}, ${lname}, ${email}, ${hash}, 0, CURRENT_TIMESTAMP)
      returning user_id, first_name, email;`;

      return rows;
    } catch (error) {
      return { error: `DB operation failed (345572): ${error}` };
    }
  },

  checkEmail: async function (email) {
    try {
      const { rows } = await sql`
      select * from users where email = ${email};
      `;
      return rows;
    } catch (error) {
      return { error: `DB operation failed (612634): ${error}` };
    }
  },
};
