
'use server';

import { addAttendanceRecord, CollegeProgram } from '@/lib/attendance';
import { redirect } from 'next/navigation';

export async function submitCheckIn(formData: FormData) {
  const email = formData.get('email') as string;
  const sex = formData.get('sex') as 'Male' | 'Female';
  const program = formData.get('program') as CollegeProgram;

  if (!email || !email.endsWith('@neu.edu.ph')) {
    throw new Error('Invalid email domain. Please use your @neu.edu.ph address.');
  }

  await addAttendanceRecord({ email, sex, program });
  return { success: true };
}

export async function adminLogin(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (email === 'admin@neu.edu.ph' && password === 'adminPassword') {
    // In a real app we'd set a cookie/session
    return { success: true };
  } else {
    throw new Error('Invalid admin credentials.');
  }
}
