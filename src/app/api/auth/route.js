import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get("action");
  const email = searchParams.get("email");
  const password = searchParams.get("password");

  if (!email || !password || !action) {
    return NextResponse.json(
      { error: "Email, password, and action are required" },
      { status: 400 }
    );
  }

  let user;

  if (action === "login") {
    user = await Login(email, password);
  }

  if (user) {
    return NextResponse.json({ user }, { status: "200" });
  } else {
    return NextResponse.json(
      { error: "Invalid email, password, or action" },
      { status: 401 }
    );
  }
}

export async function Login(email, password) {
  const { rows } =
    await sql`SELECT * FROM users where email = ${email} and password = ${password};`;

  return rows.length === 1 ? rows[0] : null;
}
