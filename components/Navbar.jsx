'use client';
import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import Button1 from './ui/Button1';
import { signOut } from 'next-auth/react';
import { useEffect } from 'react'
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { redirect } from 'next/navigation';
import { toast } from 'react-toastify';
const navigation = [
    { name: 'Home', href: '/', current: true },
    { name: 'Features', href: '#features', current: false },
    { name: 'How it works', href: '#how-it-works', current: false },
    { name: 'Who can use', href: '#who-can-use', current: false },
    { name: 'Contact', href: '#contact', current: false },
]

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}


export default function Navbar() {
    const { data: session } = useSession();
    const logout = async () => {
        signOut()
    }

    const reDirect = () => {
        return redirect('/signin');
    }
    const hideNav = ['/', '/signin', '/signup', '/api/auth/error'];
    const path = usePathname();
    if (hideNav.includes(path) || path.startsWith('/dashboard')) {
        return null;
    }


    return (
        <Disclosure
            as="nav"
            className="fixed w-full p-1 z-[999] bg-gray-50 after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0"
        >
            <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
                <div className="relative flex h-16 items-center justify-between">
                    <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                        {/* Mobile menu button*/}
                        <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-white/5 hover:text-white focus:outline-2 focus:-outline-offset-1 focus:outline-indigo-500">
                            <span className="absolute -inset-0.5" />
                            <span className="sr-only">Open main menu</span>
                            <Bars3Icon aria-hidden="true" className="block size-6 group-data-open:hidden" />
                            <XMarkIcon aria-hidden="true" className="hidden size-6 group-data-open:block" />
                        </DisclosureButton>
                    </div>
                    <div className="flex flex-1 items-center justify-between">
                        <div className="flex gap-2 shrink-0 mr-8 items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.8" stroke="currentColor" className="size-8 text-amber-500">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
                            </svg>

                            <Link href={'/'} className='font-bold text-3xl text-gray-700'>SPLIT <span className='text-indigo-600'>BUDDY</span></Link>

                        </div>
                        <div className="hidden sm:block">
                            <div className="flex space-x-4">
                                {navigation.map((item) => (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        // aria-current={item.current ? 'page' : undefined}
                                        className={classNames(
                                            'text-gray-900 hover:bg-white/5 hover:text-indigo-400',
                                            'rounded-md px-3 py-1 text-md font-semibold',
                                        )}
                                    >
                                        {item.name}
                                    </Link>
                                ))}
                            </div>
                        </div>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">


                            {/* Profile dropdown */}
                            {session?.user ? <Menu as="div" className="relative ml-3">
                                <MenuButton className="relative flex rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500">
                                    <span className="absolute -inset-1.5" />
                                    <span className="sr-only">Open user menu</span>
                                    <Image
                                        alt=""
                                        height={8}
                                        width={8}
                                        src={session?.user?.image || 'https://img.icons8.com/?size=100&id=z-JBA_KtSkxG&format=png&color=000000'}
                                        className="size-8 rounded-full bg-gray-800 outline outline-offset-2 outline-teal-900"
                                    />
                                </MenuButton>

                                <MenuItems
                                    transition
                                    className="absolute right-0 z-10 mt-2 w-48 px-2 origin-top-right rounded-md bg-white shadow-lg py-1 outline outline-offset-1 outline-teal-500 transition data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
                                >

                                    <MenuItem>
                                        <h1
                                            className="block px-4 py-2 text-sm text-gray-900 data-focus:bg-white/5 data-focus:outline-hidden"
                                        >
                                            Welcome, {session?.user?.username}
                                        </h1>
                                    </MenuItem>

                                    <MenuItem>
                                        <a
                                            href="#"
                                            className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-white/5 data-focus:outline-hidden"
                                        >
                                            Your profile
                                        </a>
                                    </MenuItem>
                                    <MenuItem>
                                        <a
                                            href="#"
                                            className="block px-4 py-4 text-sm text-gray-700 data-focus:bg-white/5 data-focus:outline-hidden"
                                        >
                                            Settings
                                        </a>
                                    </MenuItem>
                                    <MenuItem>
                                        <button
                                            onClick={logout}
                                            className="block px-4 py-2 w-full cursor-pointer my-1 text-sm text-white hover:bg-red-500 rounded-md font-medium bg-red-400"
                                        >
                                            Sign out
                                        </button>
                                    </MenuItem>
                                </MenuItems>
                            </Menu> : <Button1
                                value={"SignUp"} method={reDirect}
                            >
                                SignUp

                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
                                </svg>


                            </Button1>}
                        </div>
                    </div>

                </div>
            </div>

            <DisclosurePanel className="sm:hidden">
                <div className="space-y-1 px-2 pt-2 pb-3">
                    {navigation.map((item) => (
                        <DisclosureButton
                            key={item.name}
                            as="a"
                            href={item.href}
                            aria-current={item.current ? 'page' : undefined}
                            className={classNames(
                                item.current ? 'bg-gray-950/50 text-white' : 'text-gray-300 hover:bg-white/5 hover:text-white',
                                'block rounded-md px-3 py-2 text-base font-medium',
                            )}
                        >
                            {item.name}
                        </DisclosureButton>
                    ))}
                </div>
            </DisclosurePanel>
        </Disclosure>
    )
}
