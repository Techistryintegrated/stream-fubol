'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function Hero() {

  return (
    <section className="relative h-screen w-full">
      {/* Background Image */}
      <Image
        src="/hero.webp" // Add your image path here
        alt="Stadium background"
        fill
        priority
        className="object-cover object-center z-0"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-60 z-10" />

      {/* Hero Content */}
      <div className="relative z-20 flex flex-col items-center justify-center h-full text-center px-4 ">
        <h1 className="text-4xl md:text-5xl lg:text-[56px] leading-[61px] tracking-[-1.82px] font-bold mb-8 text-[#F7F8F8]">
          Watch Live Football Instantly
        </h1>
        <p className="text-lg md:text-xl font-semibold mb-10 text-[#FFFFFFB2] tracking-[-0.32px] ">
        No hassle. Just the match.   
        </p>
        <Link
          href="/stream"
          className="bg-[#099137] border border-[#E7F6EC] text-white px-[17px] py-[11px] rounded-[12px] text-base font-medium hover:bg-green-700 transition"
        >
          Watch For Free
        </Link>
      </div>
    </section>
  );
}
