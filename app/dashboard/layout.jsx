'use client';
import { useState } from 'react';
import { Menu, X, Home, PersonStanding ,LogOut, Settings, ChartColumnDecreasing, UserRound, CurrencyIcon, User, Users, Bell, Currency } from 'lucide-react';
import StarBorder from '../../components/StarBorder';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { signOut } from 'next-auth/react';
import Image from 'next/image';
import { toast } from 'react-toastify';
import Dock from '@/components/Dock';
import { useRouter } from "next/navigation";


export default function Layout({ children }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();
const menuItems = [
  { icon: <Home color='white'></Home>, label: 'Home', onClick: () => router.push('/dashboard') },
  { icon: <PersonStanding color='white'></PersonStanding>, label: 'Your friends', onClick: () => router.push('/dashboard/friends') },
  { icon: <CurrencyIcon color='white'></CurrencyIcon>, label: 'Expenses', onClick: () => router.push('/dashboard/expense') },
  { icon: <UserRound color='white'></UserRound>, label: 'Profile', onClick: () => router.push('/dashboard/profile') },
  { icon: <ChartColumnDecreasing color='white'></ChartColumnDecreasing>, label: 'Analyze report', onClick: () => router.push('/dashboard/analyze') },
];

  const handleLogout = async () => {
    try {
      await signOut({ redirect: true, callbackUrl: '/signin' });
      toast.success('Logged out successfully');
    } catch (error) {
      toast.error('Error logging out');
    }
    setIsMenuOpen(false);
  };

  return (
    <>
      <nav className="bg-white/70 backdrop-blur-md border-b border-zinc-200/50 fixed z-[999] w-full top-0 left-0">
        <div className="w-full md:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600">
                  <span className="h-2 w-2 rounded-full bg-white"></span>
              </span>
              <span className="text-gray-800 font-extrabold text-xl tracking-tight uppercase">Split Buddy</span>
            </Link>

            {/* Right Section - Dropdown */}
            <div className="flex flex-1 justify-end relative">
                {session?.user && (
                    <div className="relative">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="flex items-center gap-2 text-sm font-semibold leading-6 text-zinc-900 hover:bg-zinc-900/5 px-4 py-2 rounded-full transition-colors"
                        >
                            <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-sm uppercase shadow-sm">
                                {session.user.email[0]}
                            </div>
                            <span className="hidden sm:inline-block truncate max-w-[150px]">{session.user.email}</span>
                            <svg className={`w-4 h-4 transition-transform ${isMenuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                        </button>
                        
                        {isMenuOpen && (
                            <div className="absolute right-0 mt-2 w-48 rounded-xl bg-white shadow-xl ring-1 ring-black ring-opacity-5 z-[100] overflow-hidden border border-zinc-100">
                                <div className="py-1">
                                    <button
                                        onClick={() => { setIsMenuOpen(false); router.push('/dashboard/profile'); }}
                                        className="w-full text-left px-4 py-2.5 text-sm text-zinc-700 hover:bg-indigo-50 hover:text-indigo-600 font-medium transition-colors flex items-center gap-2"
                                    >
                                        <UserRound size={16} />
                                        Profile
                                    </button>
                                    <div className="border-t border-zinc-100 my-1"></div>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full text-left px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50 font-medium transition-colors flex items-center gap-2"
                                    >
                                        <LogOut size={16} />
                                        Sign out
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
          </div>
        </div>
      </nav>
      <div className='mt-18'>
        {children}
      </div>


      {/* bottom nav */}

      <Dock
        items={menuItems}
        panelHeight={68}
        baseItemSize={50}
        magnification={70}
      />

    </>
  );
}