# NEULib Scan - Library attendance system with dashboard
**NEULib Scan is an attendance web app intended for keeping track of the students that utilize the university's library.**  

An attendance web app that records NEU institional emails along with their gender and college program.  
It is intended for recording attendances within a site, supposedly from stationary computers within the library students can see and be insisted to fill up.  

# Sections  
- **Screenshots**
  - [Login Screen](#NEULib-Scan-Login-Screen)
  - [Dashboard Screen](#NEULib-Scan-Admin-Dashboard-Screen)
  - [Firebase Console](#Firebase-Console)
- [**Website Viewing/How to use Repo**](#Link-to-the-website-for-viewing)
- [**Frameworks**](#The-Website-was-made-with-the-following-frameworks:)
- [**Documentation**](#Documentation)
  - [Main Login Screen](#Firebase-Console)
    - [Email](#Email-field)
    - [Sex](#Sex-radiogroup-choice)
    - [College Programs](#College-Program-Dropdown)
    - [HandleSumbit button](#The-handlesubmit-function)
  - [Admin Portal](#The-Admin-Portal-Tab)
  - [Admin Dashboard](#Admin-Dashboard)
    -[Dashboard Charts](#The-Dashboard-Charts)
      -[Sex Distribution](#Sex-Distribution-Chart)
    
### *NEULib Scan Login Screen*
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/ed88f746-c3fb-4c87-9691-4184a0eba236" />  

### NEULib Scan Admin Dashboard Screen 
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/6dea290e-5beb-4477-b739-fc5b8a352d04" />
For veiwing statistics of student attendences in the library, there is an admin panel to view these stats.  

It uses the inbuilt Firebox database (backend of firebase studio) which has real-time viewing of the data without refreshing the admin dashboard page.   

### Firebase Console  
<a href="https://ibb.co/s9TCH7T0"><img src="https://i.ibb.co/fd39vJ3h/image.png" alt="image" border="0"></a>
<details>
  <summary>Admin Password</summary>
  
   ```javascript
  const PREDEFINED_ADMIN = 'admin@neu.edu.ph';
  const PREDEFINED_PASS = 'adminPassword';
  ```
  
</details>

## Link to the website for viewing  
[**NEULIB SCAN**](https://9000-firebase-studio-1773239877998.cluster-osvg2nzmmzhzqqjio6oojllbg4.cloudworkstations.dev)  
*The site only opens when a computer has access to the workspace as it hasn't reached proper hosting, so it would be open only on presentation purposes.*   

**You can also clone the repository and run this locally using the "Firebase Local Emulator Suite"; refer to this link after cloning the repo:**    
[Install, configure and integrate Local Emulator Suite](https://firebase.google.com/docs/emulator-suite/install_and_configure)

## The Website was made with the following frameworks: 
- NextJs
- React
- Lucide React
- Tailwind CSS
- Firebase (Hosting and Code)
- Firebox (database)

# Documentation  
*This section past this point is the documentation section, which documents and briefly explains the componenets within the web application*  

### The main Login Screen

#### **Email field**  
The Email field inputs a student's institutional email. Similar to an 'email' input field, it requires the email address of the school: '@neu.edu.ph' for it to be a valid input, if it doesn't it will show an error message.  


~/src/app/components/StudentCheckIn.tsx
 ```javascript
 if (!email || !email.endsWith('@neu.edu.ph')) {
      setStatus('error');
      setErrorMessage('Invalid email domain. Please use your @neu.edu.ph address.');
      return;
    }
```
#### **Sex RadioGroup Choice**
The second input requires what the Sex of the student is, it uses two RadioGroups (2 circle chocies) to easily pick between the two.
~/src/app/components/StudentCheckIn.tsx  
```javascript
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
```
#### **College Program Dropdown**
The last input field is a dropdown menu that makes the student pick their assigned college program (16 choices).
~/src/app/components/StudentCheckIn.tsx  
```javascript
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
```
Notice how the Selectcontent was a .map function, this was imported from a seperate file where all the college programs were labeled.  
```javascript
import { COLLEGE_PROGRAMS, AttendanceRecord } from '@/lib/attendance';
```
attendance.ts
```javascript
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
```
### **The handlesubmit function**  
configures all the data for the backend sending which occurs after the student presses 'Check in now' (or checks if there are any errors on the db or inputs).  
If successful, inputs the given values and adds a random ID number; along with the date it was sent.   
~/src/app/components/StudentCheckIn.tsx  
```javascript
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
      const recordId = Math.random().toString(36).substring(2, 11);
      const attendanceRef = doc(firestore, 'attendanceRecords', recordId);
      
      const recordData: AttendanceRecord = {
        id: recordId,
        studentEmail: email,
        sex: sex,
        collegeProgram: program,
        checkInDateTime: new Date().toISOString(),
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

```
If the login was successful, it returns a confirm message and prompts the student to return to the main screen to login another.   
~/src/app/components/StudentCheckIn.tsx  
```javascript
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
```
### The Admin portal tab  
The admin portal is a seperate tab that can be found on the main card component, there are two input fields required to login.  
- **Email and Password input**
In contrast to the main student login, it no longer checks for the institional email despite the placeholder saying so, it just prioritizes a defined email and password for the login.  
PreDefined Values (these can be changed):  
<details>
  <summary>Admin Password</summary>
  
   ```javascript
  const PREDEFINED_ADMIN = 'admin@neu.edu.ph';
  const PREDEFINED_PASS = 'adminPassword';
  ```
  
</details>  

Firebase has an imported method for authorization within logins.  
```javascript
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
```
If the auth does not recognize the predefined values, it will just place an error message denying the login attempt.  
~/src/app/components/AdminLogin.tsx  
```javascript
if (email !== PREDEFINED_ADMIN || password !== PREDEFINED_PASS) {
      setStatus('error');
      setErrorMessage('Access denied. Please use the predefined administrator credentials.');
      return;
    }
    ...
 if (error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        setErrorMessage('The password you entered is incorrect for this administrator account.');
      } else {
        setErrorMessage(error.message || 'An unexpected error occurred. Please check your connection.');
      }
```
If the login succeeds and all conditionals of denial are not met, it will route the user to the adminDashboard.  
~/src/app/components/AdminLogin.tsx 
```javascript
router.push('/admin/dashboard');
```

### Admin Dashboard
A final check takes place when someone enters the address without proper authorization.   
~src/app/admin/dashboard/page.tsx  
```javascript
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
```
The Admin Dashboard shows the data within charts based on 'Attendance.ts' file and the intial data inserted based from the login screen.  

### The Dashboard Charts  

These 3 charts show the login data in a quantitative form, all thanks to the imported 'DashBoardCharts' which styled and made the charts possible.    
These are the records being instantizated within these imports.  
```javascript
import DashboardCharts from '@/components/DashboardCharts';
...
 {/* Charts Section */}
        <DashboardCharts records={attendanceList} />
```

#### Sex Distribution Chart
The chart shows the amount of students that are male or female that are logged in within the system, uses a stylized pie chart.  
~/src/components/DashboardCharts.tsx  
```javascript
 {/* Sex Distribution */}
      <Card className="border-primary/10 shadow-md">
        <CardHeader>
          <CardTitle className="font-headline text-xl text-primary">Gender Split</CardTitle>
          <CardDescription>Ratio of male to female students.</CardDescription>
        </CardHeader>
        <CardContent className="h-96 flex flex-col items-center justify-center">
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
```
#### College Program Distribution Chart
Shows the amount of students that within a specific college Program (out of the 16) that are logged in within the system, uses a standard bar chart.  
~/src/components/DashboardCharts.tsx  
```javascript
 {/* College Program Distribution - Showing all programs */}
      <Card className="lg:col-span-2 border-primary/10 shadow-md">
        <CardHeader>
          <CardTitle className="font-headline text-xl text-primary">Participation by Program</CardTitle>
          <CardDescription>Comprehensive comparison of attendance across all university colleges.</CardDescription>
        </CardHeader>
        <CardContent className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={programData} layout="vertical" margin={{ left: 40, right: 20 }}>
              <XAxis type="number" hide />
              <YAxis 
                type="category" 
                dataKey="name" 
                width={120}
                tick={{fontSize: 10, fill: 'hsl(var(--muted-foreground))'}}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip 
                cursor={{fill: 'rgba(47, 95, 47, 0.05)'}}
                contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}}
              />
              <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={15}>
                {programData.map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
```
#### Time Trends Chart
Shows the times by categories of Hour, Days, Month, Year. Slightly hierarchical between days to years, but hours applies all the days as to see a trending hour of login despite the day.  
~/src/components/DashboardCharts.tsx  
```javascript
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
```
### Recent Activity Table  
The Recent Activity Table shows the data of the most recent logged students as to see legitimate data within a table form, seperate into 5 columns: [Email, Sex, College Program, Date & Time, Status].     
~src/app/admin/dashboard/page.tsx 
```javascript
         <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50 border-primary/10">
                  <TableHead className="font-bold">Student Email</TableHead>
                  <TableHead className="font-bold">Sex</TableHead>
                  <TableHead className="font-bold">College Program</TableHead>
                  <TableHead className="font-bold">Date & Time</TableHead>
                  <TableHead className="text-right font-bold">Status</TableHead>
                </TableRow>
              </TableHeader>
```
If there are no records found, it should display the message 'No attendance records found' on the table.  
```javascript
                {attendanceList.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                      No attendance records found.
                    </TableCell>
                  </TableRow>
```
Else, it should display the mentioned columns and their data.  
In the Sex column, Male and Female have their own seperate badges for styling. Date formatting is enabled for the date column. And the Status will always be Present with a green badge; All other columns are normally displayed.  
```javascript
 attendanceList.map((record) => (
                    <TableRow key={record.id} className="border-primary/5 hover:bg-accent/5">
                      <TableCell className="font-medium font-body">{record.studentEmail}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={record.sex === 'Male' ? 'border-blue-200 text-blue-700 bg-blue-50' : 'border-pink-200 text-pink-700 bg-pink-50'}>
                          {record.sex}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-body text-muted-foreground">{record.collegeProgram}</TableCell>
                      <TableCell className="font-body text-sm">
                        {new Date(record.checkInDateTime).toLocaleDateString()} {new Date(record.checkInDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge className="bg-primary hover:bg-primary/90">Present</Badge>
                      </TableCell>
                    </TableRow>
```
### Other Dashboard Elements  
Other elements within the dashboards are summary information about the data.  
- This card shows the total amount of students that are logged within the database.  
```javascript
            <CardContent>
              <div className="text-2xl font-bold">{attendanceList.length}</div>
              <p className="text-xs text-muted-foreground">Real-time total</p>
            </CardContent>
```
- This Card element shows the admin's email  
```javascript
<CardContent>
              <div className="text-xl font-bold truncate">Administrator</div>
              <p className="text-xs text-muted-foreground">{user?.email}</p>
</CardContent>
```
- This Card Element checks if there are any entries on the database. If there's none, its labeled 'No entries'. If there is, the label states: 'Recently'  
```javascript
  <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Latest Entry</CardTitle>
              <CalendarIcon className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{attendanceList.length > 0 ? 'Recently' : 'No entries'}</div>
              <p className="text-xs text-muted-foreground">Auto-updating</p>
            </CardContent>
```
All other card elements are for design purposes which fills the white space.  
- Database Status
```javascript
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Status</CardTitle>
              <Clock className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Active</div>
              <p className="text-xs text-muted-foreground">Database connected</p>
            </CardContent>
```







