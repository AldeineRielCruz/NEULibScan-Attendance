
import { getAttendanceRecords } from '@/lib/attendance';
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
import { 
  Users, 
  Clock, 
  School, 
  Calendar as CalendarIcon,
  ChevronLeft
} from 'lucide-react';
import Link from 'next/link';
import DashboardCharts from '@/components/DashboardCharts';

export default async function AdminDashboard() {
  const records = await getAttendanceRecords();

  return (
    <div className="min-h-screen bg-background p-6 md:p-10">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Link href="/" className="text-primary hover:text-primary/80 flex items-center gap-1 text-sm font-bold">
                <ChevronLeft className="w-4 h-4" />
                Back to Login
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
                Operational
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
              <div className="text-2xl font-bold">{records.length}</div>
              <p className="text-xs text-muted-foreground">+12% from last week</p>
            </CardContent>
          </Card>
          <Card className="border-primary/10">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Top Program</CardTitle>
              <School className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold truncate">Informatics</div>
              <p className="text-xs text-muted-foreground">Highest participation</p>
            </CardContent>
          </Card>
          <Card className="border-primary/10">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Peak Hour</CardTitle>
              <Clock className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">10:00 AM</div>
              <p className="text-xs text-muted-foreground">Most active time</p>
            </CardContent>
          </Card>
          <Card className="border-primary/10">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Latest Entry</CardTitle>
              <CalendarIcon className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Just Now</div>
              <p className="text-xs text-muted-foreground">Real-time update</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <DashboardCharts records={records} />

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
                {records.slice(-10).reverse().map((record) => (
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
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
