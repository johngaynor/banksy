import { sql } from "@vercel/postgres";

export const historyFunctions = {
  getUserHistory: async function (userId) {
    const { rows } = await sql`
        select * from processor_history 
        where user_id = ${userId}
        order by month_year desc  
        `;

    return rows;
  },
};
