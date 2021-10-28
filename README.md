
# Colloquy

Colloquy is a multipeer chat and video web application. This web
application allows the users to text chat, video call other users,
form groups and much more.


![Logo](https://nikhilprojects.s3.us-west-1.amazonaws.com/colloquy/logo.png)


## Live Demo

The web application is hosted on: https://colloquy-app.netlify.app/

## Features

- Multipeer video call.
- Text chat with individual users or in a group.
- Users can create groups and add other users.
- Send images to other users
- View other users' profiles.
- Edit status.
- Google and Facebook Sign in.


## Tech Stack

**Frontend:** React, WebRTC, TailwindCSS

**Backend:** Firebase(Authentication, Firestore and Cloud Storage)


## Screenshots

![App Screenshot](https://nikhilprojects.s3.us-west-1.amazonaws.com/colloquy/screenshots/colloquy_login.png)

![App Screenshot](https://nikhilprojects.s3.us-west-1.amazonaws.com/colloquy/screenshots/colloquy_incomingcall.png)

![App Screenshot](https://nikhilprojects.s3.us-west-1.amazonaws.com/colloquy/screenshots/colloquy_videocall.png)

![App Screenshot](https://nikhilprojects.s3.us-west-1.amazonaws.com/colloquy/screenshots/colloquy_dashboard.png)

![App Screenshot](https://nikhilprojects.s3.us-west-1.amazonaws.com/colloquy/screenshots/colloquy_dashboard2.png)

![App Screenshot](https://nikhilprojects.s3.us-west-1.amazonaws.com/colloquy/screenshots/colloquy_creategroup.png)

![App Screenshot](https://nikhilprojects.s3.us-west-1.amazonaws.com/colloquy/screenshots/colloquy_sendimage.png)

![App Screenshot](https://nikhilprojects.s3.us-west-1.amazonaws.com/colloquy/screenshots/colloquy_userprofile.png)

![App Screenshot](https://nikhilprojects.s3.us-west-1.amazonaws.com/colloquy/screenshots/colloquy_newchat.png)

![App Screenshot](https://nikhilprojects.s3.us-west-1.amazonaws.com/colloquy/screenshots/colloquy_addtogroup.png)
## Run Locally

Clone the project

```bash
  git clone https://github.com/nikhiilll/Colloquy.git
```

Go to the project directory and install dependencies

```bash
  npm install
```

Add your firebase project config in the firebase config file located at /src/firebase.js. 
Then start the client dev server

```bash
  npm run start
```

