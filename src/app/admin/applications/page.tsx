'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Briefcase, Building, Clock, Search, ExternalLink, User } from 'lucide-react';

export default function AdminApplicationsPage() {
  const supabase = createClient();
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    async function fetchApplications() {
      const { data, error } = await supabase
        .from('applications')
        .select(`
          *,
          profiles:user_id (name, email),
          jobs:job_id (title, company)
        `)
        .order('created_at', { ascending: false });

      if (data) setApplications(data);
      setLoading(false);
    }
    fetchApplications();
  }, [supabase]);

  const filteredApps = applications.filter(app => 
    app.jobs?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.jobs?.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.profiles?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-[#111827] tracking-tight">Global Applications</h1>
        <p className="text-[#6B7280] text-sm mt-1">Monitor all job applications across the platform.</p>
      </div>

      <div className="relative w-full max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
        <input
          type="text"
          placeholder="Search by job, company, or user name..."
          className="w-full pl-10 pr-4 py-2 bg-white border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] transition-all"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="bg-white rounded-xl border border-[#E5E7EB] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#F9FAFB] border-b border-[#E5E7EB]">
                <th className="px-6 py-4 text-[10px] font-bold text-[#6B7280] uppercase tracking-widest">Job / Company</th>
                <th className="px-6 py-4 text-[10px] font-bold text-[#6B7280] uppercase tracking-widest">Applicant</th>
                <th className="px-6 py-4 text-[10px] font-bold text-[#6B7280] uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-[10px] font-bold text-[#6B7280] uppercase tracking-widest">Date</th>
                <th className="px-6 py-4 text-[10px] font-bold text-[#6B7280] uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F3F4F6]">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-sm text-[#6B7280]">Loading applications...</td>
                </tr>
              ) : filteredApps.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-sm text-[#6B7280]">No applications found.</td>
                </tr>
              ) : (
                filteredApps.map((app) => (
                  <tr key={app.id} className="hover:bg-[#F9FAFB] transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-[#F3F4F6] rounded-lg">
                          <Briefcase className="w-4 h-4 text-[#111827]" />
                        </div>
                        <div>
                          <p className="font-bold text-[#111827]">{app.jobs?.title || 'Unknown Position'}</p>
                          <div className="flex items-center gap-1 text-[10px] text-[#6B7280]">
                            <Building className="w-3 h-3" />
                            {app.jobs?.company || 'Unknown Company'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-[#F3F4F6] flex items-center justify-center text-[#111827] text-[10px] font-bold">
                          {app.profiles?.name?.charAt(0) || 'U'}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-[#111827]">{app.profiles?.name || 'Anonymous'}</p>
                          <p className="text-[10px] text-[#6B7280]">{app.profiles?.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-tight ${
                        app.status === 'applied' ? 'bg-[#DBEAFE] text-[#1E40AF]' : 'bg-[#F3F4F6] text-[#6B7280]'
                      }`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-[#6B7280]">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {new Date(app.created_at).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-2 hover:bg-[#F3F4F6] rounded-lg transition-colors text-[#6B7280] hover:text-[#111827]">
                        <ExternalLink className="w-4 h-4" />
                      </button>
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
