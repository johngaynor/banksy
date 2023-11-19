import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";
import { SHA512 } from "jshashes";
import { sign } from "jsonwebtoken";

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
    const token = sign({ userId: user.user_id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "1h",
    });

    return NextResponse.json(
      { user },
      {
        status: 200,
        headers: {
          "Set-Cookie": `jwt-token=${token}; Path=/; HttpOnly; Secure; SameSite=Strict`,
        },
      }
    );
  } else {
    return NextResponse.json(
      { error: "Invalid email, password, or action" },
      { status: 401 }
    );
  }
}

export async function Login(email, password) {
  const hash = new SHA512().b64(password);
  const { rows } =
    await sql`SELECT user_id, first_name, email FROM users where email = ${email} and password = ${hash};`;

  return rows.length === 1 ? rows[0] : null;
}
