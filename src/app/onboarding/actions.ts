'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function updateOnboardingProfile(formData: {
  location: string;
  jobType: string;
  experience: string;
  workMode: string;
  sectors: string[];
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Not authenticated');
  }

  const { error } = await supabase
    .from('profiles')
    .update({
      location: formData.location,
      job_type: formData.jobType,
      experience_level: formData.experience,
      job_preferences: { workMode: formData.workMode },
      sectors: formData.sectors,
    })
    .eq('id', user.id);

  if (error) {
    console.error('Error updating profile:', error);
    throw new Error('Failed to update profile');
  }

  revalidatePath('/dashboard');
}

export async function uploadCVAction(fileData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Not authenticated');
  }

  const file = fileData.get('file') as File;
  if (!file) {
    throw new Error('No file provided');
  }

  const fileName = `${user.id}/${Date.now()}-${file.name}`;
  
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('cvs')
    .upload(fileName, file);

  if (uploadError) {
    console.error('Error uploading CV:', uploadError);
    throw new Error('Failed to upload CV');
  }

  // Record in CVs table
  const { error: dbError } = await supabase
    .from('cvs')
    .insert({
      user_id: user.id,
      file_url: uploadData.path,
    });

  if (dbError) {
    console.error('Error recording CV in DB:', dbError);
    // Note: We might want to delete the uploaded file if DB record fails
    throw new Error('Failed to record CV metadata');
  }

  return { path: uploadData.path };
}
