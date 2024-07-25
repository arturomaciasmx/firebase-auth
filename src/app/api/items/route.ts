import { NextRequest, NextResponse } from "next/server";
import { firestore } from "../../../../firebase/server";

export enum ItemAccess {
  PUBLIC = "PUBLIC",
  USER = "USER",
  PRO = "PRO",
  ADMIN = "ADMIN",
}

export type Item = {
  id: string;
  title: string;
  access: ItemAccess;
};

const defaultItems: Item[] = [
  { id: "1", title: "Item 1", access: ItemAccess.PUBLIC },
  { id: "2", title: "Item 2", access: ItemAccess.USER },
  { id: "3", title: "Item 3", access: ItemAccess.PRO },
  { id: "4", title: "Item 4", access: ItemAccess.ADMIN },
];

export async function GET(request: NextRequest) {
  try {
    if (!firestore) {
      return new NextResponse("An error occurred", { status: 500 });
    }
    const response = await firestore.collection("items").get();
    const items = response.docs.map((doc) => doc.data());

    if (items.length <= 0) {
      const batch = firestore.batch();

      defaultItems.forEach((item) => {
        const itemRef = firestore?.collection("items").doc();
        if (itemRef) {
          batch.set(itemRef, item);
        }
      });
      batch.commit();
      return NextResponse.json(defaultItems);
    }

    return NextResponse.json(items);
  } catch (error) {
    return new NextResponse("An error occurred", { status: 500 });
  }
}
