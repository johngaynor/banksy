import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get("action");
  const userId = searchParams.get("userId");

  console.log(action, userId);

  if (!action) {
    return NextResponse.json({ error: "action is required" }, { status: 400 });
  }

  if (action === "getbanks") {
    const banks = await GetUserBanks(userId);
    return NextResponse.json(banks, { status: "200" });
  }

  if (action === "getcategories") {
    const categories = await GetUserCategories(userId);
    return NextResponse.json(categories, { status: "200" });
  }

  if (action === "getviews") {
    const views = await GetUserViews();
    return NextResponse.json(views, { status: "200" });
  }
}

export async function GetUserBanks(userId) {
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
}

export async function GetUserCategories(userId) {
  const { rows: categories } = await sql`
    select * from processor_categories
    where user_id = 0
  `;

  const { rows: keys } = await sql`
    select * from processor_keywords
  `;

  const sortedCategories = {};

  for (const category of categories) {
    const keyArr = keys
      .filter((key) => key.category_id === category.category_id)
      .map((key) => key.keyword);

    sortedCategories[category.category_name] = {
      keys: keyArr,
      ref: category.category_id,
    };
  }

  return sortedCategories;
}

export async function GetUserViews() {
  const { rows: views } = await sql`
    select * from processor_views
    where user_id = 0
    `;

  const viewArr = [];

  for (const view of views) {
  }

  const { rows: categories } = await sql`
    select 
    `;

  return views;
  // return { msg: "got views" };
}
