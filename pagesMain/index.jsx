'use client'

import { useState } from 'react'
import { Dialog, DialogPanel } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import Button from '@/components/ui//Button1';
import Image from 'next/image'
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import SplitText from "@/components/SplitText";
import StarBorder from "@/components/StarBorder";
import { motion } from 'framer-motion';

const navigation = [
    { name: 'Home', href: '#home' },
    { name: 'Features', href: '#features' },
    { name: 'How it works', href: '#how-it-works' },
    { name: 'Who can use', href: '#who-can-use' },
];

export default function Home() {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const handleAnimationComplete = () => {
        console.log('All letters have animated!');
    };

    const router = useRouter();
    const { data: session } = useSession();

    const scrollToSection = (e, href) => {
        e.preventDefault();
        const element = document.querySelector(href);
        if (element) {
            const offset = 80;
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.scrollY - offset;
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    };

    return (
        <div className="relative min-h-screen bg-[#FAFAFA] overflow-hidden text-zinc-900 selection:bg-indigo-100" id="home">
            {/* Sticky Navbar */}
            <header className="fixed inset-x-0 top-0 z-50 bg-white/70 backdrop-blur-md border-b border-zinc-200/50">
                <nav className="flex items-center justify-between p-6 max-w-7xl mx-auto lg:px-8" aria-label="Global">
                    <div className="flex lg:flex-1">
                        <a href="#home" onClick={(e) => scrollToSection(e, '#home')} className="-m-1.5 p-1.5 flex items-center gap-2">
                            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600">
                                <span className="h-2 w-2 rounded-full bg-white"></span>
                            </span>
                            <span className="font-extrabold text-xl tracking-tight text-zinc-900">BillBuddy</span>
                        </a>
                    </div>
                    <div className="hidden lg:flex lg:gap-x-10">
                        {navigation.map((item) => (
                            <a
                                key={item.name}
                                href={item.href}
                                onClick={(e) => scrollToSection(e, item.href)}
                                className="text-sm font-semibold leading-6 text-zinc-600 hover:text-indigo-600 transition-colors cursor-pointer"
                            >
                                {item.name}
                            </a>
                        ))}
                    </div>
                    <div className="flex flex-1 justify-end relative">
                        {session?.user ? (
                            <div className="relative">
                                <button
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    className="flex items-center gap-2 text-sm font-semibold leading-6 text-zinc-900 hover:bg-zinc-900/5 px-4 py-2 rounded-full transition-colors"
                                >
                                    <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-sm uppercase shadow-sm">
                                        {session.user.email[0]}
                                    </div>
                                    <span className="hidden sm:inline-block truncate max-w-[150px]">{session.user.email}</span>
                                    <svg className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                </button>
                                
                                {isDropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-48 rounded-xl bg-white shadow-xl ring-1 ring-black ring-opacity-5 z-[100] overflow-hidden border border-zinc-100">
                                        <div className="py-1">
                                            <button
                                                onClick={() => router.push('/dashboard')}
                                                className="w-full text-left px-4 py-2.5 text-sm text-zinc-700 hover:bg-indigo-50 hover:text-indigo-600 font-medium transition-colors"
                                            >
                                                Dashboard
                                            </button>
                                            <div className="border-t border-zinc-100 my-1"></div>
                                            <button
                                                onClick={() => signOut({ callbackUrl: '/' })}
                                                className="w-full text-left px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50 font-medium transition-colors"
                                            >
                                                Sign out
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <button
                                onClick={() => router.push('/signin')}
                                className="text-sm font-semibold leading-6 text-zinc-900 hover:text-indigo-600 transition-colors bg-zinc-900/5 px-4 py-2 rounded-full cursor-pointer"
                            >
                                Log in <span aria-hidden="true">&rarr;</span>
                            </button>
                        )}
                    </div>
                </nav>
            </header>

            {/* Animated Light Background Elements */}
            <motion.div
                animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.4, 0.6, 0.4],
                }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] md:w-[900px] md:h-[900px] bg-indigo-100 rounded-full blur-[100px] mix-blend-multiply pointer-events-none"
            />
            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.5, 0.3],
                }}
                transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] md:w-[700px] md:h-[700px] bg-rose-50 rounded-full blur-[120px] mix-blend-multiply pointer-events-none"
            />
            <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] pointer-events-none mix-blend-overlay"></div>

            <div className="relative isolate px-6 pt-20 lg:px-8 z-10 flex min-h-screen flex-col items-center justify-center">

                <div className='flex flex-wrap flex-col-reverse lg:flex-row mt-10 md:mt-0 items-center justify-center w-full max-w-7xl mx-auto gap-16 lg:gap-12'>

                    {/* Text Section */}
                    <div className="w-full lg:w-1/2 py-10 md:py-32 text-center lg:text-left flex flex-col items-center lg:items-start z-10">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-zinc-900/5 border border-zinc-900/10 backdrop-blur-md mb-8"
                        >
                            <span className="flex h-2 w-2 rounded-full bg-indigo-500 animate-pulse"></span>
                            <span className="text-sm font-bold tracking-wider text-zinc-600 uppercase">The New Standard</span>
                        </motion.div>

                        <div className="max-w-3xl">
                            <motion.h1
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, ease: "easeOut" }}
                                className="text-6xl sm:text-7xl lg:text-[5.5rem] font-black tracking-tighter leading-[1.05] text-transparent bg-clip-text bg-gradient-to-br from-zinc-900 via-indigo-900 to-indigo-500 pb-2"
                            >
                                Splitting bills has never looked so <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-indigo-500">beautiful.</span>
                            </motion.h1>

                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
                                className="mt-8 text-xl md:text-2xl font-medium text-zinc-500 max-w-xl mx-auto lg:mx-0 leading-relaxed"
                            >
                                Track borrowings, splits, and repayments effortlessly with a beautifully smooth and intuitive platform.
                            </motion.p>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.7, ease: "easeOut" }}
                                className="mt-12 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
                            >
                                <div className="group relative w-full sm:w-auto">
                                    <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-indigo-500 to-rose-400 opacity-20 blur transition duration-500 group-hover:opacity-40"></div>
                                    <StarBorder
                                        as="button"
                                        thickness={2}
                                        className="relative bg-zinc-900 border border-zinc-800 hover:bg-black text-white font-semibold py-4 px-10 rounded-full transition-all duration-300 w-full sm:w-auto text-lg cursor-pointer shadow-xl shadow-zinc-900/10"
                                        color="rgba(99, 102, 241, 0.8)"
                                        speed="4s"
                                        click={() => {
                                            if (session?.user) {
                                                router.push('/dashboard')
                                            }
                                            else {
                                                router.push('/signin')
                                            }
                                        }}
                                    >
                                        Get Started For Free
                                    </StarBorder>
                                </div>
                                <button 
                                    onClick={(e) => scrollToSection(e, '#how-it-works')}
                                    className="text-zinc-500 font-semibold text-lg hover:text-zinc-900 transition-colors py-4 px-6 rounded-full hover:bg-zinc-900/5 hidden sm:block"
                                >
                                    See how it works &rarr;
                                </button>
                            </motion.div>
                        </div>
                    </div>

                    {/* Image Section / Mock UI */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1.2, ease: "easeOut", delay: 0.4 }}
                        className="w-full lg:w-[45%] flex justify-center relative mt-16 lg:mt-0"
                    >
                        {/* Soft Glow behind mock UI */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4/5 h-4/5 bg-gradient-to-tr from-indigo-300 to-rose-200 blur-[100px] rounded-full pointer-events-none opacity-60"></div>

                        {/* Floating Element 1: Money back */}
                        <motion.div 
                            animate={{ y: [-10, 10, -10], rotate: [0, 5, 0] }}
                            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute -top-6 -right-6 md:-right-12 z-20 bg-white/80 backdrop-blur-xl border border-white/60 shadow-xl rounded-2xl p-4 flex items-center gap-3 hidden sm:flex"
                        >
                            <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center font-bold">
                                ₹
                            </div>
                            <div>
                                <p className="text-xs font-bold text-gray-500">You get back</p>
                                <p className="text-lg font-black text-gray-900">₹450.00</p>
                            </div>
                        </motion.div>

                        {/* Floating Element 2: Avatars */}
                        <motion.div 
                            animate={{ y: [10, -10, 10], rotate: [0, -5, 0] }}
                            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                            className="absolute -bottom-10 -left-6 md:-left-12 z-20 bg-white/80 backdrop-blur-xl border border-white/60 shadow-xl rounded-2xl p-4 flex items-center gap-3 hidden sm:flex"
                        >
                            <div className="flex -space-x-3">
                                <div className="w-10 h-10 rounded-full border-2 border-white bg-indigo-100 flex items-center justify-center font-bold text-indigo-600 text-xs">AM</div>
                                <div className="w-10 h-10 rounded-full border-2 border-white bg-rose-100 flex items-center justify-center font-bold text-rose-600 text-xs">RK</div>
                                <div className="w-10 h-10 rounded-full border-2 border-white bg-sky-100 flex items-center justify-center font-bold text-sky-600 text-xs">SJ</div>
                            </div>
                            <div>
                                <p className="text-sm font-black text-gray-900">Dinner split</p>
                                <p className="text-xs font-bold text-gray-500">Settled up!</p>
                            </div>
                        </motion.div>

                        {/* Main Mock UI Card */}
                        <motion.div
                            animate={{ y: [0, -20, 0] }}
                            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                            className="relative z-10 w-full max-w-[360px] md:max-w-md bg-white/60 backdrop-blur-3xl border border-white/60 shadow-[0_40px_80px_rgba(0,0,0,0.1)] rounded-[2.5rem] p-6 overflow-hidden"
                        >
                            {/* Inner glass highlight */}
                            <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-white/10 pointer-events-none rounded-[2.5rem]"></div>
                            
                            {/* Card Content */}
                            <div className="relative z-10">
                                <div className="flex justify-between items-center mb-8">
                                    <div>
                                        <p className="text-sm font-bold text-gray-500">Total Balance</p>
                                        <h2 className="text-4xl font-black text-gray-900 mt-1">₹1,250<span className="text-gray-400">.00</span></h2>
                                    </div>
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-indigo-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/30 text-white">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    {[
                                        { name: 'Weekend Trip', amount: '₹850', color: 'indigo', icon: '🚗', amountColor: 'text-indigo-600' },
                                        { name: 'Movie Night', amount: '₹200', color: 'rose', icon: '🍿', amountColor: 'text-rose-600' },
                                        { name: 'Groceries', amount: '₹200', color: 'emerald', icon: '🛒', amountColor: 'text-emerald-600' },
                                    ].map((item, i) => (
                                        <div key={i} className="bg-white/80 backdrop-blur-md rounded-2xl p-4 flex items-center justify-between border border-white/50 shadow-sm transition-transform hover:scale-[1.02] cursor-pointer">
                                            <div className="flex items-center gap-4">
                                                <div className={`w-12 h-12 rounded-xl bg-${item.color}-50 flex items-center justify-center text-xl`}>
                                                    {item.icon}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-900">{item.name}</p>
                                                    <p className="text-xs font-semibold text-gray-500">You owe</p>
                                                </div>
                                            </div>
                                            <p className={`font-black text-lg ${item.amountColor}`}>{item.amount}</p>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-8 pt-6 border-t border-gray-200/50">
                                    <button className="w-full py-4 bg-gray-900 text-white rounded-2xl font-bold text-lg hover:bg-black transition-colors shadow-xl shadow-gray-900/20">
                                        Settle All Balances
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>

                </div>
            </div>
        </div>
    )
}
