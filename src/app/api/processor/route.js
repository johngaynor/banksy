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
    if (!res.date || !res.income || !res.spending || !res.userId) {
      return NextResponse.json(
        { error: "missing parameters" }, // shows up in response.data.error
        { status: 400 }
      );
    }

    const summary = await processorFunctions.submitSummary(
      res.userId,
      res.date,
      res.income,
      res.spending,
      res.summary
    );

    return NextResponse.json(summary, { status: 200 });
  }

  if (action === "addkeyword") {
    if (!res.userId || !res.categoryId || !res.keyword) {
      return NextResponse.json(
        { error: "missing parameters" },
        { status: 400 }
      );
    }

    const keyword = await processorFunctions.addKeyword(
      res.userId,
      res.categoryId,
      res.keyword
    );

    if (!keyword || keyword.error) {
      return NextResponse.json(
        { error: "failed to add keyword" },
        { status: 400 }
      );
    }

    return NextResponse.json(keyword, { status: 200 });
  }
}
