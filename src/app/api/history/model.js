import { sql } from "@vercel/postgres";

export const historyFunctions = {
  getUserHistoryByUser: async function (userId) {
    const { rows } = await sql`
        select * from processor_history 
        where user_id = ${userId}
        order by month_year desc  
        `;

    const reportArr = [];

    for (const row of rows) {
      const { rows } = await sql`
      select 
      hc.amount as value,
      c.category_name
      from processor_history_categories hc
      left join processor_categories c
      on c.category_id = hc.category_id
      where hc.user_id = ${userId}
      and hc.month_year = ${row.month_year}
      `;

      const report = { ...row, categories: rows };
      reportArr.push(report);
    }

    return reportArr;
  },

  deleteHistoryByUserAndDate: async function (userId, date) {
    const { rows } = await sql`
    delete from processor_history
    where user_id = ${userId} and month_year = ${date}
    `;

    await sql`
    delete from processor_history_categories
    where user_id = ${userId} and month_year = ${date}
    `;

    return rows;
  },
};
