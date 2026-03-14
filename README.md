# NEULib Scan - Library attendance system with dashboard
**NEULib Scan is an attendance web app intended for keeping track of the students that utilize the university's library.**  

An attendance web app that records NEU institional emails along with their gender and college program.  
It is intended for recording attendances within a site, supposedly from stationary computers within the library students can see and be insisted to fill up.

### *NEULib Scan Login Screen*
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/ed88f746-c3fb-4c87-9691-4184a0eba236" />  

### NEULib Scan Admin Dashboard Screen 
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/6dea290e-5beb-4477-b739-fc5b8a352d04" />
For veiwing statistics of student attendences in the library, there is an admin panel to view these stats.  

It uses the inbuilt Firebox database (backend of firebase studio) which has real-time viewing of the data without refreshing the admin dashboard page.  
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
- Firebase (website)
- Firebox (database)

# Documentation  
*This section past this point is the documentation section, which documents and briefly explains the componenets within the web application*  

## Website Flow
*NEULIB Scan* opens right away with the login screen where students would input their email, sex, and their college program.  

### The main Login Screen

- **Email field**  
The Email field inputs a student's institutional email. Similar to an 'email' input field, it requires the email address of the school: '@neu.edu.ph' for it to be a valid input, if it doesn't it will show an error message.

~/src/app/components/StudentCheckIn.tsx
 ```javascript
 if (!email || !email.endsWith('@neu.edu.ph')) {
      setStatus('error');
      setErrorMessage('Invalid email domain. Please use your @neu.edu.ph address.');
      return;
    }
```
- **Sex RadioGroup Choice**
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
- **College Program Dropdown**
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
**The handlesubmit function** configures all the data for the backend sending which occurs after the student presses 'Check in now' (or checks if there are any errors on the db or inputs).  
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
## The admin portal tab  
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

## Admin Dashboard

