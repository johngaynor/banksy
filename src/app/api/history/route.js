import { NextResponse } from "next/server";
import { historyFunctions } from "./model";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get("action");
  const userId = searchParams.get("userId");

  if (!action) {
    return NextResponse.json({ error: "action is required" }, { status: 400 });
  }

  if (action === "gethistory") {
    const history = await historyFunctions.getUserHistory(userId);
    return NextResponse.json(history, { status: 200 });
  }
}
