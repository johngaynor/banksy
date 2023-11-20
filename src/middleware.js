import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const getJwtSecretKey = () => {
  const secret = process.env.JWT_SECRET_KEY;
  if (!secret || secret.length === 0) {
    throw new Error("Environment variable for JWT_SECRET_KEY is not set.");
  }
  return secret;
};

const verifyAuth = async (token) => {
  try {
    const verified = await jwtVerify(
      token,
      new TextEncoder().encode(getJwtSecretKey())
    );
    return verified.payload;
  } catch (error) {
    throw new Error("Your token has expired/there is no token.");
  }
};

export async function middleware(request) {
  const { searchParams } = new URL(request.url);
  const { userId } = Object.fromEntries(searchParams);
  const jwtToken = request.cookies.get("jwt-token")?.value;

  const verifiedToken =
    jwtToken &&
    (await verifyAuth(jwtToken).catch((err) => {
      console.log(err);
    }));

  if (userId && userId !== "0" && parseInt(userId) !== verifiedToken.userId) {
    return NextResponse.json(
      { msg: "You do not have access to this route." },
      { status: 401 }
    );
  }

  const response = NextResponse.next();
  return response;
}

export const config = {
  matcher: "/api/:function*",
};
