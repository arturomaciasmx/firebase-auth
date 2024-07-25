import next from "next";
import { NextRequest, NextResponse } from "next/server";

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
  { id: "item-1", title: "Item 1", access: ItemAccess.PUBLIC },
  { id: "item-2", title: "Item 2", access: ItemAccess.USER },
  { id: "item-3", title: "Item 3", access: ItemAccess.PRO },
  { id: "item-4", title: "Item 4", access: ItemAccess.ADMIN },
  { id: "item-5", title: "Item 5", access: ItemAccess.PUBLIC },
  { id: "item-6", title: "Item 6", access: ItemAccess.USER },
  { id: "item-7", title: "Item 7", access: ItemAccess.PRO },
];

export async function GET(request: NextRequest) {
  try {
    return NextResponse.json(defaultItems);
  } catch (error) {
    return new NextResponse("An error occurred", { status: 500 });
  }
}
