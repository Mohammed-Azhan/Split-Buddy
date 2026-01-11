import { NextResponse } from "next/server";
import { Connect } from "@/lib/db";
import Expense from "@/lib/models/Expense";


const getExpenses = async () => {
    try {
        await Connect();
        const expenses = await Expense.find().sort({ created_at: -1 });
        return expenses;
    } catch (error) {
        return null;
    }
}

// ✏️ EDIT EXPENSE
export async function PUT(req, { params }) {
    const { id } = await params;
    try {
        await Connect();
        const body = await req.json();

        if (body.event === "settle") {
            const expense = await Expense.findById(id);

            if (!expense) {
                return NextResponse.json(
                    { message: "Expense not found" },
                    { status: 404 }
                );
            }

            // 🔁 TOGGLE
            expense.isSettled = !expense.isSettled;
            await expense.save();

        }
        else {
                console.log(body.title);
            const updatedExpense = await Expense.findByIdAndUpdate(
                id,
                {
                    title: body.formData.title,
                    amount: body.formData.amount,
                    category: body.formData.category,
                    description: body.formData.description,
                    mode: body.formData.paymentMethod,
                    created_at: body.formData.date,
                    isSettled: body.formData.settled
                },
                { new: true }   // holds the updated one .
            );

            if (!updatedExpense) {
                return NextResponse.json({ message: "Expense not found", status: false });
            }
        }
        const response = await getExpenses();
        return NextResponse.json({ expenses: response, message: "New records fetched", status: true });

    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Failed to update expense", status: false });
    }
}

// 🗑 DELETE EXPENSE
export async function DELETE(_, { params }) {
    const { id } = await params;
    try {
        await Connect();

        const deleted = await Expense.findByIdAndDelete(id);

        if (!deleted) {
            return NextResponse.json({ message: "Expense not found", status: false }, { status: 404 });
        }
        const response = await getExpenses();
        return NextResponse.json({ message: "Expense deleted successfully", expenses: response, status: true });
    } catch {
        return NextResponse.json({ message: "Failed to delete expense", status: false }, { status: 500 });
    }
}
