import { sql } from "@vercel/postgres";
import { jwtVerify } from "jose";
import { SHA512 } from "jshashes";

export const authFunctions = {
  login: async function (email, password) {
    const hash = new SHA512().b64(password);
    const { rows } =
      await sql`SELECT user_id, first_name, email FROM users where email = ${email} and password = ${hash};`;

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
};
