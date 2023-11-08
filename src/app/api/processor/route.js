import { requestToBodyStream } from "next/dist/server/body-streams";
import { NextResponse } from "next/server";
import { processorFunctions } from "./model";

// handling get requests
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const { action, userId } = Object.fromEntries(searchParams);

  if (!action) {
    return NextResponse.json({ error: "action is required" }, { status: 400 });
  }

  if (action === "getbanks") {
    const banks = await processorFunctions.getUserBanks(userId);
    return NextResponse.json(banks, { status: 200 });
  }

  if (action === "getcategories") {
    const categories = await processorFunctions.getUserCategories(userId);
    return NextResponse.json(categories, { status: 200 });
  }

  if (action === "getviews") {
    const views = await processorFunctions.getUserViews();
    return NextResponse.json(views, { status: 200 });
  }
}

//handling post requests
export async function POST(request) {
  const { searchParams } = new URL(request.url);
  const { action } = Object.fromEntries(searchParams);
  const res = await request.json();

  if (!action) {
    return NextResponse.json({ error: "action is required" }, { status: 400 });
  }

  if (action === "summary") {
    const {
      userId = 0,
      date = null,
      income = null,
      spending = null,
      savings = null,
    } = Object.fromEntries(searchParams);

    if (!date || !income || !spending || !savings) {
      return NextResponse.json(
        { error: "missing parameters" }, // shows up in response.data.error
        { status: 400 }
      );
    }

    const summary = await processorFunctions.submitSummary(
      userId,
      date,
      income,
      spending,
      savings,
      res.summary
    );

    return NextResponse.json(summary, { status: 200 });
  }
}
