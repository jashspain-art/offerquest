'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { User, Shield, Mail, Calendar, Search, Filter } from 'lucide-react';

export default function AdminUsersPage() {
  const supabase = createClient();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    async function fetchUsers() {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (data) setUsers(data);
      setLoading(false);
    }
    fetchUsers();
  }, [supabase]);

  const filteredUsers = users.filter(user => 
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleRole = async (userId: string, currentRole: string) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    const { error } = await supabase
      .from('profiles')
      .update({ role: newRole })
      .eq('user_id', userId);

    if (!error) {
      setUsers(users.map(u => u.user_id === userId ? { ...u, role: newRole } : u));
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-[#111827] tracking-tight">User Management</h1>
        <p className="text-[#6B7280] text-sm mt-1">Manage platform users and permissions.</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
          <input
            type="text"
            placeholder="Search users by name or email..."
            className="w-full pl-10 pr-4 py-2 bg-white border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-[#E5E7EB] rounded-lg text-sm font-medium text-[#111827] hover:bg-[#F9FAFB] transition-colors">
          <Filter className="w-4 h-4" />
          More Filters
        </button>
      </div>

      <div className="bg-white rounded-xl border border-[#E5E7EB] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#F9FAFB] border-b border-[#E5E7EB]">
                <th className="px-6 py-4 text-[10px] font-bold text-[#6B7280] uppercase tracking-widest">User</th>
                <th className="px-6 py-4 text-[10px] font-bold text-[#6B7280] uppercase tracking-widest">Role</th>
                <th className="px-6 py-4 text-[10px] font-bold text-[#6B7280] uppercase tracking-widest">Linked Apps</th>
                <th className="px-6 py-4 text-[10px] font-bold text-[#6B7280] uppercase tracking-widest">Joined</th>
                <th className="px-6 py-4 text-[10px] font-bold text-[#6B7280] uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F3F4F6]">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-sm text-[#6B7280]">Loading users...</td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-sm text-[#6B7280]">No users found matching your search.</td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.user_id} className="hover:bg-[#F9FAFB] transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#EFF6FF] flex items-center justify-center text-[#2563EB] font-bold text-xs">
                          {user.name?.charAt(0) || 'U'}
                        </div>
                        <div>
                          <p className="font-bold text-[#111827]">{user.name || 'Anonymous'}</p>
                          <div className="flex items-center gap-1 text-[10px] text-[#6B7280]">
                            <Mail className="w-3 h-3" />
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-tight ${
                        user.role === 'admin' ? 'bg-[#DBEAFE] text-[#1E40AF]' : 'bg-[#F3F4F6] text-[#6B7280]'
                      }`}>
                        {user.role === 'admin' && <Shield className="w-3 h-3 text-[#1E40AF]" />}
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-medium text-[#111827]">0 applications</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 text-xs text-[#6B7280]">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(user.created_at).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => toggleRole(user.user_id, user.role)}
                        className="text-[10px] font-bold text-[#2563EB] hover:text-[#1D4ED8] underline"
                      >
                        Change Role
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
