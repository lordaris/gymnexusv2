# gymNEXUS
## Description
A web app for coaches to create and assign routines to their clients. 
The clients can then view their routines. 
The difference between the previous version and this one is that this is made entirely using nextjs only (because it made no sense to have a backend with express if I was using nextjs.) Even though, I'll complete the project using NextJS only and the other version will be deprecated or used only for educational purposes. 

## Table of Contents
* [Installation](#installation)
* [Features and usage](#features-and-usage)
* [Technologies](#technologies)
* [TODO List](#todo-list)

## Installation
1. run `npm install` to install all dependencies 
2. create a .env.local file in the root folder and add the following variables:
   * JWT_SECRET = "your secret"
   * MONGODB_URI = "your mongo uri"
   * NEXT_PUBLIC_API_URL = "your API URL"

3. start by running `npm run dev` inside the root folder
4. go to localhost:3000 to view the app

## Features and usage
* Passwords are hashed using bcrypt-js
* Login and logout
* JWT authentication
* Create a coach account (this can be made in the main page by hitting the "I am new" button)
* Create a client account (Each coach can create a client account by going to the "Clients" page and hitting the "Create" button)
* Create, read, update and delete a routine. The page supports adding days to workouts and exercises to days. 
* Workout routines have a name, a list of days, each day have a day name, focus and a list of exercises, and each exercise have a name, sets, reps, cadence and notes. 
* Assign a routine to a client (this can be done by hitting the "Clients" button, selecting a client and hitting the "Assign workout" button)
* Each client has a list of assigned workouts, listed in the "Clients" dashboard.

## Technologies
* Next.js
* MongoDB Atlas

## TODO List
- [ ] Replace alerts with modals
- [ ] Check and clean style consistency
- [ ] Possibly, add a cron to cut the use of the app to users who haven't made the payment.
- [ ] Add a function to avoid screenshots
- [ ] Add "general notes" entry for workouts
- [ ] Replace Notes field with a textarea field
- [ ] Replace success alerts with toasts 
- [ ] Add a paid sign up feature
- [ ] Add a confirmation email feature
- [ ] Add a "Forgot username" feature
- [ ] Add a "Forgot password" feature
- [ ] Add metrics for the users to track their progress (weight, measurements and so on)
- [ ] Improve the UI
- [X] Make the app responsive
- [ ] Improve the UX
- [ ] Improve the security of the app
- [ ] Improve the code, maybe using a repository pattern or SOLID principles which will make the code more readable and easier to maintain


