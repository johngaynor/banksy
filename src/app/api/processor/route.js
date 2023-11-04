import { NextResponse } from "next/server";
import { processorFunctions } from "./model";

// handling get requests
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get("action");
  const userId = searchParams.get("userId");

  if (!action) {
    return NextResponse.json({ error: "action is required" }, { status: 400 });
  }

  if (action === "getbanks") {
    const banks = await processorFunctions.getUserBanks(userId);
    return NextResponse.json(banks, { status: "200" });
  }

  if (action === "getcategories") {
    const categories = await processorFunctions.getUserCategories(userId);
    return NextResponse.json(categories, { status: "200" });
  }

  if (action === "getviews") {
    const views = await processorFunctions.getUserViews();
    return NextResponse.json(views, { status: "200" });
  }
}

//handling post requests
export async function POST(request) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get("action");

  if (!action) {
    return NextResponse.json({ error: "action is required" }, { status: 400 });
  }

  if (action === "summary") {
    const summary = await processorFunctions.submitSummary();
    return NextResponse.json(summary, { status: "200" });
  }

  // return NextResponse.json(
  //   { action: searchParams.get("action") },
  //   { status: "200" }
  // );
}
