'use client';

import React, { useEffect, useState } from 'react';
import { useSession, signOut } from "next-auth/react";
import { motion, AnimatePresence } from 'framer-motion';
import { 
    User, Mail, Phone, Calendar, LogOut, Settings, Bell, 
    Shield, Key, Receipt, Users, Camera, Edit2, X
} from "lucide-react";
import { toast } from 'sonner';
import axios from "axios";

export default function ProfilePage() {
    const { data: session } = useSession();
    const [stats, setStats] = useState({ expenses: 0, friends: 0 });
    const [loading, setLoading] = useState(true);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [newPassword, setNewPassword] = useState("");

    useEffect(() => {
        if (!session?.user?.id) return;
        
        const fetchStats = async () => {
            try {
                const [expRes, friendsRes] = await Promise.all([
                    axios.get(`/api/split/expense/getExpense?userId=${session.user.id}`),
                    axios.get(`/api/split/friends`)
                ]);
                
                setStats({
                    expenses: expRes.data.expenses?.length || 0,
                    friends: friendsRes.data.friends?.length || 0
                });
            } catch (err) {
                console.error("Failed to fetch profile stats");
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, [session]);

    if (!session) return null;

    const user = session.user;

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
    };

    const handleChangePassword = () => {
        setShowPasswordModal(true);
    };

    const submitNewPassword = async () => {
        if (!newPassword || newPassword.length < 6) {
            return toast.warning("Password must be at least 6 characters");
        }
        try {
            const res = await axios.post('/api/auth/updatePassword', { email: user.email, newPassword });
            if (res.data.status) {
                toast.success(res.data.message);
                setShowPasswordModal(false);
                setNewPassword("");
            } else {
                toast.error(res.data.message);
            }
        } catch (err) {
            toast.error("An error occurred while updating the password");
        }
    };


    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-20 md:mt-24 mb-24 min-h-screen">
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-8"
            >
                {/* Profile Header Card */}
                <motion.div variants={itemVariants} className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden relative">
                    {/* Cover Photo Gradient */}
                    <div className="h-48 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 w-full relative">
                        <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
                        <button className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white p-2 rounded-xl transition-colors">
                            <Camera className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="px-8 pb-8 relative">
                        {/* Avatar */}
                        <div className="absolute -top-16 left-8">
                            <div className="w-32 h-32 bg-white rounded-full p-2 shadow-xl">
                                <div className="w-full h-full bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center border border-gray-100 relative overflow-hidden">
                                    <span className="text-5xl font-black text-indigo-600">
                                        {user.username?.[0]?.toUpperCase() || user.name?.[0]?.toUpperCase() || "U"}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pt-20">
                            <div>
                                <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-3">
                                    {user.name || user.username}
                                </h1>
                                <p className="text-lg font-medium text-gray-500">@{user.username}</p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    
                    {/* Left Column (Stats & Details) */}
                    <div className="md:col-span-1 space-y-8">
                        {/* Stats Card */}
                        <motion.div variants={itemVariants} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                            <h3 className="text-lg font-bold text-gray-900 mb-6">Overview</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-indigo-50/50 rounded-2xl p-4 border border-indigo-100/50">
                                    <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center mb-3">
                                        <Receipt className="w-5 h-5" />
                                    </div>
                                    <p className="text-2xl font-black text-gray-900">{loading ? "-" : stats.expenses}</p>
                                    <p className="text-sm font-semibold text-gray-500">Expenses</p>
                                </div>
                                <div className="bg-sky-50/50 rounded-2xl p-4 border border-sky-100/50">
                                    <div className="w-10 h-10 bg-sky-100 text-sky-600 rounded-xl flex items-center justify-center mb-3">
                                        <Users className="w-5 h-5" />
                                    </div>
                                    <p className="text-2xl font-black text-gray-900">{loading ? "-" : stats.friends}</p>
                                    <p className="text-sm font-semibold text-gray-500">Friends</p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Personal Details */}
                        <motion.div variants={itemVariants} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                            <h3 className="text-lg font-bold text-gray-900 mb-6">Personal Info</h3>
                            <div className="space-y-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400">
                                        <Mail className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-gray-400">Email Address</p>
                                        <p className="font-bold text-gray-900">{user.email || "Not provided"}</p>
                                    </div>
                                </div>

                            </div>
                        </motion.div>
                    </div>

                    {/* Right Column (Settings) */}
                    <div className="md:col-span-1 space-y-8">
                        <motion.div variants={itemVariants} className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100">
                            <h3 className="text-xl font-bold text-gray-900 mb-6">Account Settings</h3>
                            
                            <div className="space-y-6">


                                {/* Setting Item 3 */}
                                <div className="flex items-center justify-between p-4 bg-gray-50/50 rounded-2xl border border-gray-100 hover:bg-gray-50 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-amber-500 shadow-sm border border-gray-100">
                                            <Key className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-900">Change Password</p>
                                            <p className="text-sm font-medium text-gray-500">Update your account credentials</p>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={handleChangePassword}
                                        className="px-4 py-2 bg-white text-gray-700 font-bold text-sm rounded-xl border border-gray-200 shadow-sm hover:bg-gray-50 transition-colors"
                                    >
                                        Update
                                    </button>
                                </div>
                            </div>
                        </motion.div>

                        {/* Danger Zone */}
                        <motion.div variants={itemVariants} className="bg-rose-50 rounded-3xl p-6 shadow-sm border border-rose-100 flex flex-col xl:flex-row items-start xl:items-center justify-between gap-6">
                            <div>
                                <h3 className="text-lg font-bold text-rose-900">Sign Out</h3>
                                <p className="text-sm font-medium text-rose-700/70 mt-1">Ready to leave? You will need to log back in.</p>
                            </div>
                            <button 
                                onClick={() => signOut({ callbackUrl: "/" })}
                                className="bg-rose-600 hover:bg-rose-700 text-white px-6 py-3 w-full xl:w-auto rounded-xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-rose-200 shrink-0"
                            >
                                <LogOut className="w-5 h-5" />
                                Sign out
                            </button>
                        </motion.div>
                    </div>

                </div>
            </motion.div>

            {/* Direct Password Update Modal */}
            <AnimatePresence>
                {showPasswordModal && (
                    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                            onClick={() => setShowPasswordModal(false)}
                        />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-white w-full max-w-md rounded-[2rem] shadow-2xl relative z-10 overflow-hidden"
                        >
                            <div className="bg-gray-50 px-6 py-5 border-b border-gray-100 flex items-center justify-between">
                                <h2 className="text-xl font-bold text-gray-900">Change Password</h2>
                                <button onClick={() => setShowPasswordModal(false)} className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200/50 text-gray-500 hover:bg-gray-200 hover:text-gray-900 transition-colors">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="p-6">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">New Password</label>
                                <input 
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="Enter new password"
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 transition-all outline-none"
                                />
                                <button 
                                    onClick={submitNewPassword}
                                    className="w-full mt-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/20 transition-all active:scale-[0.98]"
                                >
                                    Update Password
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
