'use client';

import { motion, AnimatePresence } from 'framer-motion';

export default function FootballLoader() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      {/* Animated Football */}
      <motion.div
        animate={{
          rotate: [0, 360],
          y: [0, -20, 0], // subtle up-down bounce
        }}
        transition={{
          repeat: Infinity,
          duration: 1.2,
          ease: 'linear',
          times: [0, 0.5, 1],
        }}
        className="w-16 h-16 mb-2"
      >
        <FootballSVG />
      </motion.div>
      {/* Animated Goal */}
      <motion.div
        className="w-24 h-2 bg-gradient-to-r from-[#008000] via-white to-[#008000] rounded-full relative overflow-hidden"
        animate={{
          scaleX: [1, 0.8, 1],
        }}
        transition={{
          repeat: Infinity,
          duration: 0.8,
          ease: 'easeInOut',
        }}
      />
      {/* Loading Text */}
      <div className="mt-4 text-gray-300 text-sm tracking-wide font-medium flex items-center gap-2">
        <span className="animate-pulse">Loading match...</span>
        <span className="ml-1 animate-bounce">⚽</span>
      </div>
    </div>
  );
}

// Football SVG Icon
function FootballSVG() {
  return (
    <svg viewBox="0 0 64 64" fill="none" className="w-full h-full">
      <circle
        cx="32"
        cy="32"
        r="30"
        fill="#FFF"
        stroke="#111"
        strokeWidth="4"
      />
      <polygon points="32,18 40,24 37,34 27,34 24,24" fill="#111" />
      {/* Pentagons */}
      <polygon points="32,12 36,18 32,18 28,18" fill="#111" opacity="0.6" />
      <polygon points="46,22 42,26 40,24 44,18" fill="#111" opacity="0.6" />
      <polygon points="18,22 24,24 22,26 20,24" fill="#111" opacity="0.6" />
      <polygon
        points="27,34 26,40 32,44 38,40 37,34"
        fill="#111"
        opacity="0.5"
      />
      <polygon points="14,32 20,28 24,34 22,40" fill="#111" opacity="0.3" />
      <polygon points="50,32 44,28 40,34 42,40" fill="#111" opacity="0.3" />
      {/* Some lines for detail */}
      <path d="M32 12V18" stroke="#111" strokeWidth="2" opacity="0.4" />
      <path d="M44 18L40 24" stroke="#111" strokeWidth="2" opacity="0.4" />
      <path d="M20 24L24 24" stroke="#111" strokeWidth="2" opacity="0.4" />
      <path d="M27 34L32 44" stroke="#111" strokeWidth="2" opacity="0.2" />
      <path d="M37 34L32 44" stroke="#111" strokeWidth="2" opacity="0.2" />
    </svg>
  );
}
