'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Activity, Bug, CheckCircle, AlertCircle, Clock, Trash2 } from 'lucide-react';

export default function AdminLogsPage() {
  const supabase = createClient();
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLogs() {
      const { data, error } = await supabase
        .from('activity_logs')
        .select(`
          *,
          profiles:user_id (name, email)
        `)
        .order('created_at', { ascending: false })
        .limit(100);

      if (data) setLogs(data);
      setLoading(false);
    }
    fetchLogs();
  }, [supabase]);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-[#111827] tracking-tight">Audit Logs</h1>
          <p className="text-[#6B7280] text-sm mt-1">Detailed activity tracking across the platform.</p>
        </div>
        <button 
          className="flex items-center gap-2 px-4 py-2 bg-white border border-[#E5E7EB] rounded-lg text-sm font-medium text-[#EF4444] hover:bg-[#FEF2F2] hover:border-[#FEE2E2] transition-colors"
        >
          <Trash2 className="w-4 h-4" />
          Clear Logs
        </button>
      </div>

      <div className="bg-white rounded-xl border border-[#E5E7EB] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#F9FAFB] border-b border-[#E5E7EB]">
                <th className="px-6 py-4 text-[10px] font-bold text-[#6B7280] uppercase tracking-widest">Type</th>
                <th className="px-6 py-4 text-[10px] font-bold text-[#6B7280] uppercase tracking-widest">User</th>
                <th className="px-6 py-4 text-[10px] font-bold text-[#6B7280] uppercase tracking-widest">Activity</th>
                <th className="px-6 py-4 text-[10px] font-bold text-[#6B7280] uppercase tracking-widest">Timestamp</th>
                <th className="px-6 py-4 text-[10px] font-bold text-[#6B7280] uppercase tracking-widest text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F3F4F6]">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-sm text-[#6B7280]">Loading logs...</td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-sm text-[#6B7280]">No logs recorded yet.</td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-[#F9FAFB] transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {log.action?.includes('error') ? (
                          <AlertCircle className="w-4 h-4 text-[#EF4444]" />
                        ) : log.action?.includes('success') ? (
                          <CheckCircle className="w-4 h-4 text-[#16A34A]" />
                        ) : (
                          <Activity className="w-4 h-4 text-[#2563EB]" />
                        )}
                        <span className="text-[10px] font-bold uppercase tracking-tight text-[#111827]">
                          {log.action?.split('_')[0] || 'SYSTEM'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-[#EFF6FF] flex items-center justify-center text-[#2563EB] text-[10px] font-bold">
                          {log.profiles?.name?.charAt(0) || 'S'}
                        </div>
                        <p className="text-xs font-medium text-[#111827]">{log.profiles?.name || 'System'}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-[#111827] max-w-md truncate">{log.details || log.action}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 text-[10px] text-[#6B7280]">
                        <Clock className="w-3.5 h-3.5" />
                        {new Date(log.created_at).toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {log.metadata && Object.keys(log.metadata).length > 0 && (
                        <button className="text-[10px] font-bold text-[#2563EB] hover:text-[#1D4ED8] underline">
                          View Details
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
