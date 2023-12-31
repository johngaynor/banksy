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
    // handle password change
    if (res.newPassword) {
      const validatePassword = await settingsFunctions.checkPassword(
        res.userId,
        res.oldPassword
      );
      if (validatePassword.length === 0) {
        return NextResponse.json(
          { error: "Old password is incorrect." },
          { status: 200 }
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
      } else {
        return NextResponse.json({ updatePassword }, { status: 200 });
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
          last_name: updatedUser[0].last_name,
          use_default_keywords: updatedUser[0].use_default_keywords,
        },
        process.env.JWT_SECRET_KEY,
        {
          expiresIn: "6h",
        }
      );
      const expirationDate = new Date(Date.now() + 3600 * 1000);
      return NextResponse.json(
        { user: updatedUser[0] },
        {
          status: 200,
          headers: {
            "Set-Cookie": `jwt-token=${token}; Path=/; HttpOnly; Secure; SameSite=Strict; Expires=${expirationDate.toUTCString()}`,
          },
          user: updatedUser[0],
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

export async function DELETE(request) {
  const { action, userId, categoryId, keyword } = await request.json();

  if (!action) {
    return NextResponse.json({ error: "action is required" }, { status: 400 });
  }

  if (action === "keyword") {
    const result = await settingsFunctions.deleteKeyword(
      userId,
      categoryId,
      keyword
    );

    if (!result) {
      return NextResponse.json(
        { error: "Error deleting keyword." },
        { status: 400 }
      );
    } else {
      return NextResponse.json({ result }, { status: 200 });
    }
  }
}
