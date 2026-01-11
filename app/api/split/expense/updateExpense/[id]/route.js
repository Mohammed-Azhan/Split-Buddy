import { NextResponse } from "next/server";
import { Connect } from "@/lib/db";
import Expense from "@/lib/models/Expense";

// helpers
const toPaise = (v) => Math.round(Number(v || 0) * 100);

export async function PUT(req, { params }) {
    try {
        await Connect();

        const { id } = await params;
        const body = await req.json();

        const {
            eventName,
            totalAmount,
            splitType,
            participants,
            settlements,
            calculated,
        } = body;

        if (!id) {
            return NextResponse.json(
                { message: "Expense ID missing", status : false },
                { status: 400 }
            );
        }

        if (!eventName || !totalAmount || !splitType) {
            return NextResponse.json(
                { message: "Missing required fields", status : false },
                { status: 400 }
            );
        }

        if (!Array.isArray(participants) || participants.length === 0) {
            return NextResponse.json(
                { message: "Participants required", status : false },
                { status: 400 }
            );
        }

        // 🔹 TRUST FRONTEND — just normalize
        const participantsFormatted = participants.map(p => ({
            friendId: String(p._id),
            name: p.username,
            paid: toPaise(p.paid),
            percentage: Number(p.percentage || 0),
            shares: Number(p.shares || 1),
            share: Number(p.share), // already paise
        }));

        const settlementsFormatted = (settlements || []).map(s => ({
            from: s.from,
            to: s.to,
            amount: toPaise(s.amount),
        }));

        const updatedExpense = await Expense.findByIdAndUpdate(
            id,
            {
                eventName,
                totalAmount: toPaise(totalAmount),
                splitType,
                participants: participantsFormatted,
                settlements: settlementsFormatted,
                calculated: Boolean(calculated),
                isSettled: settlementsFormatted.length === 0,
            },
            { new: true }
        );

        if (!updatedExpense) {
            return NextResponse.json(
                { message: "Expense not found", status : false },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { message: "Expense updated successfully", expense: updatedExpense, status : true },
            { status: 200 }
        );

    } catch (err) {
        console.error("PUT expense error:", err);
        return NextResponse.json(
            { message: "Internal server error", status : false },
            { status: 500 }
        );
    }
}