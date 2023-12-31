import { sql } from "@vercel/postgres";
import { SHA512 } from "jshashes";

export const settingsFunctions = {
  checkPassword: async function (userId, oldPassword) {
    const hash = new SHA512().b64(oldPassword);
    const { rows } = await sql`
        select user_id from users 
        where user_id = ${userId} 
        and password = ${hash};
        `;
    return rows;
  },
  updatePassword: async function (userId, newPassword) {
    const hash = new SHA512().b64(newPassword);
    const { rows } = await sql`
      update users
      set password = ${hash}
      where user_id = ${userId};
      `;
    return rows;
  },
  updateProfile: async function (userId, firstName, lastName) {
    const { result } = await sql`
    update users
    set first_name = ${firstName}, last_name = ${lastName}
    where user_id = ${userId}
    `;

    const { rows } = await sql`
    select user_id, first_name, last_name, email, use_default_keywords
    from users where user_id = ${userId};
    `;

    return rows;
  },
  deleteKeyword: async function (userId, categoryId, keyword) {
    const { rows } = await sql`
    delete from processor_user_keywords
    where user_id = ${userId} and category_id = ${categoryId} and keyword = ${keyword};
    `;

    return rows;
  },
};
