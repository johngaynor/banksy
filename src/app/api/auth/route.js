import { NextResponse } from "next/server";
import { sign } from "jsonwebtoken";
import { authFunctions } from "./model";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get("action");
  const email = searchParams.get("email");
  const password = searchParams.get("password");

  if (!action) {
    return NextResponse.json({ error: "action is required" }, { status: 400 });
  }

  if (action === "login") {
    console.log("hit login route");
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }
    const user = await authFunctions.login(email, password);
    console.log("user", user);
    if (user) {
      const token = sign(
        {
          user_id: user.user_id,
          first_name: user.first_name,
          email: user.email,
        },
        process.env.JWT_SECRET_KEY,
        {
          expiresIn: "6h",
        }
      );
      const expirationDate = new Date(Date.now() + 3600 * 1000);
      return NextResponse.json(
        { user },
        {
          status: 200,
          headers: {
            "Set-Cookie": `jwt-token=${token}; Path=/; HttpOnly; Secure; SameSite=Strict; Expires=${expirationDate.toUTCString()}`,
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

  if (action === "autologin") {
    const jwtToken = request.cookies.get("jwt-token")?.value;
    const secret = authFunctions.getJwtSecretKey();

    const verifiedToken =
      jwtToken &&
      (await authFunctions.verifyAuth(jwtToken, secret).catch((err) => {
        console.log(err);
      }));

    if (verifiedToken) {
      const { user_id, first_name, email } = verifiedToken;
      return NextResponse.json({ user_id, first_name, email }, { status: 200 });
    } else
      return NextResponse.json(
        { msg: "there was no user in cookies." },
        { status: 200 }
      );
  }

  if (action === "logout") {
    try {
      const expirationDate = new Date(Date.now() - 50000000);
      return NextResponse.json(
        { msg: "Successfully logged out." },
        {
          status: 200,
          headers: {
            "Set-Cookie": `jwt-token=; Path=/; HttpOnly; Secure; SameSite=Strict; Expires=${expirationDate.toUTCString()}`,
          },
        }
      );
    } catch (error) {
      // console.log(error);
      return NextResponse.json({ msg: "error on backend" }, { status: 400 });
    }
  }
}

export async function POST(request) {
  const { searchParams } = new URL(request.url);
  const { action } = Object.fromEntries(searchParams);
  const res = await request.json();

  if (!action) {
    return NextResponse.json({ error: "action is required" }, { status: 400 });
  }

  if (action === "register") {
    if (!res.email || !res.password || !res.fname || !res.lname) {
      return NextResponse.json(
        { error: "missing parameters" },
        { status: 400 }
      );
    }

    const existingEmail = await authFunctions.checkEmail(res.email);
    if (existingEmail.rows[0]) {
      return NextResponse.json(
        { error: "Email already exists in our system." },
        { status: 400 }
      );
    }

    const user = await authFunctions.registerUser(
      res.email,
      res.password,
      res.fname,
      res.lname
    );

    if (user[0]) {
      const token = sign(
        {
          user_id: user[0].user_id,
          first_name: user[0].first_name,
          email: user[0].email,
        },
        process.env.JWT_SECRET_KEY,
        {
          expiresIn: "6h",
        }
      );
      const expirationDate = new Date(Date.now() + 3600 * 1000);
      return NextResponse.json(
        { user: user[0] },
        {
          status: 200,
          headers: {
            "Set-Cookie": `jwt-token=${token}; Path=/; HttpOnly; Secure; SameSite=Strict; Expires=${expirationDate.toUTCString()}`,
          },
        }
      );
    } else {
      return NextResponse.json(
        { error: "Something went wrong on our end." },
        { status: 401 }
      );
    }
  }
}
