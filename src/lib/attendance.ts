export type CollegeProgram = 
  | 'Accountancy'
  | 'Agriculture'
  | 'Arts and Science'
  | 'Business Administration'
  | 'Communication'
  | 'Informatics and computing studies'
  | 'Criminology'
  | 'Education'
  | 'Engineering and Architecture'
  | 'Medical Technology'
  | 'Midwifery'
  | 'Music'
  | 'Nursing'
  | 'Physical Therapy'
  | 'Respiratory Therapy'
  | 'International Relations';

/**
 * AttendanceRecord interface aligned with backend.json schema.
 */
export interface AttendanceRecord {
  id: string;
  studentEmail: string;
  sex: 'Male' | 'Female';
  collegeProgram: CollegeProgram;
  checkInDateTime: string;
}

export const COLLEGE_PROGRAMS: CollegeProgram[] = [
  'Accountancy',
  'Agriculture',
  'Arts and Science',
  'Business Administration',
  'Communication',
  'Informatics and computing studies',
  'Criminology',
  'Education',
  'Engineering and Architecture',
  'Medical Technology',
  'Midwifery',
  'Music',
  'Nursing',
  'Physical Therapy',
  'Respiratory Therapy',
  'International Relations'
];
