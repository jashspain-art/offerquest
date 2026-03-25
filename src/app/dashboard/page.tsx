import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import DashboardClient from './DashboardClient';

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Fetch profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (!profile) {
    redirect('/onboarding');
  }

  // Fetch jobs
  const { data: jobs } = await supabase
    .from('jobs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(50);

  // Fetch applied job IDs for this user
  const { data: applications } = await supabase
    .from('applications')
    .select('job_id')
    .eq('user_id', user.id);

  const appliedJobIds = new Set((applications ?? []).map((a) => a.job_id));

  return (
    <DashboardClient
      profile={profile}
      userId={user.id}
      jobs={jobs ?? []}
      appliedJobIds={Array.from(appliedJobIds)}
    />
  );
}
