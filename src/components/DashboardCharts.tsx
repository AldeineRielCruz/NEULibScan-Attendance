'use client';

import { useState, useMemo } from 'react';
import { 
  Bar, 
  BarChart, 
  ResponsiveContainer, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AttendanceRecord } from '@/lib/attendance';
import { format, parseISO, startOfHour, startOfDay, startOfMonth, startOfYear, eachHourOfInterval, eachDayOfInterval, subDays, startOfDay as fnsStartOfDay, endOfDay, eachMonthOfInterval, startOfYear as fnsStartOfYear, endOfYear } from 'date-fns';

interface DashboardChartsProps {
  records: AttendanceRecord[];
}

type TimeScale = 'hour' | 'day' | 'month' | 'year';

export default function DashboardCharts({ records }: DashboardChartsProps) {
  const [timeScale, setTimeScale] = useState<TimeScale>('hour');

  // Process College Program Data
  const programData = useMemo(() => {
    const counts = records.reduce((acc: Record<string, number>, curr) => {
      acc[curr.program] = (acc[curr.program] || 0) + 1;
      return acc;
    }, {});
    
    return Object.entries(counts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6);
  }, [records]);

  // Process Sex Data
  const sexData = useMemo(() => [
    { name: 'Male', value: records.filter(r => r.sex === 'Male').length },
    { name: 'Female', value: records.filter(r => r.sex === 'Female').length },
  ], [records]);

  // Process Time Data based on selected scale with a continuous timeline
  const timeChartData = useMemo(() => {
    const now = new Date();
    const groupMap: Record<string, number> = {};
    
    // Group existing records
    records.forEach(record => {
      const date = parseISO(record.timestamp);
      let key = '';
      
      switch (timeScale) {
        case 'hour':
          key = format(startOfHour(date), 'HH:00');
          break;
        case 'day':
          key = format(startOfDay(date), 'MMM dd');
          break;
        case 'month':
          key = format(startOfMonth(date), 'MMMM');
          break;
        case 'year':
          key = format(startOfYear(date), 'yyyy');
          break;
      }
      groupMap[key] = (groupMap[key] || 0) + 1;
    });

    const data: { label: string; count: number }[] = [];

    // Generate full timeline labels based on current time context
    if (timeScale === 'hour') {
      // Show full 24 hours of the current day
      const dayStart = fnsStartOfDay(now);
      const dayEnd = endOfDay(now);
      const hours = eachHourOfInterval({ start: dayStart, end: dayEnd });
      
      hours.forEach(hour => {
        const label = format(hour, 'HH:00');
        data.push({ label, count: groupMap[label] || 0 });
      });
    } else if (timeScale === 'day') {
      // Show last 7 days including today
      const weekStart = subDays(now, 6);
      const days = eachDayOfInterval({ start: weekStart, end: now });
      
      days.forEach(day => {
        const label = format(day, 'MMM dd');
        data.push({ label, count: groupMap[label] || 0 });
      });
    } else if (timeScale === 'month') {
      // Show all months of the current year
      const yearStart = fnsStartOfYear(now);
      const yearEnd = endOfYear(now);
      const months = eachMonthOfInterval({ start: yearStart, end: yearEnd });
      
      months.forEach(month => {
        const label = format(month, 'MMMM');
        data.push({ label, count: groupMap[label] || 0 });
      });
    } else if (timeScale === 'year') {
      // Show a 5-year window (current year +/- 2)
      const currentYear = now.getFullYear();
      for (let i = currentYear - 2; i <= currentYear + 2; i++) {
        const label = i.toString();
        data.push({ label, count: groupMap[label] || 0 });
      }
    }

    return data;
  }, [records, timeScale]);

  const COLORS = ['#2F5F2F', '#93DB74', '#5F9F5F', '#ECF6EC', '#228B22'];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* College Program Distribution */}
      <Card className="lg:col-span-2 border-primary/10 shadow-md">
        <CardHeader>
          <CardTitle className="font-headline text-xl text-primary">Top Participation by Program</CardTitle>
          <CardDescription>Distribution of attendance across various university colleges.</CardDescription>
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={programData}>
              <XAxis 
                dataKey="name" 
                tick={{fontSize: 12, fill: 'hsl(var(--muted-foreground))'}} 
                axisLine={false} 
                tickLine={false}
                interval={0}
                tickFormatter={(val) => val.length > 15 ? val.substring(0, 12) + '...' : val}
              />
              <YAxis hide />
              <Tooltip 
                cursor={{fill: 'rgba(47, 95, 47, 0.05)'}}
                contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}}
              />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {programData.map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Sex Distribution */}
      <Card className="border-primary/10 shadow-md">
        <CardHeader>
          <CardTitle className="font-headline text-xl text-primary">Gender Split</CardTitle>
          <CardDescription>Ratio of male to female students.</CardDescription>
        </CardHeader>
        <CardContent className="h-80 flex flex-col items-center justify-center">
          <ResponsiveContainer width="100%" height="80%">
            <PieChart>
              <Pie
                data={sexData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                <Cell fill="#2F5F2F" />
                <Cell fill="#93DB74" />
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex gap-6 mt-4">
            {sexData.map((item, i) => (
              <div key={item.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{backgroundColor: i === 0 ? '#2F5F2F' : '#93DB74'}} />
                <span className="text-sm font-medium">{item.name}: {item.value}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Hierarchical Time Trends */}
      <Card className="lg:col-span-3 border-primary/10 shadow-md">
        <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between space-y-4 md:space-y-0">
          <div>
            <CardTitle className="font-headline text-xl text-primary">Attendance Time Analysis</CardTitle>
            <CardDescription>Analyze peaks and trends across a continuous timeline.</CardDescription>
          </div>
          <Tabs value={timeScale} onValueChange={(val) => setTimeScale(val as TimeScale)} className="w-full md:w-auto">
            <TabsList className="bg-primary/5 grid grid-cols-4 md:flex">
              <TabsTrigger value="hour" className="text-xs">Hour</TabsTrigger>
              <TabsTrigger value="day" className="text-xs">Day</TabsTrigger>
              <TabsTrigger value="month" className="text-xs">Month</TabsTrigger>
              <TabsTrigger value="year" className="text-xs">Year</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={timeChartData}>
              <XAxis 
                dataKey="label" 
                tick={{fontSize: 10}} 
                axisLine={false} 
                tickLine={false} 
                interval={timeScale === 'hour' ? 2 : 0}
              />
              <YAxis hide />
              <Tooltip 
                contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}}
              />
              <Bar dataKey="count" fill="#2F5F2F" radius={[4, 4, 0, 0]} opacity={0.8} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
