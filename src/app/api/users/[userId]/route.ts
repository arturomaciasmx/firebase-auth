import { firestore } from "firebase-admin";
import { DecodedIdToken } from "firebase-admin/auth";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "../../../../../firebase/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    if (!firestore) {
      return new NextResponse("Internal server error", { status: 500 });
    }

    const authToken = request.headers.get("Authorization")?.split("Bearer ")[1] || null;

    let user: DecodedIdToken | null = null;
    if (auth && authToken) {
      try {
        user = await auth.verifyIdToken(authToken);
      } catch (error) {
        console.error(error);
      }
    }

    const isAdmin = user?.role === "admin";

    const valid = isAdmin || user?.uid === params.userId;

    if (!valid) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const userDoc = await firestore().doc(`users/${params.userId}`).get();
    const userData = userDoc.data();
    return NextResponse.json(userData);
  } catch (error) {
    return new NextResponse("Fail ed to fetch user data", { status: 500 });
  }
}
