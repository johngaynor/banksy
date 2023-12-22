import { sql } from "@vercel/postgres";

export const processorFunctions = {
  getUserBanks: async function (userId) {
    const { rows } = await sql`
      select
          b.bank_id, 
          b.bank_name, 
          h."date", 
          h.description, 
          h.amount 
          from processor_banks b 
      left join processor_banks_headers h 
          on b.bank_id = h.bank_id
      where b.user_id = ${userId}
      `;

    return rows;
  },

  getUserCategories: async function (userId) {
    const { rows: categories } = await sql`
    select * from processor_categories
    where user_id = 0
  `;

    let keywords = [];

    const { rows: keys } = await sql`
    select * from processor_keywords
  `;

    keywords = [...keywords, ...keys];

    if (userId) {
      const { rows: userKeys } = await sql`
    select category_id, keyword from processor_user_keywords
    where user_id = ${userId};
    `;
      keywords = [...keywords, ...userKeys];
    }

    const sortedCategories = {};

    for (const category of categories) {
      const keyArr = keywords
        .filter((key) => key.category_id === category.category_id)
        .map((key) => key.keyword);

      sortedCategories[category.category_name] = {
        keys: keyArr,
        ref: category.category_id,
      };
    }

    return sortedCategories;
  },

  getUserViews: async function () {
    const { rows: views } = await sql`
    select view_id, view_name from processor_views
    where user_id = 0
    `;

    const viewArr = [];

    for (const view of views) {
      view.categories = [];
      view.aggregates = {};

      const { rows: categories } = await sql`
    select category_name, aggregate from processor_views_categories
    where view_id = ${view.view_id}
    `;

      const { rows: aggregates } = await sql`
    select * from processor_views_categories_aggregates
    where view_id = ${view.view_id}
    `;

      for (const c of categories) {
        view.categories.push(c.category_name);

        if (c.aggregate) {
          view.aggregates[c.category_name] = [];

          for (const a of aggregates) {
            if (a.category_name === c.category_name) {
              view.aggregates[c.category_name].push(a.aggregate_name);
            }
          }
        }
      }

      viewArr.push(view);
    }

    return viewArr;
  },

  submitSummary: async function (userId, monthYear, income, spending, summary) {
    try {
      const { rows: result } = await sql`
      insert into processor_history 
          (user_id, month_year, income, spending)
      values (${userId}, ${monthYear}, ${parseFloat(income)}, ${parseFloat(
        spending
      )})
      `;

      for (const category in summary) {
        if (category !== "ignore") {
          await sql`insert into processor_history_categories
          (user_id, month_year, category_id, amount) values
          (${userId}, ${monthYear}, ${summary[category].id}, ${summary[category].amount})
          `;
        }
      }

      return {
        msg: "it went through",
        userId,
        monthYear,
        income,
        spending,
      };
    } catch (error) {
      return { error: `DB operation failed: ${error}` };
    }
  },

  addKeyword: async function (userId, categoryId, keyword) {
    try {
      const { rows } = await sql`
      insert into processor_user_keywords (user_id, category_id, keyword) values
      (${userId}, ${categoryId}, ${keyword});
      `;
      return rows;
    } catch (error) {
      return { error: `DB operation failed: ${error}` };
    }
  },
};
