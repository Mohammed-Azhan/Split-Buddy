import { NextResponse } from "next/server";
import { Connect } from "@/lib/db";
import Expense from "@/lib/models/Expense";

// helpers
const toPaise = (v) => Math.round(Number(v || 0) * 100);

export async function POST(req) {
    try {
        await Connect();

        const body = await req.json();

        const {
            eventName,
            totalAmount,
            splitType,
            participants,
            settlements,
            calculated,
        } = body;

        // ---------- BASIC VALIDATION ----------
        if (!eventName || !totalAmount || !splitType) {
            return NextResponse.json(
                { message: "Missing required fields" , status : false},
                { status: 400 }
            );
        }

        if (!Array.isArray(participants) || participants.length === 0) {
            return NextResponse.json(
                { message: "Participants are required", status : false},
                { status: 400 }
            );
        }

        // ---------- TRANSFORM DATA ----------
        const participantsFormatted = participants.map((p) => ({
            friendId: String(p._id), // frontend id
            name: p.username,
            paid: toPaise(p.paid),   // store in paise
            percentage: Number(p.percentage || 0),
            shares: Number(p.shares || 1),
            share: Number(p.share),  // already paise
        }));

        const settlementsFormatted = (settlements || []).map((s) => ({
            fromId : s.fromId,
            from: s.from,
            toId : s.toId,
            to: s.to,
            amount: toPaise(s.amount), // store in paise
        }));

        console.log(settlementsFormatted);

        // ---------- CREATE EXPENSE ----------
        const expense = await Expense.create({
            eventName,
            totalAmount: toPaise(totalAmount), // paise
            splitType,
            participants: participantsFormatted,
            settlements: settlementsFormatted,
            calculated: Boolean(calculated),
            isSettled: settlementsFormatted.length === 0,
        });

        return NextResponse.json(
            { message: "Expense created successfully", expense, status : true },
            { status: 201 }
        );

    } catch (error) {
        console.error("Expense POST error:", error);
        return NextResponse.json(
            { message: "Internal server error", status : false },
            { status: 500 }
        );
    }
}




export async function PUT(req, { params }) {
    try {
        await Connect();

        const { id } = params;
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
                { message: "Expense ID missing" },
                { status: 400 }
            );
        }
        else {
            return NextResponse.json(
                { message: id },
                { status: 201 }
            );
        }

        if (!eventName || !totalAmount || !splitType) {
            return NextResponse.json(
                { message: "Missing required fields" },
                { status: 400 }
            );
        }

        if (!Array.isArray(participants) || participants.length === 0) {
            return NextResponse.json(
                { message: "Participants required" },
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
                { message: "Expense not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { message: "Expense updated successfully", expense: updatedExpense },
            { status: 200 }
        );

    } catch (err) {
        console.error("PUT expense error:", err);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}