'use client'
import React from 'react'
import SplitPage from '../../../components/SplitPage'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Users, DollarSign, CheckIcon, Calculator, TrendingUp, Percent, Hash, BadgeCheck, CreditCard, CheckCircle2, Plus, X, ChevronDown, Check } from "lucide-react";
import ExpenseForm from '../../../components/ExpenseForm'
import StarBorder from '../../../components/StarBorder'
import { toast } from 'sonner'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { useEffect, useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import SpotlightCard from '../../../components/SpotlightCard'
import FuzzyText from '@/components/FuzzyText';
const page = () => {
    const [expenses, setExpenses] = useState([]);
    const { data: session } = useSession();
    const [selectedExpense, setSelectedExpense] = useState(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [showExpenseForm, setShowExpenseForm] = useState(false);
    const [formData, setFormData] = useState(null);
    const [totalExpenses, setTotalExpenses] = useState(0);
    const [owe, setTotalOwe] = useState(0);
    const [activeTab, setActiveTab] = useState("ongoing"); // ongoing | settled



    const [loading, setLoading] = useState(true);
    useEffect(() => {
        if (!session?.user?.id) return;

        const fetchExpenses = async () => {
            try {
                const res = await axios.get(
                    `/api/split/expense/getExpense?userId=${session.user.id}`
                );
                setExpenses(res.data.expenses);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchExpenses();
    }, [session]);

    useEffect(() => {
        if (!session?.user?.id || expenses.length === 0) return;

        const totalInvestedPaise = expenses.reduce((expenseSum, expense) => {
            const paidInThisExpense = expense.participants.reduce((pSum, p) => {
                if (p.friendId === session.user.id) {
                    return pSum + p.paid; // ✅ paise
                }
                return pSum;
            }, 0);

            return expenseSum + paidInThisExpense;
        }, 0);

        setTotalExpenses((totalInvestedPaise / 100).toFixed(2));
    }, [expenses, session]);


    useEffect(() => {
        if (!session?.user?.id || expenses.length === 0) return;

        const { get, give } = expenses.reduce(
            (acc, expense) => {
                // ❌ IGNORE settled expenses
                if (expense.isSettled) return acc;

                expense.settlements.forEach(s => {
                    if (s.toId === session.user.id) acc.get += s.amount;
                    if (s.fromId === session.user.id) acc.give += s.amount;
                });

                return acc;
            },
            { get: 0, give: 0 }
        );

        const netPaise = get - give; // KEEP SIGN

        setTotalOwe({
            amount: (netPaise / 100).toFixed(2),
            type: netPaise < 0 ? "owe" : "get",
            sign: netPaise < 0 ? "red" : "green",
        });

    }, [expenses, session]);





    const fromPaise = (p) => (p / 100).toFixed(2);

    const formatDate = (date) =>
        new Date(date).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });

    const getInitial = (name) => {
        if (session?.user?.username === name)
            return "You"
        else {
            return name?.charAt(0)?.toUpperCase() || "?"
        }
    };

    useEffect(() => {
        console.log(expenses);
    }, [expenses])


    const handleSettleUp = async (expenseId, mode) => {
        try {
            const res = await axios.put(
                `/api/split/expense/settleExpense/${expenseId}`, { mode }
            );
            if (res.data.status) {
                toast.success(` ${res.data.message} 🎉`);

                // ✅ Update UI instantly
                setExpenses(prev =>
                    prev.map(exp =>
                        exp._id === expenseId
                            ? { ...exp, isSettled: true }
                            : exp
                    )
                );
            }
        } catch (err) {
            console.error(err);
            toast.error("Failed to settle expense");
        }
    };





    return (
        <>
            <div className='pt-12 md:mx-8'>
                <FuzzyText
                    baseIntensity={0.2}
                    hoverIntensity={0.5}
                    enableHover={true}
                    color={"black"}
                    fontSize={'clamp(2rem, 2vw, 5rem)'}


                >
                    Create Expense
                </FuzzyText>


                {/* section 1 */}








                <div className="py-8 px-4">
                    <div className="max-w-7xl mt-12 mx-auto">
                        {/* Header */}
                        <div className="mb-12">
                            <div className="flex flex-col md:flex-row items-center justify-between gap-8">

                                {/* Left: Title & Context */}
                                <div className="text-center md:text-left">
                                    <div className="inline-flex items-center gap-3 mb-3">
                                        <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center shadow-md">
                                            <Users className="w-6 h-6 text-white" />
                                        </div>
                                        <span className="text-sm font-semibold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
                                            Expense Manager
                                        </span>
                                    </div>

                                    <h1 className="text-4xl md:text-5xl mt-8 md:mt-1 font-bold text-black leading-tight">
                                        Manage your expenses
                                    </h1>

                                    <p className="text-gray-600 text-lg mt-8 md:mt-4 max-w-xl">
                                        Create, split, and settle shared expenses with friends — clearly and fairly.
                                    </p>
                                </div>

                                {/* Right: Quick Stats */}
                                <div className="flex flex-wrap items-center justify-center gap-4">

                                    <div className="bg-white border border-gray-200 rounded-2xl px-6 py-4 text-center shadow-sm">
                                        <p className="text-sm text-gray-500">Total expenses created</p>
                                        <p className="text-2xl font-bold text-indigo-600 mt-3">{expenses.length}</p>
                                    </div>

                                    <div className="bg-white border border-gray-200 rounded-2xl px-6 py-4 text-center shadow-sm">
                                        <p className="text-sm text-gray-500">Your total investments</p>
                                        <p className="text-2xl font-bold text-yellow-500 mt-3">₹{totalExpenses}</p>
                                    </div>

                                    <div className="bg-white border border-gray-200 rounded-2xl px-6 py-4 text-center shadow-sm">
                                        <p className="text-sm text-gray-500">You Owe / Get</p>
                                        <p className={`text-2xl mt-3 font-bold text-${owe.sign == "red" ? 'red' : 'green'}-600`}>₹{owe.amount}</p>
                                    </div>
                                </div>
                            </div>

                            {/* CTA */}
                            <div className="flex justify-center md:justify-start mt-8">
                                <button
                                    onClick={() => setShowPopup(true)}
                                    className="bg-indigo-600 text-white px-8 py-4 rounded-xl font-semibold text-lg flex items-center gap-2 hover:bg-indigo-500 transition-all shadow-lg hover:shadow-xl"
                                >
                                    <Plus className="w-6 h-6" />
                                    Create a new expense
                                </button>
                            </div>
                        </div>


                        {/* Popup Modal with Animation */}
                        {showPopup ?
                            <ExpenseForm mode={'create'} onClose={() => setShowPopup(false)}></ExpenseForm> : null}
                    </div>


                    <style jsx>{`
            @keyframes fadeIn {
            from {
                opacity: 0;
            }
            to {
                opacity: 1;
            }
            }

            @keyframes slideUp {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
            }

            .animate-fadeIn {
            animation: fadeIn 0.2s ease-out;
            }

            .animate-slideUp {
            animation: slideUp 0.3s ease-out;
            }
        `}</style>
                </div>


            </div>



            <div className="mt-8 bg-gray-100 py-8 md:p-6 rounded-lg">
                <FuzzyText
                    baseIntensity={0.2}
                    hoverIntensity={0.5}
                    enableHover={true}
                    color={"black"}
                    fontSize={'clamp(2rem, 2vw, 5rem)'}

                    className={'mt-4'}

                >
                    Your expenses
                </FuzzyText>

                {/* Tabs */}
                <div className="flex gap-4 mt-6 mb-8 md:ml-14 overflow-y-auto p-8">
                    <button
                        onClick={() => setActiveTab("ongoing")}
                        className={`px-6 py-2 rounded-xl font-semibold transition
                    ${activeTab === "ongoing"
                                ? "bg-indigo-600 text-white"
                                : "bg-white text-gray-600 border border-gray-300"
                            }`}
                    >
                        Ongoing
                    </button>

                    <button
                        onClick={() => setActiveTab("settled")}
                        className={`px-6 py-2 rounded-xl font-semibold transition
                    ${activeTab === "settled"
                                ? "bg-green-600 text-white"
                                : "bg-white text-gray-600 border border-gray-300"
                            }`}
                    >
                        Settled
                    </button>



                </div>



                {/* Expense Cards */}
                <div className="flex items-center justify-center gap-8">
                    <div className="md:w-[90%] w-full flex items-center justify-center">
                        <div className='cards mx-3 w-full md:w-auto'>
                            {expenses
                                .filter(expense =>
                                    activeTab === "ongoing"
                                        ? !expense.isSettled
                                        : expense.isSettled
                                )
                                .map((expense) => {
                                    const peopleCount = expense.participants.length;

                                    const you = expense.participants.find(
                                        p => p.friendId === session.user.id
                                    );

                                    const yourPaid = you ? you.paid : 0;
                                    const yourShare = you ? you.share : 0;
                                    const diff = yourPaid - yourShare;


                                    return (
                                        <SpotlightCard
                                            key={expense._id}
                                            className='w-full md:w-[900px] mb-6'
                                            spotlightColor="rgba(56, 92, 253, 0.2)"
                                        >
                                            {/* Involved People */}
                                            <div className='flex items-center flex-col justify-between md:px-8'>

                                                <div className="flex items-center gap-2 mt-3">
                                                    <span className="text-lg font-bold text-gray-600">With</span>
                                                    <div className="flex -space-x-2">
                                                        {expense.participants.slice(0, 4).map((p, idx) => (
                                                            <div
                                                                key={idx}
                                                                className="w-8 h-8 p-2 rounded-full bg-indigo-500 text-white flex items-center justify-center text-xs font-semibold border-2 border-white"
                                                            >
                                                                {getInitial(p.name)}
                                                            </div>
                                                        ))}
                                                    </div>

                                                    {expense.participants.length > 4 && (
                                                        <span className="text-xs text-gray-500 ml-1">
                                                            +{expense.participants.length - 4} more
                                                        </span>
                                                    )}
                                                </div>
                                                {expense.isSettled ? <div>
                                                    <StarBorder
                                                        thickness={1.5}
                                                        speed={"4.2s"}
                                                        color='indigo'
                                                        as={"button"}
                                                        className="font-semibold"
                                                    >
                                                        <span className='flex items-center gap-4 text-lg text-indigo-700 font-bold '>
                                                            <BadgeCheck size={36} color='green' />

                                                            Settled
                                                        </span>
                                                    </StarBorder>
                                                </div> : null}
                                            </div>

                                            {/* Header */}
                                            <div className="flex flex-col sm:flex-row md:flex-row justify-between items-center mb-4">
                                                <div className='flex flex-col items-center md:block md:items-start'>
                                                    <h3 className="text-4xl md:text-5xl mt-4 mb-4 font-semibold text-gray-900">
                                                        {expense.eventName}
                                                    </h3>
                                                    <p className="text-sm text-gray-900 mt-2 bg-indigo-500 inline-block p-2 rounded-xl text-white font-semibold">
                                                        {peopleCount} people • {formatDate(expense.createdAt)}
                                                    </p>
                                                </div>

                                                <span className="text-xl font-bold mt-4 sm:mt-1 text-indigo-600">
                                                    ₹{fromPaise(expense.totalAmount)}
                                                </span>
                                            </div>

                                            <div className="h-px bg-gray-200 mb-4" />

                                            {/* Summary */}
                                            <div className="space-y-4 mb-4">
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-md text-gray-900 font-semibold">Your share</span>
                                                    <span className="font-medium text-gray-900">
                                                        ₹{fromPaise(yourShare)}
                                                    </span>
                                                </div>

                                                {diff > 0 && (
                                                    <div className="flex justify-between text-sm">
                                                        <span className="text-gray-900 text-md font-semibold">You get back</span>
                                                        <span className="font-semibold text-green-700">
                                                            ₹{fromPaise(diff)}
                                                        </span>
                                                    </div>
                                                )}

                                                {diff < 0 && (
                                                    <div className="flex justify-between text-sm">
                                                        <span className="text-gray-900">You owe</span>
                                                        <span className="font-semibold text-red-600">
                                                            ₹{fromPaise(Math.abs(diff))}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Actions */}
                                            <div className="flex gap-3">
                                                {!expense.isSettled ? (
                                                    <button onClick={() => handleSettleUp(expense._id, "settle")} className="flex-1 bg-indigo-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition">
                                                        Settle Up
                                                    </button>
                                                ) : <button onClick={() => handleSettleUp(expense._id, "unsettle")} className="flex-1 bg-green-500 text-white py-2 rounded-lg text-sm font-medium hover:bg-green-300 transition">
                                                    Mark as un settled
                                                </button>}

                                                <button
                                                    onClick={() => {
                                                        setSelectedExpense(expense);
                                                        setShowDetailsModal(true);
                                                        setEditMode(false);
                                                    }}
                                                    className="flex-1 border border-gray-300 py-2 rounded-lg text-sm font-medium bg-gray-100 hover:bg-gray-200 transition"
                                                >
                                                    View Details
                                                </button>
                                            </div>
                                        </SpotlightCard>
                                    );
                                })}
                        </div>
                    </div>
                    {/* Empty state */}
                    {expenses.filter(e =>
                        activeTab === "ongoing" ? !e.isSettled : e.isSettled
                    ).length === 0 && (
                            <p className="text-gray-500 text-lg mt-12">
                                No {activeTab} expenses found.
                            </p>
                        )}
                </div>
            </div>


            {showDetailsModal && selectedExpense && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center">

                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/50"
                        onClick={() => setShowDetailsModal(false)}
                    />

                    {/* Modal */}
                    <div className="relative bg-white w-full max-w-3xl rounded-3xl shadow-2xl p-6 animate-slideUp">

                        {/* Header */}
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-bold text-gray-900">
                                Expense Details
                            </h2>
                            <button onClick={() => setShowDetailsModal(false)}>
                                <X className="w-6 h-6 text-gray-600" />
                            </button>
                        </div>

                        {/* Event */}
                        <div className="mb-4">
                            {editMode ? (
                                <input
                                    className="w-full border rounded-lg px-3 py-2"
                                    value={selectedExpense.eventName}
                                    onChange={(e) =>
                                        setSelectedExpense({
                                            ...selectedExpense,
                                            eventName: e.target.value,
                                        })
                                    }
                                />
                            ) : (
                                <h3 className="text-lg font-semibold">
                                    {selectedExpense.eventName}
                                </h3>
                            )}
                            <p className="text-sm text-gray-500">
                                {new Date(selectedExpense.createdAt).toLocaleString()}
                            </p>
                        </div>

                        {/* Amount */}
                        <div className="bg-gray-50 rounded-xl p-4 mb-4">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Total Amount</span>
                                <span className="font-bold text-lg">
                                    ₹{(selectedExpense.totalAmount / 100).toFixed(2)}
                                </span>
                            </div>
                            <p className="text-sm text-gray-500 mt-1">
                                Split type: {selectedExpense.splitType}
                            </p>
                        </div>

                        {/* Participants */}
                        <div className="mb-4">
                            <h4 className="font-semibold mb-2">Participants</h4>
                            <div className="space-y-2">
                                {selectedExpense.participants.map((p, i) => (
                                    <div
                                        key={i}
                                        className="flex justify-between bg-gray-100 rounded-lg p-3"
                                    >
                                        <span>{p.name}</span>
                                        <span>
                                            Paid ₹{(p.paid / 100).toFixed(2)} • Share ₹
                                            {(p.share / 100).toFixed(2)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Settlements */}
                        {selectedExpense.settlements.length > 0 && (
                            <div className="mb-4">
                                <h4 className="font-semibold mb-2">Settlement Plan</h4>
                                <div className="space-y-2">
                                    {selectedExpense.settlements.map((s, i) => (
                                        <div
                                            key={i}
                                            className="flex justify-between bg-indigo-50 rounded-lg p-3"
                                        >
                                            <span>
                                                {s.from} → {s.to}
                                            </span>
                                            <span className="font-semibold">
                                                ₹{(s.amount / 100).toFixed(2)}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Actions */}
                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={() => {
                                    setEditMode(!editMode)
                                    return <SplitPage mode='edit'></SplitPage>
                                }}
                                className="flex-1 bg-indigo-600 text-white py-2 rounded-lg"
                            >
                                {editMode ? "Cancel Edit" : "Edit Expense"}
                            </button>

                            {editMode && (
                                <ExpenseForm mode={"edit"} onClose={() => setEditMode(false)} initialData={selectedExpense}></ExpenseForm>
                            )}
                        </div>
                    </div>
                </div>
            )}


        </>



    )
}

export default page
