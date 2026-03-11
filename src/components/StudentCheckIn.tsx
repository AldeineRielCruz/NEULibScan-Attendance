
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
import { submitCheckIn } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { COLLEGE_PROGRAMS } from '@/lib/attendance';
import { BookOpen, GraduationCap } from 'lucide-react';

export default function StudentCheckIn() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    
    try {
      await submitCheckIn(formData);
      toast({
        title: "Attendance Recorded",
        description: "Thank you for checking in. Have a great day!",
      });
      (event.target as HTMLFormElement).reset();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Check-in Failed",
        description: error.message,
      });
    } finally {
      setIsSubmitting(false);
    }
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
          />
        </div>

        <div className="space-y-2">
          <Label className="font-body font-bold">Sex</Label>
          <RadioGroup name="sex" defaultValue="Male" className="flex space-x-4">
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
          <Select name="program" required>
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
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Recording...' : 'Check In Now'}
        </Button>
      </form>

      <div className="pt-4 flex items-center justify-center text-xs text-muted-foreground gap-2">
        <GraduationCap className="w-4 h-4" />
        <span>University of Excellence Presence Tracker</span>
      </div>
    </div>
  );
}
