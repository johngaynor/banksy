import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

export async function GET(request) {
  const { rows } = await sql`SELECT * FROM users;`;
  return NextResponse.json({ rows }, { status: 200 });
}
