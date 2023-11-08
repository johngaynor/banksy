import { sql } from "@vercel/postgres";

export const historyFunctions = {
  getUserHistoryByUser: async function (userId) {
    const { rows } = await sql`
        select * from processor_history 
        where user_id = ${userId}
        order by month_year desc  
        `;

    return rows;
  },

  deleteHistoryByUserAndDate: async function (userId, date) {
    const { rows } = await sql`
    delete from processor_history
    where user_id = ${userId} and month_year = ${date};
    `;

    return rows;
  },
};
