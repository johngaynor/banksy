import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get("action");

  if (!action) {
    return NextResponse.json({ error: "action is required" }, { status: 400 });
  }

  //   let data;

  if (action === "getbanks") {
    const banks = await GetUserBanks(1);
    return NextResponse.json({ banks }, { status: "200" });
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
  //   return rows.length ? rows : null;
}
