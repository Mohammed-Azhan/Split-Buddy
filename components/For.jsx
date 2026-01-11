import React from 'react'
import Cubes from '@/components/Cubes'
import { Check } from 'lucide-react'
const For = () => {

    const items = [
        {
            id: 1,
            heading: "Friends & Roommates",
            description:
                "Split rent, groceries, utilities, and daily shared expenses without arguments. Everyone knows who paid, who owes, and what’s settled — all in one place."
        },
        {
            id: 2,
            heading: "Trips & Travel Groups",
            description:
                "Track shared expenses during trips like transport, food, stays, and activities. No need to calculate everything at the end — Split Buddy keeps it clear from the start."
        },
        {
            id: 3,
            heading: "College Students",
            description:
                "Perfect for hostel life, mess bills, group outings, and shared subscriptions. Manage expenses easily with friends and avoid awkward money conversations."
        },
        {
            id: 4,
            heading: "Everyday Shared Spending",
            description:
                "From parties to events to casual group plans, Split Buddy helps you split costs fairly and keeps records so nothing is forgotten."
        }
    ]


    return (
        <div className='w-full flex-col flex xl:flex-row-reverse'>
            <div className="left xl:w-[50%] bg- p-4 flex items-center justify-center">
                <Cubes
                    gridSize={8}
                    maxAngle={60}
                    radius={4}
                    borderStyle="2px dashed #ff6b6b"
                    faceColor="#5227FF"
                    rippleColor="#ff6b6b"
                    rippleSpeed={1.5}
                    autoAnimate={true}
                    rippleOnClick={true}
                />
            </div>
            <div className="right xl:w-[50%] xl:p-24 flex items-center justify-center">
                <div className='flex flex-col flex-wrap gap-8 p-4 xl:p-4'>
                    {items.map((elem, index) => {
                        return (
                            <div className='flex items-center gap-6' key={index}>
                                <div className="icon">
                                    <Check className='bg-indigo-500 text-white rounded-full' size={30}></Check>
                                </div>
                                <div className=''>
                                    <h1 className={`text-5xl leading-[70px] font-semibold ${index%2 == 0 ? 'text-indigo-600' : 'text-black'}`}>{elem.heading}</h1>
                                    <p className='text-xl mt-4 text-gray-700 leading-[50px]'>{elem.description}</p>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default For
