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

export interface AttendanceRecord {
  id: string;
  email: string;
  sex: 'Male' | 'Female';
  program: CollegeProgram;
  timestamp: string;
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
