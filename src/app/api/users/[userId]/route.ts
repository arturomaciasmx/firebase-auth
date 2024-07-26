import { firestore } from "firebase-admin";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    if (!firestore) {
      return new NextResponse("Internal server error", { status: 500 });
    }

    const userDoc = await firestore().doc(`users/${params.userId}`).get();
    const userData = userDoc.data();
    return NextResponse.json(userData);
  } catch (error) {
    return new NextResponse("Fail ed to fetch user data", { status: 500 });
  }
}
