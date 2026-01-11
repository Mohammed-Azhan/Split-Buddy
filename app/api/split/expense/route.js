import { NextResponse } from "next/server";
import { Connect } from "@/lib/db";
import Expense from "@/lib/models/Expense";

// 🔹 CREATE EXPENSE (POST)

const getExpenses = async () => {
    try {
        await Connect();
        const expenses = await Expense.find().sort({ created_at: -1 });
        return expenses;
    } catch (error) {
        return null;
    }
}

export async function POST(req) {
  try {
    await Connect();
    const body = await req.json();

    const expense = await Expense.create({
      title: body.title,
      amount: body.amount,
      category: body.category,
      created_at: body.date,
      mode: body.paymentMethod,
      description: body.description,
      isSettled: body.settled
    });

    const response = await getExpenses();

    return NextResponse.json({expenses : response,  status: true, message : "Expense created" });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to create expense", status : false},
    );
  }
}

// 🔹 GET ALL EXPENSES
export async function GET() {
  const response = await getExpenses();
  if(response){
    return NextResponse.json({expenses:response, message : "Records fetched", status : true});
  }
  return NextResponse.json({message : "Failed to fetch records", status : false});
}
