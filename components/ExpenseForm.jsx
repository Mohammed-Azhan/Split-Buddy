"use client";
import { useState, useEffect } from "react";
import { Users, DollarSign, Calculator, TrendingUp, Percent, Hash, CreditCard, CheckCircle2, Plus, X, ChevronDown, Check } from "lucide-react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
export default function ExpenseForm({
    mode,          // "create" | "edit"
    initialData,       // expense object
    onClose,
}) {



    const { data: session, status } = useSession();
    const [amount, setAmount] = useState("");
    const [splitType, setSplitType] = useState("equal");
    const [loading, setLoading] = useState(false);
    const [allFriends, setAllFriends] = useState([
    ]);
    const [event, setEvent] = useState("");
    const [participants, setParticipants] = useState([
    ]);


    const toAmount = (v) => Math.max(0, Number(v) || 0);

    const toPaise = (v) => Math.round(Number(v || 0) * 100);
    const fromPaise = (p) => (p / 100).toFixed(2);

    useEffect(() => {
        if (mode !== "edit" || !initialData) return;

        // ✅ basic fields
        setEvent(initialData.eventName || "");
        setSplitType(initialData.splitType || "equal");

        // totalAmount is in paise → convert to rupees string
        setAmount((initialData.totalAmount / 100).toFixed(2));

        // ✅ participants mapping
        setParticipants(
            initialData.participants.map(p => ({
                _id: p.friendId,
                username: p.name,
                paid: (p.paid / 100).toFixed(2), // string for input
                percentage: p.percentage ?? 0,
                shares: p.shares ?? 1,
                share: p.share, // keep paise
            }))
        );

        // ✅ preselect payers
        setPayers(
            initialData.participants
                .filter(p => p.paid > 0)
                .map(p => p.friendId)
        );

        setCalculated(true);
    }, [mode, initialData]);




    useEffect(() => {
        console.log(session);
        console.log(status);
        if (mode === "edit") return; // ⛔ protect edit state
        if (!session || status !== "authenticated") return;
        if (status == "authenticated") {
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
    }, [session, status])

    const [friends, setFriends] = useState([]);
    const [payers, setPayers] = useState([]);
    const [calculated, setCalculated] = useState(false);
    const [showParticipantDropdown, setShowParticipantDropdown] = useState(false);
    const [expandedPayers, setExpandedPayers] = useState({});


    const fetchFriends = async () => {
        try {
            const res = await axios.get("/api/split/friends");
            console.log(res.data);
            setAllFriends(res.data.friends);

        } catch (err) {
            console.log(err);
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
    };



    const removeParticipant = (id) => {

        if (session?.user?.id && id === session.user.id) return;


        setParticipants(prev => prev.filter(p => p._id !== id));
        setPayers(prev => prev.filter(pid => pid !== id));
        setCalculated(false);
    };


    const togglePayer = (id) => {
        const newPayers = payers.includes(id)
            ? payers.filter(p => p !== id)
            : [...payers, id];

        setPayers(newPayers);

        setExpandedPayers(prev => ({
            ...prev,
            [id]: newPayers.includes(id)
        }));


        setCalculated(false);
    };

    const calculate = () => {
        if (!amount || participants.length === 0) {
            toast.warning("Add amount and participants");
            return;
        }

        if (payers.length === 0) {
            toast.warning("Select who paid");
            return;
        }

        const totalAmountPaise = toPaise(amount);
        const totalPaidPaise = participants.reduce(
            (s, p) => s + toPaise(p.paid),
            0
        );

        if (totalPaidPaise !== totalAmountPaise) {
            toast.warning("Paid total must match amount");
            return;
        }

        let updated = [...participants];

        // ✅ EQUAL SPLIT
        if (splitType === "equal") {
            let remaining = totalAmountPaise;
            const perPerson = Math.floor(totalAmountPaise / updated.length);

            updated = updated.map((p, i) => {
                const sharePaise =
                    i === updated.length - 1 ? remaining : perPerson;

                remaining -= sharePaise;
                return { ...p, share: sharePaise };
            });
        }

        // ✅ PERCENTAGE
        if (splitType === "percentage") {
            const totalPercent = updated.reduce(
                (s, p) => s + toAmount(p.percentage),
                0
            );

            if (totalPercent !== 100) {
                toast.warning("Percent must total 100%");
                return;
            }

            let remaining = totalAmountPaise;

            updated = updated.map((p, i) => {
                const sharePaise =
                    i === updated.length - 1
                        ? remaining
                        : Math.floor((totalAmountPaise * p.percentage) / 100);

                remaining -= sharePaise;
                return { ...p, share: sharePaise };
            });
        }

        // ✅ SHARES
        if (splitType === "shares") {
            const totalShares = updated.reduce(
                (s, p) => s + toAmount(p.shares),
                0
            );

            let remaining = totalAmountPaise;

            updated = updated.map((p, i) => {
                const sharePaise =
                    i === updated.length - 1
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
            const balancePaise = toPaise(p.paid) - p.share; // ✅ number

            if (balancePaise > 0) {
                creditors.push({
                    id: p._id,
                    username: p.username,
                    balance: balancePaise // ✅ keep paise
                });
            }

            if (balancePaise < 0) {
                debtors.push({
                    id: p._id,
                    username: p.username,
                    balance: Math.abs(balancePaise) // ✅ paise
                });
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
                amount: fromPaise(pay) // ✅ convert ONLY here
            });

            debtors[i].balance -= pay;
            creditors[j].balance -= pay;

            if (debtors[i].balance === 0) i++;
            if (creditors[j].balance === 0) j++;
        }

        return result;
    };


    const handleCreate = async () => {
        try {
            if (!calculated) {
                toast.warning("Please calculate split before saving");
                return;
            }

            const payload = {
                eventName: event,
                totalAmount: amount, // string like "1000.75"
                splitType,
                calculated: true,

                participants: participants.map(p => ({
                    _id: p._id,
                    username: p.username,
                    paid: p.paid,          // string "250.50"
                    percentage: p.percentage,
                    shares: p.shares,
                    share: p.share,        // paise (number)
                })),

                settlements: settlements.map(s => ({
                    fromId: s.fromId,
                    from: s.from,
                    toId: s.toId,
                    to: s.to,
                    amount: s.amount,      // string like "99.75"
                })),
            };

            const res = await axios.post("/api/split/expense/createExpense", payload);

            toast.success("Expense saved successfully");
            setShowPopup(false);

        } catch (err) {
            console.error(err);
            toast.error(err?.response?.data?.message || "Failed to save expense");
        }
    };

    useEffect(() => {
        console.log(initialData);
    }, [])




    const totalPaid = participants.reduce((s, f) => s + toAmount(f.paid), 0);
    const settlements = getSettlements();

    // 👇 PRE-FILL WHEN EDITING
    useEffect(() => {
        if (mode === "edit" && initialData) {
            setAmount((initialData.totalAmount / 100).toString());
            setEvent(initialData.eventName);
            setSplitType(initialData.splitType);

            setParticipants(
                initialData.participants.map(p => ({
                    _id: p.friendId,
                    username: p.name,
                    paid: (p.paid / 100).toString(),
                    percentage: p.percentage,
                    shares: p.shares,
                    share: p.share,
                }))
            );
        }
    }, [mode, initialData]);

    const handleUpdate = async () => {



    };

    const Handler = async (fun) => {
        if (!calculated) {
            toast.warning("Please calculate before saving");
            return;
        }

        const payload = {
            eventName: event,
            totalAmount: amount, // rupees string
            splitType,
            calculated: true,

            participants: participants.map(p => ({
                _id: p._id,
                username: p.username,
                paid: p.paid,          // rupees string
                percentage: p.percentage,
                shares: p.shares,
                share: p.share,        // paise (number)
            })),

            settlements: settlements.map(s => ({
                fromId: s.fromId,
                from: s.from,
                toId: s.toId,
                to: s.to,
                amount: s.amount,      // rupees string
            })),
        };
        if (fun === "create") {
            try {
                const res = await axios.post("/api/split/expense/createExpense", payload);

                if (res.data.status) {
                    toast.success("Expense saved successfully");
                    setShowPopup(false);

                }
            }
            catch (e) {
                console.log("error : " + e);
            }
        }
        else {
            try {
                const res = await axios.put(`/api/split/expense/updateExpense/${initialData._id}`, payload);
                console.log(res.data);
                if (res.data.status) {
                    toast.success("Expese updated");
                    setShowPopup(false);

                }
            }
            catch (e) {
                console.log("error : " + e);
            }
        }
    }

    return (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center">
            <div className="absolute inset-0 bg-black/50" onClick={onClose} />

            <div className="bg-white w-full md:max-w-4xl w-full rounded-3xl shadow-2xl p-2">
                <h2 className="text-2xl font-bold mb-4">
                    {mode === "edi" ? "Edit Expense" : "Create Expense"}
                </h2>

                <div className="fixed inset-0 bg-opacity-100 z-40 animate-fadeIn">
                    <div
                        className=""
                        onClick={() => onClose()}
                    />

                    {/* Modal Content */}
                    <div className="fixed inset-0 flex items-center justify-center z-50 p-2 pointer-events-none">
                        <div className="opacity-40 bg-gray-800 min-h-screen w-full fixed"></div>
                        <div className="bg-white z-[999] shadow-xl rounded-3xl shadow-2xl max-w-4xl w-full overflow-hidden border border-gray-200 pointer-events-auto animate-slideUp">
                            {/* Total Amount - Black Section */}
                            <div className="bg-indigo-500 p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-2xl font-bold text-white">{mode === 'create' ? 'Create New Expense' : 'Edit an expense'}</h2>
                                    <button
                                        onClick={() => onClose()}
                                        className="text-white hover:bg-gray-800 p-2 rounded-lg transition-colors"
                                    >
                                        <X className="w-6 h-6" />
                                    </button>
                                </div>

                                <label className="block text-white text-sm font-medium mb-2 flex items-center gap-2">
                                    <DollarSign className="w-4 h-4" />
                                    Total Amount
                                </label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl font-semibold">₹</span>
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
                                        className="w-full pl-10 pr-4 py-4 text-2xl font-bold bg-white text-black rounded-2xl focus:outline-none focus:ring-4 focus:ring-gray-300 transition-all"
                                    />
                                </div>
                                {totalPaid > 0 && (
                                    <div className="mt-3 text-white text-sm">
                                        Total paid: ₹{totalPaid.toFixed(2)}
                                        {totalPaid === amount && <CheckCircle2 className="inline w-4 h-4 ml-2" />}
                                        {totalPaid !== amount && amount > 0 && (
                                            <span className="ml-2 bg-white text-black px-2 py-1 rounded-full text-xs font-medium">
                                                ₹{Math.abs(amount - totalPaid).toFixed(2)} {totalPaid > amount ? "excess" : "remaining"}
                                            </span>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Scrollable Content */}
                            <div className="overflow-y-auto max-h-[calc(90vh-180px)] p-6 space-y-6">


                                {/* Select Participants */}
                                <div>
                                    <h3 className="text-lg font-semibold text-black mb-4 flex items-center gap-2">
                                        <Users className="w-5 h-5 text-black" />
                                        Event Name
                                    </h3>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={event}
                                            onChange={(e) => { setEvent(e.target.value) }}
                                            className="w-full pl-10 border border-indigo-500 pr-4 py-4 text-md font-bold bg-white text-black rounded-2xl focus:outline-none focus:ring-4 focus:ring-gray-300 transition-all"
                                            placeholder="Dinner with buddies"
                                        />
                                    </div>

                                </div>


                                {/* Select Participants */}
                                <div>
                                    <h3 className="text-lg font-semibold text-black mb-4 flex items-center gap-2">
                                        <Users className="w-5 h-5 text-black" />
                                        Participants ({participants.length})
                                    </h3>

                                    <div className="space-y-3">
                                        {/* Selected Participants Tags */}
                                        {participants.length > 0 && (
                                            <div className="flex flex-wrap gap-2 mb-3">
                                                {participants.map(f => (
                                                    <div key={f._id} className="inline-flex items-center gap-2 bg-gray-100 border border-gray-300 rounded-lg px-3 py-2"  >
                                                        <div className="w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-xs" >
                                                            {f.username[0]}
                                                        </div>
                                                        <span className="text-black text-sm font-medium">{f.username}</span>
                                                        <button

                                                            className={f._id === session.user.id ? "opacity-40 cursor-not-allowed" : ""}
                                                        >
                                                            <X className="w-4 h-4" onClick={() => {
                                                                if (f._id === session.user.id) {
                                                                    toast.error("You cannot leave the organization")
                                                                    return;
                                                                }
                                                                else {
                                                                    removeParticipant(f._id)
                                                                }
                                                            }} />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {/* Add Participant Dropdown */}
                                        <div className="relative">
                                            <button
                                                onClick={() => setShowParticipantDropdown(!showParticipantDropdown)}
                                                className="w-full bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl p-4 flex items-center justify-between text-black hover:border-gray-400 transition-all"
                                            >
                                                <div className="flex items-center gap-2">
                                                    <Plus className="w-5 h-5" />
                                                    <span className="font-medium">Add Participants</span>
                                                </div>
                                                <ChevronDown className={`w-5 h-5 transition-transform ${showParticipantDropdown ? 'rotate-180' : ''}`} />
                                            </button>

                                            {showParticipantDropdown && (
                                                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl border border-gray-300 shadow-2xl z-20 max-h-64 overflow-y-auto">
                                                    {allFriends
                                                        .filter(f => !participants.some(p => p._id === f._id))

                                                        .map(friend => (
                                                            <button
                                                                key={friend._id}
                                                                onClick={() => addParticipant(friend._id)}
                                                                className="w-full p-4 flex items-center gap-3 hover:bg-gray-100 transition-colors text-left border-b border-gray-200 last:border-b-0"
                                                            >
                                                                <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                                                    {friend.username[0]}
                                                                </div>
                                                                <span className="text-black font-medium">{friend.username}</span>
                                                            </button>
                                                        ))}
                                                    {allFriends.filter(f => !participants.some(p => p._id === f._id)).length === 0 && (
                                                        <div className="p-4 text-center text-gray-500">All friends added</div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Paid By Section */}
                                <div>
                                    <h3 className="text-lg font-semibold text-black mb-4 flex items-center gap-2">
                                        <CreditCard className="w-5 h-5 text-black" />
                                        Who Paid?
                                    </h3>
                                    {participants.length === 1 &&
                                        participants[0]._id === session.user.id && (
                                            <h1 className="text-red-500 text-sm md:text-lg font-bold mb-3">Only you are present in the organization!</h1>
                                        )}

                                    <div className="space-y-3">
                                        {participants.map(f => (
                                            <div key={f._id} className="bg-gray-50 rounded-xl border border-gray-300 overflow-hidden transition-all">
                                                <button
                                                    onClick={() => togglePayer(f._id)}
                                                    className="w-full p-4 flex items-center gap-3 hover:bg-gray-100 transition-colors"
                                                >
                                                    {/* Custom Checkbox */}
                                                    <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all ${payers.includes(f._id)
                                                        ? 'bg-indigo-500 border-black'
                                                        : 'bg-transparent border-gray-400'
                                                        }`}>
                                                        {payers.includes(f._id) && <Check className="w-4 h-4 text-white" />}
                                                    </div>

                                                    <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center text-white font-bold">
                                                        {f.username[0]}
                                                    </div>
                                                    <span className="font-medium text-black flex-1 text-left">{f.username}</span>

                                                    {payers.includes(f._id) && (
                                                        <ChevronDown className={`w-5 h-5 text-gray-600 transition-transform ${expandedPayers[f._id] ? 'rotate-180' : ''}`} />
                                                    )}
                                                </button>

                                                {/* Expandable Amount Input */}
                                                <div className={`transition-all duration-300 ease-in-out overflow-hidden ${payers.includes(f._id)
                                                    ? 'max-h-32 opacity-100'
                                                    : 'max-h-0 opacity-0'
                                                    }`}>
                                                    <div className="px-4 pb-4 border-t border-gray-300 pt-4 bg-white">
                                                        <label className="text-gray-600 text-xs mb-2 block">Amount Paid</label>
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-gray-600 text-lg">₹</span>
                                                            <input
                                                                type="text"
                                                                value={f.paid || ""}
                                                                onChange={(e) => {
                                                                    setParticipants(ps =>
                                                                        ps.map(p =>
                                                                            p._id === f._id
                                                                                ? { ...p, paid: e.target.value }
                                                                                : p
                                                                        )
                                                                    );
                                                                    setCalculated(false);
                                                                }}

                                                                className="flex-1 px-4 py-3 bg-gray-100 text-black border-2 border-gray-300 rounded-lg focus:border-black focus:outline-none text-lg font-semibold"
                                                                placeholder="0.00"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Split Type */}
                                <div>
                                    <h3 className="text-lg font-semibold text-black mb-4 flex items-center gap-2">
                                        <TrendingUp className="w-5 h-5 text-black" />
                                        Split Method
                                    </h3>
                                    <div className="grid grid-cols-3 gap-3">
                                        {[
                                            { value: "equal", label: "Equal", icon: Users },
                                            { value: "percentage", label: "Percentage", icon: Percent },
                                            { value: "shares", label: "Shares", icon: Hash }
                                        ].map(({ value, label, icon: Icon }) => (
                                            <button
                                                key={value}
                                                onClick={() => { setSplitType(value); setCalculated(false); }}
                                                className={`p-4 rounded-xl border-2 transition-all ${splitType === value
                                                    ? "border-black bg-indigo-500 text-white"
                                                    : "border-indigo-300 bg-gray-50 text-gray-600 hover:border-gray-400"
                                                    }`}
                                            >
                                                <Icon className="w-6 h-6 mx-auto mb-2" />
                                                <div className="font-medium text-sm">{label}</div>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Split Configuration */}
                                {splitType !== "equal" && (
                                    <div>
                                        <h3 className="text-lg font-semibold text-black mb-4">
                                            {splitType === "percentage" ? "Set Percentages" : "Set Shares"}
                                        </h3>
                                        <div className="space-y-3">
                                            {participants.map(f => (
                                                <div key={f._id} className="flex items-center gap-3 bg-gray-50 rounded-xl p-4 border border-gray-300">
                                                    <span className="font-medium text-black flex-1">{f.username}</span>
                                                    <input
                                                        type="text"
                                                        placeholder="0"
                                                        value={splitType === "percentage" ? f.percentage === 0 ? "" : f.percentage : f.shares === 0 ? "" : f.shares}
                                                        onChange={(e) => {
                                                            setParticipants(fs => fs.map(x =>
                                                                x._id === f._id
                                                                    ? { ...x, [splitType === "percentage" ? "percentage" : "shares"]: Number(e.target.value) }
                                                                    : x
                                                            ));
                                                            setCalculated(false);
                                                        }}
                                                        className="w-24 px-3 py-2 bg-white text-black border-2 border-gray-300 rounded-lg focus:border-black focus:outline-none"
                                                    />
                                                    <span className="text-gray-600 text-sm w-8">
                                                        {splitType === "percentage" ? "%" : "×"}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Calculate Button */}
                                <button
                                    onClick={calculate}
                                    className="w-full bg-indigo-500 mt-8 text-white py-4 rounded-xl font-semibold text-lg flex items-center justify-center gap-2 hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl"
                                >
                                    <Calculator className="w-5 h-5" />
                                    Calculate expense
                                </button>

                                {/* Settlement */}
                                {calculated && (
                                    <div className="bg-gray-50 rounded-2xl p-6 border-2 border-gray-300">
                                        <h3 className="text-xl font-bold text-black mb-4 flex items-center gap-2">
                                            <CheckCircle2 className="w-6 h-6 text-black" />
                                            Settlement Plan
                                        </h3>
                                        {settlements.length === 0 ? (
                                            <div className="text-center py-8">
                                                <div className="text-4xl mb-2">✨</div>
                                                <p className="text-gray-600 font-medium">All settled! No payments needed.</p>
                                            </div>
                                        ) : (
                                            <div className="space-y-3">
                                                {settlements.map((s, i) => (
                                                    <div key={i} className="bg-white rounded-xl p-4 shadow-sm border border-gray-300">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center text-white font-bold">
                                                                {s.from[0]}
                                                            </div>
                                                            <div className="flex-1">
                                                                <div className="font-semibold text-black">
                                                                    {s.from} → {s.to}
                                                                </div>
                                                                <div className="text-2xl font-bold text-black">
                                                                    ₹{s.amount}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Share Breakdown */}
                                {calculated && (
                                    <div>
                                        <h3 className="text-lg font-semibold text-black mb-4">Share Breakdown</h3>
                                        <div className="space-y-2">
                                            {participants.map(f => (
                                                <div key={f._id} className="flex items-center justify-between bg-gray-50 rounded-lg p-3 border border-gray-300">
                                                    <span className="font-medium text-black">{f.username}</span>
                                                    <div className="text-right">
                                                        <div className="font-semibold text-black">₹{fromPaise(f.share)}</div>
                                                        <div className="text-xs text-gray-600">Paid: ₹{fromPaise(toPaise(f.paid))}</div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="flex justify-center items-center mt-8">
                                            <button
                                                onClick={() => Handler(mode === "edit" ? "update" : "create")}
                                                className="bg-indigo-500 text-white px-8 py-4 rounded-xl text-center font-semibold text-lg w-full flex items-center justify-center gap-2 hover:bg-indigo-300 transition-all shadow-lg hover:shadow-xl"
                                            >
                                                <Plus className="w-6 h-6" />
                                                {mode === "edit" ? "Update Expense" : "Save Expense"}

                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                {/* 
                <button
                    onClick={handleSave}
                    className="w-full bg-indigo-600 text-white py-3 rounded-xl mt-6"
                >
                </button> */}
            </div>
        </div>
    );
}
