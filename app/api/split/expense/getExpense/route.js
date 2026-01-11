import { NextResponse } from "next/server";
import { Connect } from "@/lib/db";
import Expense from "@/lib/models/Expense";

export async function GET(req) {
  try {
    await Connect();

    // Optional: filter by user (recommended)
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId"); // string id

    const query = userId
      ? { "participants.friendId": userId }
      : {};

    const expenses = await Expense.find(query)
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(
      { expenses },
      { status: 200 }
    );

  } catch (error) {
    console.error("GET expenses error:", error);
    return NextResponse.json(
      { message: "Failed to fetch expenses" },
      { status: 500 }
    );
  }
}
