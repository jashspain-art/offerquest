import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import ApplicationsClient from './ApplicationsClient';

export default async function ApplicationsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: applications } = await supabase
    .from('applications')
    .select(`
      id,
      status,
      cover_letter,
      created_at,
      updated_at,
      jobs (
        id,
        title,
        company,
        location,
        url,
        metadata
      )
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  // Supabase returns joined tables as arrays; normalize to single object
  const normalizedApplications = (applications ?? []).map((app) => ({
    ...app,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    jobs: Array.isArray(app.jobs) ? (app.jobs[0] ?? null) : (app.jobs as any),
  }));

  return <ApplicationsClient applications={normalizedApplications} userId={user.id} />;
}
