import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

export async function GET(request) {
  return NextResponse.json(
    { msg: "this route doesn't do anything!" },
    { status: 200 }
  );
}
