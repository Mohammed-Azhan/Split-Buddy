import { NextResponse } from "next/server";
import { Connect } from "@/lib/db";
import Expense from "@/lib/models/Expense";

export async function PUT(req, { params }) {
    try {
        await Connect();

        const { id } = await params;
        const { mode } = await req.json(); // "settle" | "unsettle"

        if (!id) {
            return NextResponse.json(
                { message: "Expense ID required", status: false },
                { status: 400 }
            );
        }

        const expense = await Expense.findById(id);

        if (!expense) {
            return NextResponse.json(
                { message: "Expense not found", status: false },
                { status: 404 }
            );
        }

        if (mode === "settle") {
            expense.isSettled = true;
            expense.settledAt = new Date();
        } else if (mode === "unsettle") {
            expense.isSettled = false;
            expense.settledAt = null;
        } else {
            return NextResponse.json(
                { message: "Invalid mode", status: false },
                { status: 400 }
            );
        }

        await expense.save();

        return NextResponse.json({
            message:
                mode === "settle"
                    ? "Expense settled successfully"
                    : "Expense was unsettled",
            status: true,
            expense,
        });

    } catch (error) {
        console.error("Settle expense error:", error);
        return NextResponse.json(
            { message: "Internal server error", status: false },
            { status: 500 }
        );
    }
}
