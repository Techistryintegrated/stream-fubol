import React from 'react';

const Topbar = () => {
  return (
    <div className="flex p-6 justify-between items-center border-[#262626] border-b text-sm text-zinc-400 pb-4">
      <p>
        {new Date().toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })}
      </p>
      <span className="flex gap-2.5 px-4 py-2 justify-center items-center bg-[#00C9501A] border border-[#00C95033] text-[#05DF72] rounded-[10px] ">
        <div className="w-2 h-2 bg-[#05DF72] rounded-full"></div>System Online
      </span>
    </div>
  );
}

export default Topbar;
