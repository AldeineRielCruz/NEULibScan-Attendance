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
*The site only opens when a computer has access to the workspace as it hasn't reached proper hosting, hence why it might be down in specific times.*   

**You can also clone the repository and run this locally using the "Firebase Local Emulator Suite"; refer to this link after cloning the repo:**    
[Install, configure and integrate Local Emulator Suite](https://firebase.google.com/docs/emulator-suite/install_and_configure)

## The Website was made with the following frameworks: 
- NextJs
- React
- Lucide React
- Tailwind CSS
- Firebase (website)
- Firebox (database)

## Documentation  
*This section past this point is the documentation section, which documents and briefly explains the componenets within the web application*
## BackEnd Schema
