import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import {
  LayoutDashboard,
  Users,
  Briefcase,
  Activity,
  ArrowLeft,
  Settings,
} from 'lucide-react';
import Link from 'next/link';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Check if user is admin
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'admin') {
    redirect('/dashboard');
  }

  const navItems = [
    { label: 'Overview', href: '/admin', icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: 'User Management', href: '/admin/users', icon: <Users className="w-4 h-4" /> },
    { label: 'All Applications', href: '/admin/applications', icon: <Briefcase className="w-4 h-4" /> },
    { label: 'Activity Logs', href: '/admin/logs', icon: <Activity className="w-4 h-4" /> },
  ];

  return (
    <div className="flex min-h-screen bg-[#F9FAFB] text-[#111827]">
      {/* Admin Sidebar */}
      <aside className="w-64 bg-white border-r border-[#E5E7EB] flex flex-col sticky top-0 h-screen">
        <div className="p-6 border-b border-[#E5E7EB]">
          <Link href="/admin" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#2563EB] rounded-lg flex items-center justify-center">
              <span className="text-white font-black text-xs">AQ</span>
            </div>
            <span className="font-bold text-lg tracking-tight">
              Admin<span className="text-[#2563EB]">Panel</span>
            </span>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-[#6B7280] hover:text-[#111827] hover:bg-[#F3F4F6] transition-colors"
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-[#E5E7EB]">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-[#6B7280] hover:text-[#111827] hover:bg-[#F3F4F6] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to App
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        <header className="h-16 bg-white border-b border-[#E5E7EB] flex items-center justify-between px-8">
          <h1 className="text-sm font-semibold text-[#111827]">System Control</h1>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-xs font-bold text-[#111827]">Administrator</p>
              <p className="text-[10px] text-[#6B7280] uppercase tracking-wider font-medium">Root Access</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-[#F3F4F6] border border-[#E5E7EB] flex items-center justify-center">
              <Users className="w-4 h-4 text-[#6B7280]" />
            </div>
          </div>
        </header>

        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
