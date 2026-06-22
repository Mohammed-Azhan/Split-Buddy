"use client";
import { useState, useEffect } from "react";
import { Users, DollarSign, Calculator, TrendingUp, Percent, Hash, CreditCard, CheckCircle2, Plus, X, ChevronDown, Check, Sparkles } from "lucide-react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

export default function ExpenseForm({
    mode,          // "create" | "edit"
    initialData,       // expense object
    onClose,
}) {
    const { data: session, status } = useSession();
    const [amount, setAmount] = useState("");
    const [splitType, setSplitType] = useState("equal");
    const [loading, setLoading] = useState(false);
    const [allFriends, setAllFriends] = useState([]);
    const [event, setEvent] = useState("");
    const [participants, setParticipants] = useState([]);

    const toAmount = (v) => Math.max(0, Number(v) || 0);
    const toPaise = (v) => Math.round(Number(v || 0) * 100);
    const fromPaise = (p) => (p / 100).toFixed(2);

    useEffect(() => {
        if (mode !== "edit" || !initialData) return;

        setEvent(initialData.eventName || "");
        setSplitType(initialData.splitType || "equal");
        setAmount((initialData.totalAmount / 100).toFixed(2));

        setParticipants(
            initialData.participants.map(p => ({
                _id: p.friendId,
                username: p.name,
                paid: (p.paid / 100).toFixed(2),
                percentage: p.percentage ?? 0,
                shares: p.shares ?? 1,
                share: p.share,
            }))
        );

        setCalculated(true);
    }, [mode, initialData]);

    useEffect(() => {
        if (mode === "edit") return;
        if (!session || status !== "authenticated") return;
        if (status == "authenticated" && participants.length === 0) {
            setParticipants([
                {
                    _id: session.user.id,
                    username: session.user.username,
                    paid: 0,
                    percentage: 0,
                    shares: 1,
                    share: 0
                }
            ])
        }
    }, [session, status]);

    const [calculated, setCalculated] = useState(false);
    const [showParticipantDropdown, setShowParticipantDropdown] = useState(false);

    const fetchFriends = async () => {
        try {
            const res = await axios.get("/api/split/friends");
            setAllFriends(res.data.friends);
        } catch (err) {
            toast.error("Failed to load friends");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFriends();
    }, []);

    const addParticipant = (friendId) => {
        if (participants.some(p => p._id === friendId)) return;
        const friend = allFriends.find(f => f._id === friendId);
        if (!friend) return;

        setParticipants(prev => [
            ...prev,
            {
                _id: friend._id,
                username: friend.username,
                paid: 0,
                percentage: 0,
                shares: 1,
                share: 0
            }
        ]);
        setCalculated(false);
        setShowParticipantDropdown(false);
    };

    const removeParticipant = (id) => {
        if (session?.user?.id && id === session.user.id) return;
        setParticipants(prev => prev.filter(p => p._id !== id));
        setCalculated(false);
    };

    const calculate = () => {
        if (!amount || participants.length === 0) {
            toast.warning("Add amount and participants");
            return;
        }

        const actualPayers = participants.filter(p => Number(p.paid) > 0);
        if (actualPayers.length === 0) {
            toast.warning("Specify who paid by entering an amount paid");
            return;
        }

        const totalAmountPaise = toPaise(amount);
        const totalPaidPaise = participants.reduce(
            (s, p) => s + toPaise(p.paid),
            0
        );

        if (totalPaidPaise !== totalAmountPaise) {
            toast.warning("Paid total must match total amount exactly");
            return;
        }

        let updated = [...participants];

        if (splitType === "equal") {
            let remaining = totalAmountPaise;
            const perPerson = Math.floor(totalAmountPaise / updated.length);

            updated = updated.map((p, i) => {
                const sharePaise = i === updated.length - 1 ? remaining : perPerson;
                remaining -= sharePaise;
                return { ...p, share: sharePaise };
            });
        }

        if (splitType === "percentage") {
            const totalPercent = updated.reduce((s, p) => s + toAmount(p.percentage), 0);
            if (totalPercent !== 100) {
                toast.warning("Percent must total exactly 100%");
                return;
            }

            let remaining = totalAmountPaise;
            updated = updated.map((p, i) => {
                const sharePaise = i === updated.length - 1
                    ? remaining
                    : Math.floor((totalAmountPaise * p.percentage) / 100);
                remaining -= sharePaise;
                return { ...p, share: sharePaise };
            });
        }

        if (splitType === "shares") {
            const totalShares = updated.reduce((s, p) => s + toAmount(p.shares), 0);
            if (totalShares === 0) {
                toast.warning("Shares cannot be zero");
                return;
            }

            let remaining = totalAmountPaise;
            updated = updated.map((p, i) => {
                const sharePaise = i === updated.length - 1
                    ? remaining
                    : Math.floor((totalAmountPaise * p.shares) / totalShares);
                remaining -= sharePaise;
                return { ...p, share: sharePaise };
            });
        }
        
        setParticipants(updated);
        setCalculated(true);
    };

    const getSettlements = () => {
        if (!calculated) return [];

        const creditors = [];
        const debtors = [];
        const result = [];

        participants.forEach(p => {
            const balancePaise = toPaise(p.paid) - p.share;
            if (balancePaise > 0) {
                creditors.push({ id: p._id, username: p.username, balance: balancePaise });
            }
            if (balancePaise < 0) {
                debtors.push({ id: p._id, username: p.username, balance: Math.abs(balancePaise) });
            }
        });

        let i = 0, j = 0;
        while (i < debtors.length && j < creditors.length) {
            const pay = Math.min(debtors[i].balance, creditors[j].balance);

            result.push({
                fromId: debtors[i].id,
                from: debtors[i].username,
                toId: creditors[j].id,
                to: creditors[j].username,
                amount: fromPaise(pay) 
            });

            debtors[i].balance -= pay;
            creditors[j].balance -= pay;

            if (debtors[i].balance === 0) i++;
            if (creditors[j].balance === 0) j++;
        }

        return result;
    };

    const totalPaid = participants.reduce((s, f) => s + toAmount(f.paid), 0);
    const settlements = getSettlements();

    const Handler = async (fun) => {
        if (!calculated) {
            toast.warning("Please calculate before saving");
            return;
        }

        const payload = {
            eventName: event,
            totalAmount: amount,
            splitType,
            calculated: true,
            participants: participants.map(p => ({
                _id: p._id,
                username: p.username,
                paid: p.paid,
                percentage: p.percentage,
                shares: p.shares,
                share: p.share,
            })),
            settlements: settlements.map(s => ({
                fromId: s.fromId,
                from: s.from,
                toId: s.toId,
                to: s.to,
                amount: s.amount,
            })),
        };

        if (fun === "create") {
            try {
                const res = await axios.post("/api/split/expense/createExpense", payload);
                if (res.data.status) {
                    toast.success("Expense saved successfully");
                    onClose();
                }
            } catch (e) {
                toast.error("Failed to save expense");
            }
        } else {
            try {
                const res = await axios.put(`/api/split/expense/updateExpense/${initialData._id}`, payload);
                if (res.data.status) {
                    toast.success("Expense updated");
                    onClose();
                }
            } catch (e) {
                toast.error("Failed to update expense");
            }
        }
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6">
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/40 backdrop-blur-sm" 
                    onClick={onClose} 
                />

                <motion.div 
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    transition={{ type: "spring", duration: 0.5, bounce: 0 }}
                    className="bg-white w-full max-w-2xl rounded-[2rem] shadow-2xl relative z-10 overflow-hidden flex flex-col max-h-[90vh]"
                >
                    {/* Header */}
                    <div className="bg-gray-50 px-8 py-6 border-b border-gray-100 flex items-center justify-between">
                        <h2 className="text-xl font-bold text-gray-900 tracking-tight">
                            {mode === "edit" ? "Edit Expense" : "Create Expense"}
                        </h2>
                        <button
                            onClick={onClose}
                            className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200/50 text-gray-500 hover:bg-gray-200 hover:text-gray-900 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Scrollable Content */}
                    <div className="overflow-y-auto flex-1 p-8 space-y-8">

                        {/* Amount Input */}
                        <div className="flex flex-col items-center justify-center space-y-4">
                            <span className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Total Amount</span>
                            <div className="flex items-center justify-center relative w-full">
                                <span className="text-4xl text-gray-400 font-light absolute left-1/2 -translate-x-[calc(50%+4rem)]">₹</span>
                                <input
                                    type="text"
                                    value={amount || ""}
                                    onChange={(e) => {
                                        const v = e.target.value;
                                        if (/^\d*\.?\d{0,2}$/.test(v)) {
                                            setAmount(v);
                                            setCalculated(false);
                                        }
                                    }}
                                    placeholder="0.00"
                                    className="w-full text-center text-6xl font-bold text-gray-900 bg-transparent focus:outline-none placeholder:text-gray-200"
                                />
                            </div>
                            {totalPaid > 0 && (
                                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2 text-sm font-medium">
                                    <span className="text-gray-500">Total paid: ₹{totalPaid.toFixed(2)}</span>
                                    {totalPaid === amount && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                                    {totalPaid !== amount && amount > 0 && (
                                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${totalPaid > amount ? 'bg-rose-100 text-rose-600' : 'bg-amber-100 text-amber-600'}`}>
                                            ₹{Math.abs(amount - totalPaid).toFixed(2)} {totalPaid > amount ? "excess" : "remaining"}
                                        </span>
                                    )}
                                </motion.div>
                            )}
                        </div>

                        {/* Event Name */}
                        <div>
                            <div className="flex items-center gap-2 mb-3">
                                <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
                                    <Sparkles className="w-4 h-4" />
                                </div>
                                <h3 className="text-base font-bold text-gray-900">What was this for?</h3>
                            </div>
                            <input
                                type="text"
                                value={event}
                                onChange={(e) => setEvent(e.target.value)}
                                className="w-full px-5 py-4 text-base font-medium bg-gray-50 text-gray-900 rounded-2xl border-2 border-transparent focus:bg-white focus:border-indigo-100 focus:ring-4 focus:ring-indigo-50/50 transition-all outline-none placeholder:text-gray-400"
                                placeholder="e.g. Dinner with buddies"
                            />
                        </div>

                        {/* Split Method */}
                        <div>
                            <div className="flex items-center gap-2 mb-3">
                                <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
                                    <TrendingUp className="w-4 h-4" />
                                </div>
                                <h3 className="text-base font-bold text-gray-900">Split Method</h3>
                            </div>
                            <div className="grid grid-cols-3 gap-3 bg-gray-50 p-1.5 rounded-2xl">
                                {[
                                    { value: "equal", label: "Equal" },
                                    { value: "percentage", label: "Percentage" },
                                    { value: "shares", label: "Shares" }
                                ].map(({ value, label }) => (
                                    <button
                                        key={value}
                                        onClick={() => { setSplitType(value); setCalculated(false); }}
                                        className={`py-3 rounded-xl text-sm font-semibold transition-all ${splitType === value
                                            ? "bg-white text-gray-900 shadow-sm"
                                            : "text-gray-500 hover:text-gray-900"
                                            }`}
                                    >
                                        {label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Add Participants */}
                        <div>
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-sky-50 flex items-center justify-center text-sky-600">
                                        <Users className="w-4 h-4" />
                                    </div>
                                    <h3 className="text-base font-bold text-gray-900">Who's involved?</h3>
                                </div>
                                <span className="text-sm font-medium text-gray-400">{participants.length} people</span>
                            </div>

                            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
                                <div className="divide-y divide-gray-50">
                                    {participants.map((f, i) => (
                                        <motion.div 
                                            key={f._id} 
                                            initial={{ opacity: 0, x: -10 }} 
                                            animate={{ opacity: 1, x: 0 }}
                                            className="p-4 flex flex-col gap-3"
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold shadow-inner">
                                                        {f.username[0]}
                                                    </div>
                                                    <span className="font-semibold text-gray-900">{f.username}</span>
                                                </div>
                                                <button
                                                    onClick={() => {
                                                        if (f._id === session?.user?.id) {
                                                            toast.error("You cannot leave the expense");
                                                            return;
                                                        }
                                                        removeParticipant(f._id);
                                                    }}
                                                    className={`w-8 h-8 flex items-center justify-center rounded-full transition-colors ${f._id === session?.user?.id ? 'opacity-30 cursor-not-allowed' : 'text-gray-400 hover:bg-gray-100 hover:text-rose-500'}`}
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>

                                            {/* Sub-inputs per participant based on split method */}
                                            <div className="flex gap-3 ml-13">
                                                {/* Amount Paid Input */}
                                                <div className="flex-1 relative">
                                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">₹</span>
                                                    <input
                                                        type="text"
                                                        value={f.paid || ""}
                                                        onChange={(e) => {
                                                            setParticipants(ps => ps.map(p => p._id === f._id ? { ...p, paid: e.target.value } : p));
                                                            setCalculated(false);
                                                        }}
                                                        className={`w-full pl-7 pr-3 py-2 text-sm font-medium rounded-xl border ${Number(f.paid) > 0 ? 'bg-indigo-50 border-indigo-200 text-indigo-900' : 'bg-gray-50 border-transparent focus:bg-white focus:border-gray-200'} transition-colors outline-none`}
                                                        placeholder="Amount Paid"
                                                    />
                                                </div>

                                                {/* Split Config Input */}
                                                {splitType !== "equal" && (
                                                    <div className="flex-1 relative">
                                                        <input
                                                            type="text"
                                                            value={splitType === "percentage" ? (f.percentage || "") : (f.shares || "")}
                                                            onChange={(e) => {
                                                                setParticipants(fs => fs.map(x => x._id === f._id ? { ...x, [splitType === "percentage" ? "percentage" : "shares"]: Number(e.target.value) } : x));
                                                                setCalculated(false);
                                                            }}
                                                            className="w-full pl-3 pr-7 py-2 text-sm font-medium bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-gray-200 transition-colors outline-none"
                                                            placeholder={splitType === "percentage" ? "Percent" : "Shares"}
                                                        />
                                                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">
                                                            {splitType === "percentage" ? "%" : "×"}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>

                                {/* Add Participant Button inside the card */}
                                <div className="p-2 border-t border-gray-50 bg-gray-50/50">
                                    <div className="relative">
                                        <button
                                            onClick={() => setShowParticipantDropdown(!showParticipantDropdown)}
                                            className="w-full py-3 flex items-center justify-center gap-2 text-sm font-bold text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors"
                                        >
                                            <Plus className="w-4 h-4" />
                                            Add Participant
                                        </button>

                                        <AnimatePresence>
                                            {showParticipantDropdown && (
                                                <motion.div 
                                                    initial={{ opacity: 0, y: 5 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: 5 }}
                                                    className="absolute bottom-full mb-2 left-0 right-0 bg-white rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] border border-gray-100 z-20 max-h-48 overflow-y-auto"
                                                >
                                                    {allFriends.filter(f => !participants.some(p => p._id === f._id)).length === 0 ? (
                                                        <div className="p-4 text-center text-sm font-medium text-gray-400">All friends added</div>
                                                    ) : (
                                                        allFriends.filter(f => !participants.some(p => p._id === f._id)).map(friend => (
                                                            <button
                                                                key={friend._id}
                                                                onClick={() => addParticipant(friend._id)}
                                                                className="w-full p-3 flex items-center gap-3 hover:bg-gray-50 transition-colors text-left border-b border-gray-50 last:border-b-0"
                                                            >
                                                                <div className="w-8 h-8 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center text-gray-600 font-bold text-xs">
                                                                    {friend.username[0]}
                                                                </div>
                                                                <span className="text-gray-900 font-semibold text-sm">{friend.username}</span>
                                                            </button>
                                                        ))
                                                    )}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Calculate & Settlement Section */}
                        <div className="space-y-4">
                            {!calculated ? (
                                <button
                                    onClick={() => calculate()}
                                    className="w-full bg-gray-900 text-white py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 hover:bg-black hover:shadow-xl transition-all active:scale-[0.98]"
                                >
                                    <Calculator className="w-5 h-5 text-gray-300" />
                                    Calculate Split
                                </button>
                            ) : (
                                <motion.div 
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    className="bg-emerald-50 rounded-2xl p-6 border border-emerald-100"
                                >
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-lg font-bold text-emerald-900 flex items-center gap-2">
                                            <CheckCircle2 className="w-5 h-5" />
                                            Settlement Plan
                                        </h3>
                                        <button onClick={() => setCalculated(false)} className="text-xs font-bold text-emerald-600 bg-emerald-100/50 hover:bg-emerald-200 px-3 py-1 rounded-full transition-colors">
                                            Recalculate
                                        </button>
                                    </div>
                                    
                                    {settlements.length === 0 ? (
                                        <div className="text-center py-4 bg-white/50 rounded-xl">
                                            <span className="text-emerald-600 font-semibold text-sm">Perfectly balanced! No payments needed.</span>
                                        </div>
                                    ) : (
                                        <div className="space-y-2">
                                            {settlements.map((s, i) => (
                                                <div key={i} className="bg-white rounded-xl p-3 shadow-sm border border-emerald-50/50 flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex items-center gap-2 text-sm font-semibold text-gray-600">
                                                            <span className="text-gray-900">{s.from}</span>
                                                            <TrendingUp className="w-3 h-3 text-emerald-400" />
                                                            <span className="text-gray-900">{s.to}</span>
                                                        </div>
                                                    </div>
                                                    <span className="font-bold text-emerald-600">₹{s.amount}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </motion.div>
                            )}
                        </div>

                    </div>

                    {/* Footer Actions */}
                    <div className="p-6 border-t border-gray-100 bg-gray-50/50 flex gap-3">
                        <button
                            onClick={onClose}
                            className="flex-1 py-4 text-gray-500 font-bold hover:bg-gray-100 rounded-xl transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={() => Handler(mode === "edit" ? "update" : "create")}
                            disabled={!calculated}
                            className={`flex-[2] py-4 rounded-xl font-bold text-white shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2 ${calculated ? 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-indigo-500/20' : 'bg-indigo-300 cursor-not-allowed'}`}
                        >
                            {calculated ? <Check className="w-5 h-5" /> : null}
                            {mode === "edit" ? "Update Expense" : "Save Expense"}
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
