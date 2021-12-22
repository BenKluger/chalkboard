355 Term Project: Ben and Amna

Website Link: https://chalkboard-amnaben.herokuapp.com/

Followed this video to implement Login and registering a user: https://www.youtube.com/watch?v=b91XgdyX-SM
Used this video to understand how MongoDB works with Node.js: https://www.youtube.com/watch?v=bxsemcrY4gQ
Used this video to understand MongoDB, and used a similar video in the playlist for website jwt user authentication: https://www.youtube.com/watch?v=bxsemcrY4gQ&t=828s
Used this video for general backend knowledge: https://www.youtube.com/watch?v=-RCnNyD0L-s&t=1485s



# Course Web Application

### Project Link

https://chalkboard-amnaben.herokuapp.com/

## Website Functions

- General functionality
  - Login will only work if the proper email/password/user type is selected, on an already registered account
  - JWT is used to ensure the correct user is signed in to access pages, otherwise they will be redirected to the login page
  - Signing out will delete the JWT token, so users must log out in order to restart their session
  - Only specific user types can access that user type's pages (e.g. student accounts can only access student pages when logged in)

- Technologies used:
  - Frontend: HTML, Bootstrap, Javascript, ejs
  - Backend: MongoDB, Node.js, Mongoose, Express, bcyrpt, ejs, cookie-parser,jsonwebtoken, nodemon


### Index Pages
- Register a user as a student or an instructor (with validation):
![image](https://user-images.githubusercontent.com/69221395/144550717-4268f429-97d0-4764-ac90-bd659afa2a59.png)

- Login as a student, instructor, or an admin (with user validation):
![image](https://user-images.githubusercontent.com/69221395/144550839-1c073cc6-6620-44a6-8db4-7c4a1020711f.png)


### Admin Section
- View all created users and their information (not including passwords)
- General functionality (accessed within dummy pages - this will be accessible in a future deliverable)
  - Ability to view more detailed information for instructors and students than in the users tab
  - Ability to view all available courses


### Student Section
- View student's courses

![image](https://user-images.githubusercontent.com/69221395/144551013-abac43a7-c3cc-4b77-84a8-89f6bbb558df.png)

- View all available courses
![image](https://user-images.githubusercontent.com/69221395/144551047-994beeab-2557-4da0-973d-e62cd4325605.png)


- Ability to register for a course

![image](https://user-images.githubusercontent.com/69221395/146998750-102b3b39-a0e1-4bcc-9983-11ba892625b8.png)
![image](https://user-images.githubusercontent.com/69221395/146998781-b31f7064-08f3-4c8c-9834-4b44cfe0be19.png)
![image](https://user-images.githubusercontent.com/69221395/146998962-60bb87eb-e249-4465-8625-bf4af77f04a7.png)

- Ability to submit/save drafts of assignments
![image](https://user-images.githubusercontent.com/69221395/146999013-4ab53f6f-13d7-4a1a-b287-e57cb0a0a327.png)

- Ability to view grades


- Ability to search for a course within the available courses



### Instructor Section
- View courses that the instructor is registered for
![image](https://user-images.githubusercontent.com/69221395/144551148-baef8ebd-8647-408f-b343-97e84d4e2fbd.png)

- View all available courses
![image](https://user-images.githubusercontent.com/69221395/144551190-846cb78c-9c6a-4e0d-8392-0bb6de261e26.png)

- Create a course
![image](https://user-images.githubusercontent.com/69221395/144551252-d16359a2-a9ed-4d63-9c39-5c08e84ab466.png)

- Ability to edit courses
![image](https://user-images.githubusercontent.com/69221395/146999137-d4125984-4879-4cf7-b724-ae7a35a9efe1.png)
![image](https://user-images.githubusercontent.com/69221395/146999184-b6c62757-b7e4-4ad6-be30-c58a3c3aac2a.png)

- Ability to create assignments for a course

![image](https://user-images.githubusercontent.com/69221395/146999256-09517826-02e5-472e-bb16-a3d1f8647e3c.png)
![image](https://user-images.githubusercontent.com/69221395/146999350-33aea074-5e9a-46cb-a7e6-c71752b030b7.png)



- Ability to accept or reject new students who have signed up for the instructor's course
![image](https://user-images.githubusercontent.com/69221395/146998897-2559d4f1-2480-4b64-8651-50c054c4874f.png)
![image](https://user-images.githubusercontent.com/69221395/146998910-9807f5a6-2933-4e0e-84dd-94391c959e26.png)





- General functionality (accessed within dummy pages - this will be accessible in a future deliverable)
  - Ability to grade submitted assignments, as well as allow resubmission
  - Ability to search for a course within the available courses








## Wireframe

Difference between wireframe/sitemap and final website structure:
  Overall they were much the same, with few differences - namely, an extra one or two intermediary pages between two sections of the website, such as going between "My Courses" to finally creating an assignment.

###### Desktop:

A "Sign up" page was not included in the wireframe, but will be included in the actual website.

Student's View Wireframe: ![image](https://user-images.githubusercontent.com/69221395/136123911-8f98deee-92cc-4fdb-907d-9c39a003b07d.png)

Instructor's View Wireframe: ![image](https://user-images.githubusercontent.com/69221395/136847799-ae5ff18a-c17f-4b45-ae96-dd5b75e46383.png)

Administrator's View Wireframe: ![image](https://user-images.githubusercontent.com/69221395/136679780-b61783c6-9f8d-48e7-a119-d9a6da3ff7c0.png)

###### Mobile:

Similar to the Desktop Wireframe, just with resized windows

## Sitemap

![image](https://user-images.githubusercontent.com/69221395/135781005-1d463fcc-f880-4ede-b46f-e6e83acbd8c7.png)

## What we learned while making the Sitemap/Wireframe

- Ben:

  - I learned how to design a website from the ground up - how the linking structure works (sitemap), and how to represent the example user view with a wireframe. Amna and I created the basic functionality/structure of our website in the "Other Information" section below, then worked on the sitemap and wireframe together. I drew the sitemap and Student's view for the wireframe, Amna drew the Instructor's and Admin's view in the wireframe.

- Amna:
  - There was plenty to learn from this process of making a site map and wireframes. I realized how many different web pages there are in a single seemingly website and how many different parts/ sections there are. I learned how to create site maps and wireframes and why they’re a crucial part of building a website. Ben and I discussed how we want our website to work and wrote a written outline of it. Ben drew the site map and the a part of the wireframes while I worked on the remaining wireframes.

## Other information

Step 1 For the overall website design:
Start page --> login page: Gives you option for Student, Professor, Admin --> Home Page

Overall structure:
Tabs on left

Admin Home Page gives Tabs for: Database version Excel Sheet (Work on later)

Home Page Student:
On the tab on left side, two options: "My Courses" and "Courses Available"

My Courses: --> If accepted, click and bring you to page where you can Maybe bring to course dashboard (see view of the class, plus) --> Hit grades button to see grades and feedback for an assignment, and also a link to assignments --> Assignments page:
Question, blank paragraph spot for student to write things, as well as a button for uploading docs. Submit button at the end (Marks assignment as done), plus a Save Draft button.

(Prof can see Save Draft and Submitted files)

Courses Available: List of courses available + Search bar, click on a course and it pulls up the description, then there will be a button to apply

Home Page Instr:

On the tab on left side, Three options: "Create Course", "My Courses" and, "Courses Available"

Create a course PAGE --> New Page: Fill out the fields for: Course name + number, Instructor Name, Description, Materials (Menu of videos, books needed, readings), button to add a new assignment, as well as upload an answer key to the assignment.

(a unique number
a course name
a non-empty set of instructors
a roster of students
a description
a sequence of lessons)

Maybe make edit functionality, that brings you back to submission form and lets you continue from where you left off when making the course.

Button inside Course page that has a table list of Instructors added to the course. Plus sign to add a new instructor, minus to delete instructor.

My Courses page:

- Prof can see all assignments. Click on an assignment brings you to a page where you have a list of students who have submissions, as well as a tab for a list of all students enrolled in the course, at the bottom there will be a section for students who applied for the course, and you can hit approve or reject for those students. The main tab (Submissions Tab) you can see a list of students who have submissions. Clicking that brings you to a new page that shows the submission (from a given student, whether draft or full submission, and there will be a small title if draft or not). There will be several buttons. One pulls up the answer key associated with the assignment. Each question has two buttons next to it, a check and an x, that the prof can click. At the bottom of each Assignment Page, there is a Feedback text box as well as a Grade [0/100] Textbox Range. Make a button on the top right of page that Deletes the users submission, and allows them to resubmit.

Footer is always there, and it gives a contact page, which has both Amna’s and Ben’s emails and GitHub links
