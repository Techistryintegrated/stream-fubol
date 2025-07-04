// components/Sidebar.tsx
'use client';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { LayoutDashboard, Users } from 'lucide-react';
import Image from 'next/image';

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
  { label: 'User Management', icon: Users, href: '/dashboard/users' },

];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="bg-zinc-950  w-64 h-full text-white flex flex-col px-4 py-6">
      <div className="text-[#A1A1A1] border-[#262626] border-b capitalize my-5 px-4">
        <Image
          src="/stream-fubol.svg"
          alt="Stream Fubol Logo"
          width={180}
          height={50}
        />
        <small>Admin panel</small>
      </div>

      <nav className="flex-1 mt-4 ml-4 space-y-2">
        {navItems.map(({ label, icon: Icon, href }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={label}
              href={href}
              className={`flex items-center gap-[7px] px-[7px] py-[5px] rounded-lg text-sm transition-colors ${
                isActive
                  ? 'bg-zinc-800 text-white font-semibold'
                  : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
