'use client';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useUser } from '../../../context/UserContext';
import FootballLoader from './Footballloader';
import { LogOut } from 'lucide-react';

const Navbar = () => {
  const { user, loading, logout } = useUser();


console.log(user?.email, 'user email in navbar');

  if (loading) {
    <FootballLoader />;
  }
  return (
    <header className="bg-[#FFFFFF0D] text-white absolute top-10 w-[90%] rounded-[20px] z-30 left-1/2 transform -translate-x-1/2">
      <nav className="max-w-full mx-auto flex  items-center justify-between p-2.5 backdrop-blur-[50%]">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 flex-shrink-0  md:mb-0"
        >
          <Image
            src={'./stream-fubol logo.svg'}
            width={147}
            height={19}
            alt="stream fubol logo"
          />
        </Link>

        {/* Nav links */}
        <div className="w-full md:w-auto flex flex-row items-center justify-end gap-3 md:gap-6 text-[16px] leading-6 font-medium text-[#E4E7EC]">
          <Link
            href="#live"
            className="hover:text-gray-300 font-inter transition capitalize"
          >
            Live Matches
          </Link>
          <Link
            href="#upcoming"
            className="hover:text-gray-300 transition capitalize"
          >
            Upcoming
          </Link>
          {/* <Link
            href="#info"
            className="hidden md:inline hover:text-gray-300 transition capitalize"
          >
            Info
          </Link> */}
        </div>

        {/* CTA Button */}
        {/* <div className="">
         
        </div> */}

        {user ? (
          <div className="flex items-center gap-4">
            <span className="text-gray-300">
              Hello, {user.name || user.email}
            </span>
           <span>
            <LogOut 
              className="cursor-pointer text-gray-300 hover:text-red-500 transition"
              onClick={logout}    />
           </span>
          </div>
        ) : (
          <div className="hidden md:block">
            {' '}
            <Link
              href="/login"
              className="bg-[#099137] border border-[#E7F6EC] text-white px-[17px] py-[11px] rounded-[12px] text-base font-medium hover:bg-green-700 transition"
            >
              Watch For free
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
