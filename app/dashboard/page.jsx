'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Wallet, Receipt, Activity, Clock, ArrowRight, CheckCircle2, TrendingDown, TrendingUp, Scale, Landmark } from 'lucide-react';
import { motion } from 'framer-motion';

const DashboardPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/signin');
    }
  }, [status, router]);

  useEffect(() => {
    const fetchExpenses = async () => {
      if (session?.user?.id) {
        try {
          const res = await axios.get(`/api/split/expense/getExpense?userId=${session.user.id}`);
          setExpenses(res.data.expenses || []);
        } catch (error) {
          console.error("Failed to fetch expenses", error);
        } finally {
          setLoading(false);
        }
      }
    };

    if (session?.user?.id) {
      fetchExpenses();
    }
  }, [session]);

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Basic summary stats
  const totalExpenses = expenses.length;
  // Convert from paise to rupees
  const totalAmount = expenses.reduce((acc, exp) => acc + (exp.totalAmount || 0), 0) / 100;

  // Financial Analysis based on real data
  let totalPaidByMePaise = 0;
  let totalIOwePaise = 0;
  let totalOwedToMePaise = 0;

  expenses.forEach(exp => {
    // 1. Calculate how much I have physically paid out of pocket
    const myRecord = exp.participants?.find(p => p.friendId === session?.user?.id);
    if (myRecord) {
      totalPaidByMePaise += (myRecord.paid || 0);
    }

    // 2. Calculate active (unsettled) debts
    if (!exp.isSettled && exp.settlements) {
      exp.settlements.forEach(settlement => {
        if (settlement.fromId === session?.user?.id) {
          totalIOwePaise += (settlement.amount || 0); // I am the sender (I owe this)
        }
        if (settlement.toId === session?.user?.id) {
          totalOwedToMePaise += (settlement.amount || 0); // I am the receiver (I am owed this)
        }
      });
    }
  });

  // Convert everything from paise to rupees
  const totalPaidByMe = totalPaidByMePaise / 100;
  const totalIOwe = totalIOwePaise / 100;
  const totalOwedToMe = totalOwedToMePaise / 100;

  const netBalance = totalOwedToMe - totalIOwe;
  const isPositiveBalance = netBalance >= 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-20 md:mt-24 mb-24">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900">Welcome back, {session?.user?.name || session?.user?.username || 'User'}!</h1>
        <p className="mt-2 text-gray-600">Here's a detailed financial analysis of your shared expenses.</p>
      </div>

      {/* Primary Financial Analysis Cards */}
      <h2 className="text-xl font-bold text-gray-900 mb-4">Financial Overview</h2>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-10">
        
        {/* Net Balance Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className={`lg:col-span-2 rounded-3xl p-6 shadow-sm border ${isPositiveBalance ? 'bg-emerald-500 border-emerald-600 text-white' : 'bg-rose-500 border-rose-600 text-white'}`}
        >
          <div className="flex items-center justify-between h-full">
            <div>
              <p className="text-sm font-medium opacity-90 mb-1">Your Net Balance</p>
              <h3 className="text-4xl font-extrabold tracking-tight mb-2">
                {isPositiveBalance ? '+' : '-'}₹{Math.abs(netBalance).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </h3>
              <p className="text-sm font-medium opacity-90 bg-white/20 inline-block px-3 py-1 rounded-full backdrop-blur-sm">
                {isPositiveBalance 
                  ? "You are owed more than you owe." 
                  : "You owe more than you are owed."}
              </p>
            </div>
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm shadow-inner">
              <Scale size={32} className="text-white" />
            </div>
          </div>
        </motion.div>

        {/* Total You Owe */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="w-10 h-10 bg-rose-50 rounded-xl flex items-center justify-center text-rose-600">
              <TrendingDown size={20} />
            </div>
            <span className="text-xs font-bold px-2 py-1 bg-rose-50 text-rose-600 rounded-full">Pending Out</span>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Total You Owe</p>
            <h3 className="text-3xl font-bold text-gray-900">₹{totalIOwe.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
          </div>
        </motion.div>

        {/* Total Owed To You */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
              <TrendingUp size={20} />
            </div>
            <span className="text-xs font-bold px-2 py-1 bg-emerald-50 text-emerald-600 rounded-full">Pending In</span>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Total Owed to You</p>
            <h3 className="text-3xl font-bold text-gray-900">₹{totalOwedToMe.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
          </div>
        </motion.div>
      </div>

      {/* General Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="bg-zinc-900 rounded-2xl p-6 shadow-sm text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-zinc-400 mb-1">Total Paid by You</p>
              <h3 className="text-2xl font-bold tracking-tight">₹{totalPaidByMe.toLocaleString()}</h3>
              <p className="text-xs text-zinc-500 mt-1">Total out of pocket across all groups</p>
            </div>
            <div className="w-12 h-12 bg-zinc-800 rounded-xl flex items-center justify-center text-zinc-300">
              <Landmark size={24} />
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Group Volume</p>
              <h3 className="text-2xl font-bold text-gray-900">₹{totalAmount.toLocaleString()}</h3>
              <p className="text-xs text-gray-400 mt-1">Total value of all your groups</p>
            </div>
            <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
              <Wallet size={24} />
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Involved Expenses</p>
              <h3 className="text-2xl font-bold text-gray-900">{totalExpenses} <span className="text-sm font-normal text-gray-500">records</span></h3>
              <p className="text-xs text-gray-400 mt-1">Total activities you are part of</p>
            </div>
            <div className="w-12 h-12 bg-sky-50 rounded-xl flex items-center justify-center text-sky-600">
              <Receipt size={24} />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Recent Expenses List */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">Recent Activity</h2>
          <button onClick={() => router.push('/dashboard/expense')} className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 cursor-pointer">
            View all <ArrowRight size={16} />
          </button>
        </div>
        
        {expenses.length === 0 ? (
          <div className="p-10 text-center">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
              <Receipt size={32} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">No expenses yet</h3>
            <p className="text-gray-500 max-w-sm mx-auto">You haven't been added to any expenses yet. Create one to get started!</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {expenses.slice(0, 5).map((expense, index) => (
              <motion.li 
                key={expense._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="px-6 py-5 hover:bg-gray-50 transition-colors cursor-pointer"
                onClick={() => router.push(`/dashboard/expense/${expense._id}`)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${expense.isSettled ? 'bg-emerald-100 text-emerald-600' : 'bg-indigo-100 text-indigo-600'}`}>
                      {expense.isSettled ? <CheckCircle2 size={20} /> : <Clock size={20} />}
                    </div>
                    <div>
                      <h4 className="text-base font-semibold text-gray-900">{expense.eventName}</h4>
                      <p className="text-sm text-gray-500 capitalize">{expense.splitType} split • {expense.participants.length} people</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-base font-bold text-gray-900">₹{(expense.totalAmount / 100).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                    <p className={`text-xs font-medium px-2 py-1 rounded-full inline-block mt-1 ${expense.isSettled ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'}`}>
                      {expense.isSettled ? 'Settled' : 'Pending'}
                    </p>
                  </div>
                </div>
              </motion.li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
