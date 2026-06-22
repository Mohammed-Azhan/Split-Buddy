'use client';

import React from 'react'
import { motion } from 'framer-motion'
import { Users, Receipt, Activity, CheckCircle2 } from 'lucide-react'

const steps = [
    {
        id: 1,
        title: "Create a Group",
        description: "Start by creating a group for trips, roommates, or add a one-time expense.",
        icon: <Users className="w-6 h-6 text-indigo-600" />
    },
    {
        id: 2,
        title: "Add Friends",
        description: "Add participants and define who paid and how the expense should be split.",
        icon: <Receipt className="w-6 h-6 text-rose-500" />
    },
    {
        id: 3,
        title: "Track Balances",
        description: "Split Buddy instantly calculates who owes whom and keeps balances updated.",
        icon: <Activity className="w-6 h-6 text-amber-500" />
    },
    {
        id: 4,
        title: "Settle Up",
        description: "Mark expenses as settled and maintain a clean, stress-free record.",
        icon: <CheckCircle2 className="w-6 h-6 text-emerald-500" />
    }
]

const containerVariants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.2
        }
    }
}

const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
        opacity: 1, 
        y: 0,
        transition: { duration: 0.8, ease: "easeOut" }
    }
}

const Working = () => {
    return (
        <section className="py-24 sm:py-32 bg-[#FAFAFA] relative overflow-hidden">
            {/* Very subtle background blob */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-50/50 rounded-full blur-[100px] pointer-events-none mix-blend-multiply"></div>
            
            <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
                <div className="mx-auto max-w-2xl text-center">
                    <motion.h2 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="text-sm font-bold text-indigo-600 uppercase tracking-widest"
                    >
                        How it works
                    </motion.h2>
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
                        className="mt-4 text-4xl font-extrabold tracking-tight text-zinc-900 sm:text-5xl"
                    >
                        Split expenses in four easy steps
                    </motion.p>
                </div>

                <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none"
                >
                    <div className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-4">
                        {steps.map((step) => (
                            <motion.div key={step.id} variants={itemVariants} className="flex flex-col relative group">
                                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-xl shadow-zinc-200/50 ring-1 ring-zinc-100 transition-transform duration-300 group-hover:-translate-y-2">
                                    {step.icon}
                                </div>
                                <div className="flex-auto">
                                    <h3 className="text-xl font-bold text-zinc-900">
                                        {step.id}. {step.title}
                                    </h3>
                                    <p className="mt-3 text-base/7 text-zinc-600 font-medium">
                                        {step.description}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    )
}

export default Working
