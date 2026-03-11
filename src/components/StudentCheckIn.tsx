'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { COLLEGE_PROGRAMS, AttendanceRecord } from '@/lib/attendance';
import { BookOpen, GraduationCap, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useFirestore } from '@/firebase';
import { doc, collection } from 'firebase/firestore';
import { setDocumentNonBlocking } from '@/firebase/non-blocking-updates';

export default function StudentCheckIn() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const firestore = useFirestore();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    if (!firestore) {
      setStatus('error');
      setErrorMessage('Database service not available.');
      return;
    }

    const formData = new FormData(event.currentTarget);
    const email = formData.get('email') as string;
    const sex = formData.get('sex') as 'Male' | 'Female';
    const program = formData.get('program') as any;

    if (!email || !email.endsWith('@neu.edu.ph')) {
      setStatus('error');
      setErrorMessage('Invalid email domain. Please use your @neu.edu.ph address.');
      return;
    }

    try {
      const recordId = Math.random().toString(36).substr(2, 9);
      const attendanceRef = doc(firestore, 'attendanceRecords', recordId);
      
      const recordData: AttendanceRecord = {
        id: recordId,
        email,
        sex,
        program,
        timestamp: new Date().toISOString(),
      };

      setDocumentNonBlocking(attendanceRef, recordData, { merge: true });
      
      setStatus('success');
      (event.target as HTMLFormElement).reset();
      setTimeout(() => setStatus('idle'), 5000);
    } catch (error: any) {
      setStatus('error');
      setErrorMessage(error.message || 'Something went wrong. Please try again.');
    }
  }

  if (status === 'success') {
    return (
      <div className="py-12 flex flex-col items-center justify-center text-center space-y-6 animate-in fade-in zoom-in duration-300">
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
          <CheckCircle2 className="w-12 h-12 text-primary" />
        </div>
        <div className="space-y-2">
          <h2 className="text-3xl font-headline font-bold text-primary">Attendance Recorded</h2>
          <p className="text-muted-foreground font-body max-w-xs mx-auto">
            Thank you for checking in. Your presence has been successfully logged for today.
          </p>
        </div>
        <Button 
          variant="outline" 
          onClick={() => setStatus('idle')}
          className="border-primary text-primary hover:bg-primary/5"
        >
          Register Another Student
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <div className="flex justify-center mb-4">
          <BookOpen className="w-12 h-12 text-primary" />
        </div>
        <h2 className="text-3xl font-headline font-bold text-primary">Student Attendance</h2>
        <p className="text-muted-foreground font-body">Please record your presence for today's session.</p>
      </div>

      {status === 'error' && (
        <Alert variant="destructive" className="border-destructive/50 bg-destructive/5">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Check-in Failed</AlertTitle>
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="email" className="font-body font-bold">Instructional Email</Label>
          <Input 
            id="email" 
            name="email" 
            type="email" 
            placeholder="your-id@neu.edu.ph" 
            required 
            className="border-primary/20 focus:border-primary"
            disabled={status === 'loading'}
          />
        </div>

        <div className="space-y-2">
          <Label className="font-body font-bold">Sex</Label>
          <RadioGroup name="sex" defaultValue="Male" className="flex space-x-4" disabled={status === 'loading'}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Male" id="male" />
              <Label htmlFor="male">Male</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Female" id="female" />
              <Label htmlFor="female">Female</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <Label htmlFor="program" className="font-body font-bold">College Program</Label>
          <Select name="program" required disabled={status === 'loading'}>
            <SelectTrigger className="border-primary/20">
              <SelectValue placeholder="Select your program" />
            </SelectTrigger>
            <SelectContent>
              {COLLEGE_PROGRAMS.map((program) => (
                <SelectItem key={program} value={program}>
                  {program}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button 
          type="submit" 
          className="w-full bg-primary hover:bg-primary/90 text-white font-headline text-lg py-6"
          disabled={status === 'loading'}
        >
          {status === 'loading' ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Recording Presence...
            </>
          ) : 'Check In Now'}
        </Button>
      </form>

      <div className="pt-4 flex items-center justify-center text-xs text-muted-foreground gap-2">
        <GraduationCap className="w-4 h-4" />
        <span>University of Excellence Presence Tracker</span>
      </div>
    </div>
  );
}
