'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useUser } from '../../../context/UserContext';
import FootballLoader from './Footballloader';
import { LogOut, Menu, X } from 'lucide-react';

const Navbar = () => {
  const { user, loading, logout } = useUser();
  const [isOpen, setIsOpen] = useState(false);

  if (loading) return <FootballLoader />;

  return (
    <header className="bg-[#FFFFFF0D] text-white absolute top-10 w-[90%] rounded-[20px] z-30 left-1/2 transform -translate-x-1/2">
      <nav className="relative max-w-full mx-auto flex items-center justify-between p-2.5 backdrop-blur-[50%]">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 flex-shrink-0 z-20">
          <Image
            src="/stream-fubol logo.svg"
            width={147}
            height={19}
            alt="stream fubol logo"
          />
        </Link>

        {/* Center links */}
        <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 gap-6">
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
        </div>

        {/* User / CTA */}
        <div className="hidden md:flex items-center gap-4 z-20">
          {user ? (
            <>
              <span className="text-gray-300">
                Hello, {user.name || user.email}
              </span>
              <LogOut
                className="cursor-pointer text-gray-300 hover:text-red-500 transition"
                onClick={logout}
              />
            </>
          ) : (
            <Link
              href="/login"
              className="bg-[#099137] border border-[#E7F6EC] text-white px-[17px] py-[11px] rounded-[12px] text-base font-medium hover:bg-green-700 transition"
            >
              Watch For Free
            </Link>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 text-white z-20"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Mobile nav */}
        {isOpen && (
          <div className="absolute top-full left-0 w-full bg-[#0A0A0A] rounded-b-[20px] flex flex-col items-center gap-4 p-4 md:hidden">
            <Link
              href="#live"
              className="hover:text-gray-300 transition capitalize"
              onClick={() => setIsOpen(false)}
            >
              Live Matches
            </Link>
            <Link
              href="#upcoming"
              className="hover:text-gray-300 transition capitalize"
              onClick={() => setIsOpen(false)}
            >
              Upcoming
            </Link>
            {user ? (
              <>
                <span className="text-gray-300">
                  Hello, {user.name || user.email}
                </span>
                <LogOut
                  className="cursor-pointer text-gray-300 hover:text-red-500 transition"
                  onClick={() => {
                    logout();
                    setIsOpen(false);
                  }}
                />
              </>
            ) : (
              <Link
                href="/login"
                className="bg-[#099137] border border-[#E7F6EC] text-white px-[17px] py-[11px] rounded-[12px] text-base font-medium hover:bg-green-700 transition"
                onClick={() => setIsOpen(false)}
              >
                Watch For Free
              </Link>
            )}
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
