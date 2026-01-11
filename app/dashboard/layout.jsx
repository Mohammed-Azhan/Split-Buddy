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
  { icon: <UserRound color='white'></UserRound>, label: 'Profile', onClick: () => alert('Profile!') },
  { icon: <ChartColumnDecreasing color='white'></ChartColumnDecreasing>, label: 'Analayse report', onClick: () => alert('Report!') },
  { icon: <Settings color='white'></Settings>, label: 'Settings', onClick: () => alert('Settings!') },
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
      <nav className="bg-white shadow-lg fixed z-[999] w-full top-0 left-0">
        <div className="w-full md:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">

              <span className="text-gray-800 font-bold md:text-2xl text-xl sm:inline uppercase">Split Buddy</span>
            </Link>

            {/* Right Section - User & Menu Button */}
            <div className="flex items-center">
              {session?.user && (
                <div className="flex items-center gap-2 flex-row-reverse">
                  <span className="text-gray-900 text-md font-semibold">{session.user.name || session.user.email}</span>
                  {session.user.image ? (
                    <Image
                      src={session.user.image}
                      alt="User Avatar"
                      width={32}
                      height={32}
                      className="w-8 h-8 rounded-full"
                    />
                  ) : <div>
                    <h1 className='bg-indigo-500 flex items-center justify-center text-white font-bold uppercase rounded-full p-2 w-8 h-8 text-md'>{session?.user?.email[0]}</h1>
                    </div>}
                </div>
              )}

              {/* Menu Button */}
              {/* <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-white p-2 rounded-lg hover:bg-white hover:bg-opacity-20 transition-all"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button> */}
            </div>
          </div>

          {/* Dropdown Menu */}
          {isMenuOpen && (
            <div className="absolute right-0 left-0 top-16 bg-white shadow-xl z-50">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-2">
                {/* User Info Section (Mobile) */}
                {session?.user && (
                  <div className="sm:hidden px-4 py-3 border-b">
                    <div className="flex items-center gap-3">
                      {session.user.image && (
                        <Image
                          src={session.user.image}
                          alt="User Avatar"
                          width={40}
                          height={40}
                          className="w-10 h-10 rounded-full"
                        />
                      )}
                      <div>
                        <p className="font-semibold text-gray-800">{session.user.name || 'User'}</p>
                        <p className="text-sm text-gray-600">{session.user.email}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Menu Items */}
                {menuItems.map((item) => {
                  const IconComponent = item.icon;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg transition-all font-medium"
                    >
                      <IconComponent size={20} />
                      {item.name}
                    </Link>
                  );
                })}

                {/* Divider */}
                <div className="border-t my-2"></div>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-all font-medium"
                >
                  <LogOut size={20} />
                  Sign Out
                </button>
              </div>
            </div>
          )}
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