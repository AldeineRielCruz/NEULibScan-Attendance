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

### The three input/form fields  

- **Email field**  
The Email field inputs a student's institutional email. Similar to an 'email' input field, it requires the email address of the school: '@neu.edu.ph' for it to be a valid input, if it doesn't it will show an error message.

 ```javascript
 if (!email || !email.endsWith('@neu.edu.ph')) {
      setStatus('error');
      setErrorMessage('Invalid email domain. Please use your @neu.edu.ph address.');
      return;
    }
```
- **Sex RadioGroup Choice**
The second input requires what the Sex of the student is, it uses two RadioGroups (2 circle chocies) to easily pick between the two.  
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
```
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
Notice the content is a .map function, this was imported from a seperate file where all the college programs were labeled.  
```
import { COLLEGE_PROGRAMS, AttendanceRecord } from '@/lib/attendance';
```
attendance.ts
```
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

