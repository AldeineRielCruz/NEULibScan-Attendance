'use client';

import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  Clock, 
  School, 
  Calendar as CalendarIcon,
  ChevronLeft,
  Loader2,
  Lock
} from 'lucide-react';
import Link from 'next/link';
import DashboardCharts from '@/components/DashboardCharts';
import { useFirestore, useCollection, useMemoFirebase, useUser } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import { AttendanceRecord } from '@/lib/attendance';

export default function AdminDashboard() {
  const firestore = useFirestore();
  const { user, isUserLoading } = useUser();
  
  const recordsQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    // We query the attendanceRecords collection ordered by the timestamp
    return query(collection(firestore, 'attendanceRecords'), orderBy('timestamp', 'desc'));
  }, [firestore, user]);

  const { data: records, isLoading: isDataLoading } = useCollection<AttendanceRecord>(recordsQuery);

  if (isUserLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground font-headline text-lg">Verifying Access...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-6">
        <Card className="max-w-md w-full text-center p-8 border-primary/20">
          <Lock className="w-16 h-16 text-primary mx-auto mb-4" />
          <h2 className="text-2xl font-headline font-bold text-primary mb-2">Access Denied</h2>
          <p className="text-muted-foreground mb-6">You must be logged in as an administrator to view this dashboard.</p>
          <Link href="/" className="w-full">
            <Button className="w-full">Return to Login</Button>
          </Link>
        </Card>
      </div>
    );
  }

  if (isDataLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground font-headline text-lg">Loading Analytics...</p>
        </div>
      </div>
    );
  }

  const attendanceList = records || [];

  return (
    <div className="min-h-screen bg-background p-6 md:p-10">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Link href="/" className="text-primary hover:text-primary/80 flex items-center gap-1 text-sm font-bold">
                <ChevronLeft className="w-4 h-4" />
                Back to Portal
              </Link>
            </div>
            <h1 className="text-4xl font-headline font-bold text-primary">Attendance Analytics</h1>
            <p className="text-muted-foreground">Comprehensive overview of student presence across all departments.</p>
          </div>
          
          <div className="flex items-center gap-4 bg-white p-3 rounded-lg shadow-sm border border-primary/10">
            <div className="text-right">
              <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">System Status</p>
              <p className="text-sm font-bold text-primary flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                Live Monitoring
              </p>
            </div>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-primary/10">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Total Check-ins</CardTitle>
              <Users className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{attendanceList.length}</div>
              <p className="text-xs text-muted-foreground">Real-time total</p>
            </CardContent>
          </Card>
          <Card className="border-primary/10">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">System Role</CardTitle>
              <School className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold truncate">Administrator</div>
              <p className="text-xs text-muted-foreground">{user?.email}</p>
            </CardContent>
          </Card>
          <Card className="border-primary/10">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Status</CardTitle>
              <Clock className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Active</div>
              <p className="text-xs text-muted-foreground">Database connected</p>
            </CardContent>
          </Card>
          <Card className="border-primary/10">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Latest Entry</CardTitle>
              <CalendarIcon className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{attendanceList.length > 0 ? 'Recently' : 'No entries'}</div>
              <p className="text-xs text-muted-foreground">Auto-updating</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <DashboardCharts records={attendanceList} />

        {/* Recent Activity Table */}
        <Card className="border-primary/10 shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline text-2xl text-primary">Recent Check-ins</CardTitle>
            <CardDescription>A real-time list of students who have recorded their attendance.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50 border-primary/10">
                  <TableHead className="font-bold">Student Email</TableHead>
                  <TableHead className="font-bold">Sex</TableHead>
                  <TableHead className="font-bold">College Program</TableHead>
                  <TableHead className="font-bold">Date & Time</TableHead>
                  <TableHead className="text-right font-bold">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {attendanceList.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                      No attendance records found.
                    </TableCell>
                  </TableRow>
                ) : (
                  attendanceList.map((record) => (
                    <TableRow key={record.id} className="border-primary/5 hover:bg-accent/5">
                      <TableCell className="font-medium font-body">{record.email}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={record.sex === 'Male' ? 'border-blue-200 text-blue-700 bg-blue-50' : 'border-pink-200 text-pink-700 bg-pink-50'}>
                          {record.sex}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-body text-muted-foreground">{record.program}</TableCell>
                      <TableCell className="font-body text-sm">
                        {new Date(record.timestamp).toLocaleDateString()} {new Date(record.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge className="bg-primary hover:bg-primary/90">Present</Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
