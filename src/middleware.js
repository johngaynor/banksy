import { NextResponse } from "next/server";

export function middleware(request) {
  // console.log("hit the api");
  const { searchParams } = new URL(request.url);
  const { userId } = Object.fromEntries(searchParams);
  const auth = request.cookies.get("auth")?.value; // need a logout function to clear this cookie

  if (userId && auth !== userId && parseInt(userId) !== 0) {
    // console.log("auth", auth, "userId", userId);
    return NextResponse.json({ msg: "not authed" }, { status: 401 });
  }

  const response = NextResponse.next();
  return response;
}

export const config = {
  matcher: "/api/:function*",
};
