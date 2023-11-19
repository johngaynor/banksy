import { NextResponse } from "next/server";

// Create a simple keystore with your JWT secret
const keystore = jose.JWK.createKeyStore();
const jwtSecret = process.env.JWT_SECRET_KEY;
keystore.add({
  kty: "oct",
  k: jwtSecret, // Your JWT secret
  alg: "HS256", // Algorithm, make sure it matches the one used to sign the JWT
});

export async function middleware(request) {
  const { searchParams } = new URL(request.url);
  const { userId } = Object.fromEntries(searchParams);
  const jwtToken = request.cookies.get("jwt-token")?.value;

  if (jwtToken) {
    console.log(jwtToken);
    try {
      const decrypted = await jose.JWE.createDecrypt(keystore, {
        alg: "HS256",
      }).decrypt(jwtToken);
      console.log(decrypted);
      // const token = JSON.parse(decrypted.payload.toString());
      // console.log(token.userId);
    } catch (error) {
      console.error("JWT verification failed:", error.message);
      return NextResponse.json(
        { msg: "authentication failed" },
        { status: 401 }
      );
    }
  }

  const response = NextResponse.next();
  return response;
}

export const config = {
  matcher: "/api/:function*",
};
