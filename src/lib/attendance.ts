
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

// In-memory simulation for scaffold purposes
// In a real app, this would be a database call
let attendanceRecords: AttendanceRecord[] = [];

// Helper to get initial mock data if empty
const generateMockData = () => {
  if (attendanceRecords.length > 0) return;
  
  const programs: CollegeProgram[] = [
    'Accountancy', 'Arts and Science', 'Engineering and Architecture', 'Nursing'
  ];
  
  for (let i = 0; i < 20; i++) {
    const date = new Date();
    date.setHours(date.getHours() - Math.floor(Math.random() * 72));
    attendanceRecords.push({
      id: Math.random().toString(36).substr(2, 9),
      email: `student${i}@neu.edu.ph`,
      sex: Math.random() > 0.5 ? 'Male' : 'Female',
      program: programs[Math.floor(Math.random() * programs.length)],
      timestamp: date.toISOString(),
    });
  }
};

export const getAttendanceRecords = async (): Promise<AttendanceRecord[]> => {
  generateMockData();
  return [...attendanceRecords];
};

export const addAttendanceRecord = async (data: Omit<AttendanceRecord, 'id' | 'timestamp'>) => {
  const newRecord: AttendanceRecord = {
    ...data,
    id: Math.random().toString(36).substr(2, 9),
    timestamp: new Date().toISOString(),
  };
  attendanceRecords.push(newRecord);
  return newRecord;
};

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
