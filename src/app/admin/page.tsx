import { createClient } from '@/lib/supabase/server';
import {
  Users,
  Briefcase,
  Activity,
  ArrowUpRight,
  TrendingUp,
} from 'lucide-react';

export default async function AdminDashboardOverview() {
  const supabase = await createClient();

  // Fetch Stats
  const { count: userCount } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true });

  const { count: appCount } = await supabase
    .from('applications')
    .select('*', { count: 'exact', head: true });

  const { count: logCount } = await supabase
    .from('activity_logs')
    .select('*', { count: 'exact', head: true });

  const { data: recentApps } = await supabase
    .from('applications')
    .select(`
      id,
      status,
      created_at,
      profiles (name, email),
      jobs (title, company)
    `)
    .order('created_at', { ascending: false })
    .limit(5);

  const stats = [
    { label: 'Total Users', value: userCount ?? 0, icon: <Users className="w-5 h-5 text-[#2563EB]" />, color: 'bg-blue-50' },
    { label: 'Total Applications', value: appCount ?? 0, icon: <Briefcase className="w-5 h-5 text-[#16A34A]" />, color: 'bg-green-50' },
    { label: 'System Logs', value: logCount ?? 0, icon: <Activity className="w-5 h-5 text-[#6366F1]" />, color: 'bg-indigo-50' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-[#111827]">Dashboard Overview</h2>
        <p className="text-sm text-[#6B7280]">Real-time monitoring of your platform performance.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white p-6 rounded-xl border border-[#E5E7EB] shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2 rounded-lg ${stat.color}`}>
                {stat.icon}
              </div>
              <span className="text-[10px] font-bold text-[#16A34A] bg-[#DCFCE7] px-2 py-0.5 rounded-full flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                +12%
              </span>
            </div>
            <p className="text-2xl font-bold text-[#111827]">{stat.value}</p>
            <p className="text-xs font-medium text-[#6B7280]">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Recent Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Applications Table */}
        <div className="bg-white rounded-xl border border-[#E5E7EB] shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-[#E5E7EB] flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#111827]">Recent Applications</h3>
            <button className="text-[11px] font-bold text-[#2563EB] hover:underline flex items-center gap-1">
              View All <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-[#F9FAFB] text-[#6B7280] font-medium border-b border-[#E5E7EB]">
                  <th className="px-6 py-3 font-semibold text-[11px] uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 font-semibold text-[11px] uppercase tracking-wider">Job</th>
                  <th className="px-6 py-3 font-semibold text-[11px] uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E7EB]">
                {(recentApps ?? []).length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-6 py-8 text-center text-[#6B7280]">No recent activity found.</td>
                  </tr>
                ) : (
                  recentApps?.map((app: any) => (
                    <tr key={app.id} className="hover:bg-[#F9FAFB] transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-bold text-[#111827]">{app.profiles?.name || 'Unknown'}</p>
                        <p className="text-[10px] text-[#6B7280]">{app.profiles?.email}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-medium text-[#111827]">{app.jobs?.title}</p>
                        <p className="text-[10px] text-[#6B7280]">{app.jobs?.company}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-tight ${
                          app.status === 'applied' ? 'bg-[#DBEAFE] text-[#1E40AF]' : 'bg-[#F3F4F6] text-[#6B7280]'
                        }`}>
                          {app.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* System Health / Bot Logs Placeholder */}
        <div className="bg-white rounded-xl border border-[#E5E7EB] shadow-sm p-6">
          <h3 className="text-sm font-bold text-[#111827] mb-6">Bot Activity Monitor</h3>
          <div className="space-y-4">
            {[
              { time: '2m ago', action: 'Scouted 14 new jobs in London', status: 'success' },
              { time: '15m ago', action: 'Parsed CV for user: Alex Johnson', status: 'success' },
              { time: '1h ago', action: 'Database backup completed', status: 'success' },
              { time: '3h ago', action: 'Adzuna API sync - Failed (Invalid Key)', status: 'error' },
            ].map((log, i) => (
              <div key={i} className="flex gap-4 items-start pb-4 border-b border-[#F3F4F6] last:border-0 last:pb-0">
                <div className={`w-2 h-2 rounded-full mt-1.5 ${log.status === 'success' ? 'bg-[#16A34A]' : 'bg-[#EF4444]'}`} />
                <div className="flex-1">
                  <p className="text-sm font-medium text-[#111827] leading-tight">{log.action}</p>
                  <p className="text-[10px] text-[#6B7280] mt-0.5 font-medium">{log.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
