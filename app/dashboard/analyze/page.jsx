'use client';
import React, { useEffect, useState } from 'react';
import { useSession } from "next-auth/react";
import axios from "axios";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area 
} from 'recharts';
import { motion } from 'framer-motion';

export default function AnalyzePage() {
    const { data: session } = useSession();
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!session?.user?.id) return;
        
        const fetchExpenses = async () => {
            try {
                const res = await axios.get(`/api/split/expense/getExpense?userId=${session.user.id}`);
                const rawExpenses = res.data.expenses || [];
                
                // Process data for charts
                const formattedData = rawExpenses.map(exp => ({
                    name: exp.eventName || 'Expense',
                    date: new Date(exp.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                    amount: (exp.totalAmount || 0) / 100 // Convert paise to currency
                })).sort((a, b) => new Date(a.date) - new Date(b.date));

                setExpenses(formattedData);
            } catch (err) {
                console.error("Failed to fetch expenses for analysis", err);
            } finally {
                setLoading(false);
            }
        };

        fetchExpenses();
    }, [session]);

    if (!session) return null;

    const totalSpent = expenses.reduce((sum, item) => sum + item.amount, 0);

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-20 md:mt-24 mb-24 min-h-screen">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                
                {/* Header Card */}
                <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-900">Analysis Report</h1>
                        <p className="text-gray-500 font-medium mt-1">Your spending trends over time</p>
                    </div>
                    <div className="text-left md:text-right">
                        <p className="text-sm font-bold text-indigo-500 uppercase tracking-wider">Total Tracked</p>
                        <p className="text-4xl font-black text-gray-900">₹{totalSpent.toFixed(2)}</p>
                    </div>
                </div>

                {loading ? (
                    <div className="h-96 w-full flex items-center justify-center bg-white rounded-[2rem] border border-gray-100 shadow-sm">
                        <div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full"></div>
                    </div>
                ) : expenses.length === 0 ? (
                    <div className="h-96 w-full flex flex-col items-center justify-center bg-white rounded-[2rem] border border-gray-100 shadow-sm">
                        <p className="text-xl font-bold text-gray-400">No expense data available</p>
                        <p className="text-gray-500">Add some expenses to see your spending trends.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-8">
                        {/* Area Chart: Spending Trend */}
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }} className="bg-white rounded-[2rem] p-6 md:p-8 shadow-sm border border-gray-100">
                            <h3 className="text-xl font-bold text-gray-900 mb-6">Spending Trend</h3>
                            <div className="h-[400px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={expenses} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
                                                <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} dy={10} />
                                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} tickFormatter={(value) => `₹${value}`} />
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                        <Tooltip 
                                            contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
                                            labelStyle={{ fontWeight: 'bold', color: '#374151', marginBottom: '0.5rem' }}
                                            formatter={(value) => [`₹${value}`, 'Amount']}
                                        />
                                        <Area type="monotone" dataKey="amount" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorAmount)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </motion.div>

                        {/* Bar Chart: Expenses Breakdown */}
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} className="bg-white rounded-[2rem] p-6 md:p-8 shadow-sm border border-gray-100">
                            <h3 className="text-xl font-bold text-gray-900 mb-6">Expenses Breakdown</h3>
                            <div className="h-[300px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={expenses} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} dy={10} />
                                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} tickFormatter={(value) => `₹${value}`} />
                                        <Tooltip 
                                            cursor={{ fill: '#f3f4f6' }}
                                            contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
                                            labelStyle={{ fontWeight: 'bold', color: '#374151', marginBottom: '0.5rem' }}
                                            formatter={(value) => [`₹${value}`, 'Amount']}
                                        />
                                        <Bar dataKey="amount" fill="#3b82f6" radius={[6, 6, 6, 6]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </motion.div>
                    </div>
                )}
            </motion.div>
        </div>
    );
}
