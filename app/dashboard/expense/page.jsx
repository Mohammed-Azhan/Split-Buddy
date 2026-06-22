'use client';

import React, { useEffect, useState } from 'react';
import axios from "axios";
import { useSession } from "next-auth/react";
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Users, Plus, X, BadgeCheck, CheckCircle2, ChevronDown, 
    CreditCard, Calendar, ArrowRight, Receipt, Clock, Landmark, Activity
} from "lucide-react";
import ExpenseForm from '../../../components/ExpenseForm';

const page = () => {
    const [expenses, setExpenses] = useState([]);
    const { data: session } = useSession();
    const [selectedExpense, setSelectedExpense] = useState(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [totalExpenses, setTotalExpenses] = useState(0);
    const [owe, setTotalOwe] = useState({ amount: "0.00", type: "get", sign: "green" });
    const [activeTab, setActiveTab] = useState("ongoing"); // ongoing | settled
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!session?.user?.id) return;
        const fetchExpenses = async () => {
            try {
                const res = await axios.get(`/api/split/expense/getExpense?userId=${session.user.id}`);
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
                    return pSum + p.paid; // paise
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
                if (expense.isSettled) return acc;
                expense.settlements.forEach(s => {
                    if (s.toId === session.user.id) acc.get += s.amount;
                    if (s.fromId === session.user.id) acc.give += s.amount;
                });
                return acc;
            },
            { get: 0, give: 0 }
        );

        const netPaise = get - give; 
        setTotalOwe({
            amount: (Math.abs(netPaise) / 100).toFixed(2),
            type: netPaise < 0 ? "owe" : "get",
            sign: netPaise < 0 ? "red" : "green",
        });
    }, [expenses, session]);

    const fromPaise = (p) => (p / 100).toFixed(2);
    const formatDate = (date) => new Date(date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
    
    const getInitial = (name) => {
        if (session?.user?.username === name) return "You";
        return name?.charAt(0)?.toUpperCase() || "?";
    };

    const handleSettleUp = async (expenseId, mode) => {
        try {
            const res = await axios.put(`/api/split/expense/settleExpense/${expenseId}`, { mode });
            if (res.data.status) {
                toast.success(`${res.data.message} 🎉`);
                setExpenses(prev => prev.map(exp => exp._id === expenseId ? { ...exp, isSettled: mode === "settle" } : exp));
            }
        } catch (err) {
            console.error(err);
            toast.error("Failed to update settlement status");
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[80vh]">
                <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-20 md:mt-24 mb-24 min-h-screen">
            
            {/* Header Section */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6"
            >
                <div>
                    <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-2">Expenses</h1>
                    <p className="text-gray-500 max-w-xl text-lg">Manage your shared expenses, track who owes what, and settle up instantly.</p>
                </div>
                <button
                    onClick={() => setShowPopup(true)}
                    className="bg-gray-900 text-white px-6 py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-black transition-all active:scale-95 shadow-lg shadow-gray-200"
                >
                    <Plus className="w-5 h-5" />
                    New Expense
                </button>
            </motion.div>

            {/* Stats Row */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
            >
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex items-center gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                        <Receipt className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-gray-500">Total Activities</p>
                        <p className="text-2xl font-bold text-gray-900">{expenses.length}</p>
                    </div>
                </div>

                <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex items-center gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-zinc-100 flex items-center justify-center text-zinc-600">
                        <Landmark className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-gray-500">Your Investments</p>
                        <p className="text-2xl font-bold text-gray-900">₹{totalExpenses}</p>
                    </div>
                </div>

                <div className={`bg-white rounded-3xl p-6 shadow-sm border ${owe.sign === "red" ? 'border-rose-100' : 'border-emerald-100'} flex items-center gap-5`}>
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${owe.sign === "red" ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'}`}>
                        <Activity className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-gray-500">Net Pending Balance</p>
                        <div className="flex items-end gap-2">
                            <p className={`text-2xl font-bold ${owe.sign === "red" ? 'text-rose-600' : 'text-emerald-600'}`}>
                                {owe.sign === "red" ? "-" : "+"}₹{owe.amount}
                            </p>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* List Section */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden"
            >
                {/* Tabs */}
                <div className="flex items-center gap-2 p-2 bg-gray-50/50 border-b border-gray-100">
                    <button
                        onClick={() => setActiveTab("ongoing")}
                        className={`flex-1 md:flex-none px-6 py-3 rounded-2xl text-sm font-bold transition-all ${
                            activeTab === "ongoing"
                                ? "bg-white text-gray-900 shadow-sm ring-1 ring-gray-100"
                                : "text-gray-500 hover:text-gray-700 hover:bg-gray-100/50"
                        }`}
                    >
                        Pending Expenses
                    </button>
                    <button
                        onClick={() => setActiveTab("settled")}
                        className={`flex-1 md:flex-none px-6 py-3 rounded-2xl text-sm font-bold transition-all ${
                            activeTab === "settled"
                                ? "bg-white text-gray-900 shadow-sm ring-1 ring-gray-100"
                                : "text-gray-500 hover:text-gray-700 hover:bg-gray-100/50"
                        }`}
                    >
                        Settled History
                    </button>
                </div>

                {/* Expense List */}
                <div className="divide-y divide-gray-50">
                    {expenses.filter(expense => activeTab === "ongoing" ? !expense.isSettled : expense.isSettled).length === 0 ? (
                        <div className="p-16 flex flex-col items-center justify-center text-center">
                            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                                <Receipt className="w-8 h-8 text-gray-300" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">No {activeTab} expenses</h3>
                            <p className="text-gray-500 max-w-sm">When you create or participate in an expense, it will show up here.</p>
                        </div>
                    ) : (
                        expenses
                            .filter(expense => activeTab === "ongoing" ? !expense.isSettled : expense.isSettled)
                            .map((expense) => {
                                const you = expense.participants.find(p => p.friendId === session.user.id);
                                const diff = you ? you.paid - you.share : 0;

                                return (
                                    <div key={expense._id} className="p-6 md:p-8 hover:bg-gray-50/50 transition-colors group flex flex-col md:flex-row md:items-center justify-between gap-6">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="text-xl font-bold text-gray-900">{expense.eventName}</h3>
                                                {expense.isSettled && (
                                                    <span className="inline-flex items-center gap-1 text-xs font-bold px-2 py-1 bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-100">
                                                        <BadgeCheck className="w-3.5 h-3.5" />
                                                        Settled
                                                    </span>
                                                )}
                                            </div>
                                            
                                            <div className="flex items-center gap-4 text-sm font-medium text-gray-500 mb-4">
                                                <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> {formatDate(expense.createdAt)}</span>
                                                <span className="flex items-center gap-1.5"><Users className="w-4 h-4" /> {expense.participants.length} people</span>
                                            </div>

                                            <div className="flex -space-x-2">
                                                {expense.participants.slice(0, 5).map((p, idx) => (
                                                    <div key={idx} className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center text-xs font-bold border-2 border-white ring-1 ring-gray-100 shadow-sm" title={p.name}>
                                                        {getInitial(p.name)}
                                                    </div>
                                                ))}
                                                {expense.participants.length > 5 && (
                                                    <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center text-xs font-bold border-2 border-white ring-1 ring-gray-100 shadow-sm">
                                                        +{expense.participants.length - 5}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex flex-col md:items-end gap-1">
                                            <div className="text-2xl font-black text-gray-900">₹{fromPaise(expense.totalAmount)}</div>
                                            <div className="text-sm font-semibold text-gray-500 mb-4">Total Amount</div>
                                            
                                            {diff > 0 ? (
                                                <div className="text-emerald-600 font-bold bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100">
                                                    You get ₹{fromPaise(diff)}
                                                </div>
                                            ) : diff < 0 ? (
                                                <div className="text-rose-600 font-bold bg-rose-50 px-3 py-1.5 rounded-lg border border-rose-100">
                                                    You owe ₹{fromPaise(Math.abs(diff))}
                                                </div>
                                            ) : (
                                                <div className="text-gray-500 font-bold bg-gray-100 px-3 py-1.5 rounded-lg">
                                                    Settled up
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex items-center gap-2 mt-4 md:mt-0 pt-4 md:pt-0 border-t md:border-t-0 border-gray-100">
                                            {!expense.isSettled ? (
                                                <button 
                                                    onClick={() => handleSettleUp(expense._id, "settle")} 
                                                    className="flex-1 md:flex-none px-4 py-2.5 bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-indigo-700 transition-colors shadow-sm"
                                                >
                                                    Settle
                                                </button>
                                            ) : (
                                                <button 
                                                    onClick={() => handleSettleUp(expense._id, "unsettle")} 
                                                    className="flex-1 md:flex-none px-4 py-2.5 bg-gray-100 text-gray-600 text-sm font-bold rounded-xl hover:bg-gray-200 transition-colors"
                                                >
                                                    Undo
                                                </button>
                                            )}
                                            <button
                                                onClick={() => { setSelectedExpense(expense); setShowDetailsModal(true); setEditMode(false); }}
                                                className="flex-1 md:flex-none px-4 py-2.5 bg-white border border-gray-200 text-gray-700 text-sm font-bold rounded-xl hover:bg-gray-50 transition-colors shadow-sm"
                                            >
                                                Details
                                            </button>
                                        </div>
                                    </div>
                                );
                            })
                    )}
                </div>
            </motion.div>

            {/* Create Popup Form */}
            {showPopup && <ExpenseForm mode='create' onClose={() => setShowPopup(false)} />}

            {/* Expense Details Modal */}
            <AnimatePresence>
                {showDetailsModal && selectedExpense && (
                    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                            onClick={() => setShowDetailsModal(false)}
                        />
                        
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} transition={{ type: "spring", duration: 0.5, bounce: 0 }}
                            className="bg-white w-full max-w-2xl rounded-[2rem] shadow-2xl relative z-10 overflow-hidden flex flex-col max-h-[90vh]"
                        >
                            <div className="bg-gray-50 px-8 py-6 border-b border-gray-100 flex items-center justify-between">
                                <h2 className="text-xl font-bold text-gray-900 tracking-tight">Expense Details</h2>
                                <button onClick={() => setShowDetailsModal(false)} className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200/50 text-gray-500 hover:bg-gray-200 hover:text-gray-900 transition-colors">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="overflow-y-auto flex-1 p-8 space-y-8">
                                <div className="text-center">
                                    <h3 className="text-3xl font-extrabold text-gray-900 mb-2">{selectedExpense.eventName}</h3>
                                    <p className="text-gray-500 font-medium flex items-center justify-center gap-2">
                                        <Calendar className="w-4 h-4" /> {new Date(selectedExpense.createdAt).toLocaleString()}
                                    </p>
                                </div>

                                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-semibold text-gray-500">Total Amount</p>
                                        <p className="text-3xl font-black text-gray-900">₹{fromPaise(selectedExpense.totalAmount)}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-semibold text-gray-500">Split Method</p>
                                        <p className="text-lg font-bold text-indigo-600 capitalize">{selectedExpense.splitType}</p>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Participants</h4>
                                    <div className="space-y-3">
                                        {selectedExpense.participants.map((p, i) => (
                                            <div key={i} className="flex items-center justify-between bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-sm">
                                                        {p.name[0]?.toUpperCase()}
                                                    </div>
                                                    <span className="font-bold text-gray-900">{p.name}</span>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-sm font-bold text-gray-900">Paid: ₹{fromPaise(p.paid)}</p>
                                                    <p className="text-xs font-semibold text-gray-500">Share: ₹{fromPaise(p.share)}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {selectedExpense.settlements.length > 0 && (
                                    <div>
                                        <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Settlement Plan</h4>
                                        <div className="space-y-3">
                                            {selectedExpense.settlements.map((s, i) => (
                                                <div key={i} className="flex items-center justify-between bg-indigo-50/50 border border-indigo-100 rounded-xl p-4">
                                                    <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                                        <span className="text-gray-900">{s.from}</span>
                                                        <TrendingUp className="w-4 h-4 text-indigo-400" />
                                                        <span className="text-gray-900">{s.to}</span>
                                                    </div>
                                                    <span className="font-bold text-indigo-600">₹{fromPaise(s.amount)}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="p-6 border-t border-gray-100 bg-gray-50/50">
                                <button
                                    onClick={() => setEditMode(true)}
                                    className="w-full py-4 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-500/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                                >
                                    Edit Expense
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {editMode && <ExpenseForm mode="edit" onClose={() => setEditMode(false)} initialData={selectedExpense} />}
        </div>
    );
};

export default page;
