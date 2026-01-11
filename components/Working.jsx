import React from 'react'
import DotGrid from "@/components/DotGrid";
import Carousel from "@/components/Carousel"
import { Check, Tally1, Tally2, Tally3, Tally4 } from 'lucide-react';
const Working = () => {
    return (
        <div className='flex flex-col xl:flex-row'>
            <div className='xl:w-[50%] w-auto bg-indigo-500' style={{ position: 'relative' }}>
                <DotGrid
                    dotSize={6}
                    gap={15}
                    baseColor="#5227FF"
                    activeColor="#5227FF"
                    proximity={100}
                    shockRadius={250}
                    shockStrength={5}
                    resistance={750}
                    returnDuration={1.5}
                >
                </DotGrid>
            </div>
            <div className='xl:w-[50%] mt-[40px] mb-[40px] flex items-center justify-center'>
                <div className='xl:w-[60%] xl:h-[100vh] flex items-center justify-center'>
                    <div className='w-full' style={{ position: 'relative' }}>
                        <Carousel
                            baseWidth={300}
                            autoplay={true}
                            autoplayDelay={3000}
                            pauseOnHover={true}
                            loop={true}
                            items={[
                                {
                                    id : 1,
                                    title : `Create a Group or Expense`,
                                    description : "Start by creating a group for trips, roommates, or add a one-time expense.",
                                    icon : <Tally1 />
                                },
                                  {
                                    id : 2,
                                    title : "Add Friends & Amounts",
                                    description : "Add participants and define who paid and how the expense should be split.",
                                    icon : <Tally2 />
                                },
                                  {
                                    id : 3,
                                    title : "Track Balances Automatically",
                                    description : "Split Buddy instantly calculates who owes whom and keeps balances updated.",
                                    icon : <Tally3 />
                                },
                                  {
                                    id : 4,
                                    title : "Settle & Stay Organized",
                                    description : "Mark expenses as settled and maintain a clean, stress-free record.",
                                    icon : <Tally4 />
                                }
                            ]}
                            round={false}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Working
