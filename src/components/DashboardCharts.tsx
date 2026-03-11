
'use client';

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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AttendanceRecord } from '@/lib/attendance';

interface DashboardChartsProps {
  records: AttendanceRecord[];
}

export default function DashboardCharts({ records }: DashboardChartsProps) {
  // Process College Program Data
  const programData = records.reduce((acc: any, curr) => {
    const existing = acc.find((item: any) => item.name === curr.program);
    if (existing) {
      existing.value += 1;
    } else {
      acc.push({ name: curr.program, value: 1 });
    }
    return acc;
  }, []);

  // Sort by value and take top 5
  const topPrograms = programData.sort((a: any, b: any) => b.value - a.value).slice(0, 6);

  // Process Sex Data
  const sexData = [
    { name: 'Male', value: records.filter(r => r.sex === 'Male').length },
    { name: 'Female', value: records.filter(r => r.sex === 'Female').length },
  ];

  // Process Time Data (By Hour)
  const hourlyData = Array.from({ length: 12 }, (_, i) => ({
    hour: `${i + 8}:00`,
    count: records.filter(r => new Date(r.timestamp).getHours() === (i + 8)).length
  }));

  const COLORS = ['#2F5F2F', '#93DB74', '#5F9F5F', '#ECF6EC', '#228B22'];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* College Program Distribution */}
      <Card className="lg:col-span-2 border-primary/10 shadow-md">
        <CardHeader>
          <CardTitle className="font-headline text-xl text-primary">Top Participation by Program</CardTitle>
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={topPrograms}>
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
                {topPrograms.map((entry: any, index: number) => (
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

      {/* Hourly Trend */}
      <Card className="lg:col-span-3 border-primary/10 shadow-md">
        <CardHeader>
          <CardTitle className="font-headline text-xl text-primary">Hourly Traffic Trend</CardTitle>
        </CardHeader>
        <CardContent className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={hourlyData}>
              <XAxis dataKey="hour" tick={{fontSize: 11}} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip />
              <Bar dataKey="count" fill="#2F5F2F" radius={[4, 4, 0, 0]} opacity={0.8} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
