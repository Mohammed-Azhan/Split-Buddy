'use client'

import { useState } from 'react'
import { Dialog, DialogPanel } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import Button from '@/components/ui//Button1';
import Image from 'next/image'
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import SplitText from "@/components/SplitText";
import StarBorder from "@/components/StarBorder";

const navigation = [
    { name: 'Product', href: '#' },
    { name: 'Features', href: '#' },
    { name: 'Marketplace', href: '#' },
    { name: 'Company', href: '#' },
]

export default function Home() {
    const handleStackComplete = () => {
        console.log('Scroll stack animation is complete!');
    };


    const handleAnimationComplete = () => {
        console.log('All letters have animated!');
    };
    const router = useRouter();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const { data: session } = useSession();
    const handleClick = () => {
        if (session) {
            return router.push('/dashboard');
        }
        return router.push('/signup');
    }
    return (
        <div className="bg-gray-50">
            <div className="relative p-3 isolate md:px-6 pt-14 lg:px-8">

                <div className='flex flex-wrap flex-col-reverse mt-28 items-center justify-center md:px-8'>
                    <div className="md:mx-auto py-32 w-full md:max-w-6xl text-center">
                        <div className="">
                            <SplitText
                                text=" Manage Shared Expenses Without Confusion!"
                                className="text-5xl font-semibold text-pretty leading-[70px] sm:leading-[90px] text-gray-900 sm:text-7xl"
                                delay={100}
                                duration={0.6}
                                ease="power3.out"
                                splitType="chars"
                                from={{ opacity: 0, y: 40 }}
                                to={{ opacity: 1, y: 0 }}
                                threshold={0.1}
                                rootMargin="-100px"
                                onLetterAnimationComplete={handleAnimationComplete}
                            />


                            <p className="mt-8 text-lg font-medium text-pretty text-gray-700 sm:text-xl/8">
                                Track borrowings, splits, and repayments effortlessly <br /> with a smooth and intuitive money-management platform.
                            </p>
                            <div className="mt-10">
                                <StarBorder
                                    as="button"
                                    thickness={2.4}
                                    className="bg-indigo-500 cursor-pointer hover:bg-indigo-300 text-white font-bold"
                                    color="red"
                                    speed="4s"
                                    click={() => {
                                        if(session?.user){
                                            router.push('/dashboard')
                                        }
                                        else{
                                            router.push('/signin')
                                        }
                                    }}
                                >
                                    Get Started
                                </StarBorder>
                            </div>
                        </div>
                    </div>

                    <div className="col-2">
                        <Image src='/hero.svg' height={'100'} width={'100'} className='w-full' alt='Hero'></Image>
                    </div>

                </div>
              
            </div>

        </div>
    )
}
