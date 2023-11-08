import { NextResponse } from "next/server";
import { historyFunctions } from "./model";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const { action, userId } = Object.fromEntries(searchParams);

  // if (!process.env.API_PASSWORD) {
  //   return NextResponse.json({ msg: "not allowed" }, { status: 200 });
  // }

  if (!action) {
    return NextResponse.json({ error: "action is required" }, { status: 400 });
  }

  if (action === "gethistory") {
    const history = await historyFunctions.getUserHistoryByUser(userId);
    return NextResponse.json(history, { status: 200 });
  }
}

export async function DELETE(request) {
  const { searchParams } = new URL(request.url);
  const { action, userId, date } = Object.fromEntries(searchParams);

  if (!action) {
    return NextResponse.json({ error: "action is required" }, { status: 400 });
  }

  if (action === "deletehistory") {
    const result = await historyFunctions.deleteHistoryByUserAndDate(
      userId,
      date
    );
    return NextResponse.json(result, { status: 200 });
  }
}
