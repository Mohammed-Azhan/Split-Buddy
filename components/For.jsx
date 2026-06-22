'use client';

import React from 'react'
import { motion } from 'framer-motion'
import { Users, Tent, GraduationCap, PartyPopper } from 'lucide-react'

const For = () => {
    const items = [
        {
            id: 1,
            heading: "Friends & Roommates",
            description: "Split rent, groceries, utilities, and daily shared expenses without arguments. Everyone knows who paid, who owes, and what’s settled.",
            icon: <Users className="w-8 h-8 text-indigo-600" />,
            bgColor: "bg-indigo-50",
            ringColor: "ring-indigo-100"
        },
        {
            id: 2,
            heading: "Trips & Travel Groups",
            description: "Track shared expenses during trips like transport, food, stays, and activities. No need to calculate everything at the end.",
            icon: <Tent className="w-8 h-8 text-emerald-600" />,
            bgColor: "bg-emerald-50",
            ringColor: "ring-emerald-100"
        },
        {
            id: 3,
            heading: "College Students",
            description: "Perfect for hostel life, mess bills, group outings, and shared subscriptions. Manage expenses easily with friends.",
            icon: <GraduationCap className="w-8 h-8 text-rose-600" />,
            bgColor: "bg-rose-50",
            ringColor: "ring-rose-100"
        },
        {
            id: 4,
            heading: "Everyday Shared Spending",
            description: "From parties to events to casual group plans, Split Buddy helps you split costs fairly and keeps records so nothing is forgotten.",
            icon: <PartyPopper className="w-8 h-8 text-amber-600" />,
            bgColor: "bg-amber-50",
            ringColor: "ring-amber-100"
        }
    ]

    const containerVariants = {
        hidden: {},
        visible: {
            transition: { staggerChildren: 0.15 }
        }
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 40 },
        visible: { 
            opacity: 1, 
            y: 0,
            transition: { duration: 0.7, ease: "easeOut" }
        }
    }

    return (
        <section className='py-24 sm:py-32 bg-white relative overflow-hidden'>
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-2xl lg:text-center">
                    <motion.h2 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="text-sm font-bold text-indigo-600 uppercase tracking-widest"
                    >
                        Who can use it
                    </motion.h2>
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
                        className="mt-4 text-4xl font-extrabold tracking-tight text-zinc-900 sm:text-5xl"
                    >
                        Built for any group, any size
                    </motion.p>
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                        className="mt-6 text-lg/8 text-zinc-600 font-medium"
                    >
                        Whether you're living with roommates or traveling across the globe, managing shared costs has never been simpler.
                    </motion.p>
                </div>

                <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none"
                >
                    <div className="grid max-w-xl grid-cols-1 gap-8 lg:max-w-none lg:grid-cols-2">
                        {items.map((item) => (
                            <motion.div 
                                key={item.id} 
                                variants={itemVariants} 
                                className="flex flex-col sm:flex-row gap-6 rounded-3xl bg-[#FAFAFA] p-8 ring-1 ring-zinc-200/50 hover:shadow-xl hover:shadow-zinc-200/40 transition-all duration-300 hover:-translate-y-1 group"
                            >
                                <div className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl ${item.bgColor} ring-1 ${item.ringColor} shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                                    {item.icon}
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-zinc-900 leading-8">
                                        {item.heading}
                                    </h3>
                                    <p className="mt-2 text-base/7 text-zinc-600 font-medium">
                                        {item.description}
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

export default For
