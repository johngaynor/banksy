import { NextResponse } from "next/server";
import { sign } from "jsonwebtoken";
import { settingsFunctions } from "./model";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get("action");

  if (!action) {
    return NextResponse.json({ error: "action is required" }, { status: 400 });
  }
}

export async function POST(request) {
  const { searchParams } = new URL(request.url);
  const { action } = Object.fromEntries(searchParams);
  const res = await request.json();

  if (!action) {
    return NextResponse.json({ error: "action is required" }, { status: 400 });
  }

  if (action === "profile") {
    // returns a user obj with the new info in the headers, will need to update user state
    if (res.password) {
      // const pwHash =  will need to hash pw
      const validatePassword = await settingsFunctions.checkPassword(
        res.userId,
        res.oldPassword
      );
      if (validatePassword.length === 0) {
        return NextResponse.json(
          { error: "Old password is incorrect." },
          { status: 400 }
        );
      }
      const updatePassword = await settingsFunctions.updatePassword(
        res.userId,
        res.newPassword
      );

      if (!updatePassword) {
        return NextResponse.json(
          { error: "Error updating password." },
          { status: 400 }
        );
      }
    }

    const updatedUser = await settingsFunctions.updateProfile(
      res.userId,
      res.firstName,
      res.lastName
    );

    if (updatedUser[0]) {
      const token = sign(
        {
          user_id: updatedUser[0].user_id,
          first_name: updatedUser[0].first_name,
          email: updatedUser[0].email,
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
