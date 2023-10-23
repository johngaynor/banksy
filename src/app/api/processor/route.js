import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get("action");
  const userId = searchParams.get("userId");

  if (!action || !userId) {
    return NextResponse.json(
      { error: "action and userId is required" },
      { status: 400 }
    );
  }

  if (action === "getbanks") {
    const banks = await GetUserBanks(userId);
    return NextResponse.json({ banks }, { status: "200" });
  }

  if (action === "getcategories") {
    const categories = await GetUserCategories(userId);
    return NextResponse.json({ categories }, { status: "200" });
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
        from user_banks b 
    left join user_bank_headers h 
        on b.bank_id = h.bank_id
    where b.user_id = ${userId}
    `;

  return { rows };
}

export async function GetUserCategories(userId) {
  const { rows } = await sql`
    select * from user_processor_categories
    where user_id = ${userId}
  `;

  return { rows };
}
