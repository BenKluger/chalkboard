355 Term Project: Ben and Amna

Website Link: https://chalkboard-amnaben.herokuapp.com/

- Chapters:
  - Sitemap

Followed this video to implement Login and registering a user: https://www.youtube.com/watch?v=b91XgdyX-SM
Used this video to understand how MongoDB works with Node.js: https://www.youtube.com/watch?v=bxsemcrY4gQ
Used this video to understand MongoDB, and used a similar video in the playlist for website jwt user authentication: https://www.youtube.com/watch?v=bxsemcrY4gQ&t=828s
Used this video for general backend knowledge: https://www.youtube.com/watch?v=-RCnNyD0L-s&t=1485s

TODO:

- Fix JWT_Secret so that it is in the .env file
- Set up chapters
- ~~Fix footer collapsable text~~
- ~~RUN THRU BOTH VALIDATORS~~
- ~~Edit sign up page~~
- ~~Remove button from sidebar~~
- ~~Remove logo from mini sidebar~~
- ~~Change assignments section in students so that it brings you to a random page, rather than clicking on the preview of assignments. Copy code from Instructer Section for layout.~~
- ~~Fix buttons so that they are all clickable within the button "space", rather than just the text~~

Small TODO:

- Choose File button on assignmentPageST.html is wonky
- Search field + button allignment
- ~~Confirm links work to proper places~~
- ~~Confirm everything follows consistent format of "CSCI"~~
- ~~Textbox not aligned with buttons~~
- ~~Consider adding floating # buttons by each static text "link"~~
- ~~Make assignments in grades to link to actual assignments?~~
- ~~Consider changing layout of Available Courses in both St and Ins~~
- ~~Make sure all buttons have class = "btn btn-info"~~
- ~~Figure out fix for buttons remaining darkened after being clicked - see sidebar hamburger for example~~
- ~~ChalkBoard or Chalkboard? Official name is Blackboard~~

# Course Web Application

### Project Link

https://chalkboard-amnaben.herokuapp.com/

## Website Functions

Register a user as a student or an admin:
![image](https://user-images.githubusercontent.com/69221395/144550656-bbfbbd7e-9e91-4afd-86d6-63054adbaf9b.png)








## Wireframe

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
