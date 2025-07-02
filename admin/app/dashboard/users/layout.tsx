// app/dashboard/layout.tsx

import Sidebar from '../../components/shared/Sidebar';
import Topbar from '../../components/shared/Topbar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-black text-white">
      <Sidebar />

      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <div className="flex-shrink-0">
          <Topbar />
        </div>
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
