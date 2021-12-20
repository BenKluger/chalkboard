// Load Node Modules
const express = require("express");
const favicon = require('serve-favicon')
require("dotenv").config();
const PORT = process.env.PORT || "8080";
const dbURI = process.env.mongodb_URI;
const JWT_SECRET = process.env.JWT_SECRET;
const ejs = require("ejs");
const mongoose = require("mongoose");
const User = require("./model/user");
const Course = require("./model/course");
const Assignment = require("./model/assignment");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const { requireAuth } = require("./middleware/authMiddleware");

// Initialize Express
const app = express();
app.use(favicon(__dirname + '/public/img/favicon.ico'));

mongoose
  .connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((result) => {
    console.log("connected to db");
    console.log(PORT);
    app.listen(PORT);
  })
  .catch((err) => console.log(err));

// Render Static Files
app.use(express.static("public"));

app.use(express.json());
//cookie
app.use(cookieParser());

// Set the view engine to ejs
app.set("view engine", "ejs");

// Port website will run on
// *** GET Routes - display pages ***

/////////////////////////////// ADMIN ROUTES
app.get("/adminHome", requireAuth('admin'), function (req, res) {
  User.find()
    .then((result) => {
      res.render("pages/Admin/adminHomePage", { users: result });
    })
    .catch((err) => {
      console.log(err);
    });
});

app.get("/users", requireAuth('admin'), function (req, res) {
  User.find().sort({"lastname": 1, "usertype": 1})
    .then((result) => {
      res.render("pages/Admin/usersDB", { users: result });
    })
    .catch((err) => {
      console.log(err);
    });
});

///////////////////////////// INSTRUCTOR ROUTES
app.get("/instructorHome", requireAuth('instructor'), function (req, res) {
  let userfullname = req.cookies.fullname;
  Course.find({Instructors: userfullname})
    .then((result) => {
      res.render("pages/Instructor/instructorHomePage", { courses: result });
    })
    .catch((err) => {
      console.log(err);
    });
});

app.get("/availCoursesIN", requireAuth('instructor'), function (req, res) {
  Course.find().sort({"CourseNum": 1})
    .then((result) => {
      res.render("pages/Instructor/availCoursesIN", { courses: result });
    })
    .catch((err) => {
      console.log(err);
    });
});


////////////////// Course pages specifically for My Courses
app.post("/coursePageIN", (req, res) => {
  const { CourseID } = req.body;
  res.json({ status: "ok", url: `/coursePageIN/${CourseID}`, CourseID: CourseID });
});

app.get("/coursePageIN/:course", requireAuth('instructor'), function (req, res){
  let input = req.params.course;
  res.cookie("courseid", input);
  Course.findOne({ CourseID: input})
    .then((result) => {
      res.render("pages/Instructor/coursePageIN", { course: result });
    })
    .catch((err) => {
      console.log(err);
    });
});

//////////////////////////////////// Assignments Dashboard Instructors View

app.get("/assignmentsPage", function (req, res){
  let course = req.cookies.courseid;
  Course.findOne({ CourseID: course})
    .then((result) => {
      res.render("pages/Instructor/assignmentsDB", { course: result });
    })
    .catch((err) => {
      console.log(err);
    });
})

app.get("/createAssignment", function (req, res){
  res.render("pages/Instructor/createAssignment")
})


//////////////// Course Description Page for all available courses
app.post("/coursedetailsIN", (req, res) => {
  const { CourseID } = req.body;
  res.json({ status: "ok", url: `/coursedetailsIN/${CourseID}`, CourseID: CourseID });
});

app.get("/coursedetailsIN/:course", requireAuth('instructor'), function (req, res){
  let input = req.params.course;
  Course.findOne({ CourseID: input})
    .then((result) => {
      res.render("pages/Instructor/courseXpage", { course: result });
    })
    .catch((err) => {
      console.log(err);
    });
});
app.get("/updateCourse/:course", requireAuth('instructor'), function (req, res) {
  let input = req.params.course;
  Course.findOne({ CourseID: input})
    .then((result) => {
      res.render("pages/Instructor/filledCourse", { course: result });
    })
    .catch((err) => {
      console.log(err);
    });
});

app.get("/createCourse", requireAuth('instructor'), function (req, res) {
  res.render("pages/Instructor/createCourse");
});

////////////////////////////// STUDENT ROUTES
app.get("/availCoursesST", requireAuth('student'), function (req, res) {
  res.render("pages/Student/availCoursesST");
});

app.get("/studentHome", requireAuth('student'), function (req, res) {
  res.render("pages/Student/studentHomePage");
});

///////////////////////////// OTHER ROUTES
//Log in / Register pages
app.get("/login", function (req, res) {
    res.cookie("jwt", "", { maxAge: 1 });
    res.cookie("usertype", "", { maxAge: 1 });
    res.cookie("fullname", "", { maxAge: 1 });
    res.render("pages/login");
});
app.get("/register", function (req, res) {
    res.cookie("jwt", "", { maxAge: 1 });
    res.cookie("usertype", "", { maxAge: 1 });
    res.cookie("fullname", "", { maxAge: 1 });
    res.render("pages/register");
});

// Logout Route
app.get("/logout", (req, res) => {
  res.cookie("jwt", "", { maxAge: 1 }); //overwrite the current jwt
  res.cookie("usertype", "", { maxAge: 1 });
  res.cookie("fullname", "", { maxAge: 1 });
  res.redirect("/");
});

// Root Route
app.get("/", function (req, res) {
    res.cookie("jwt", "", { maxAge: 1 });
    res.cookie("usertype", "", { maxAge: 1 });
    res.cookie("fullname", "", { maxAge: 1 });
    res.render("pages/index");
});

// *** POST Routes

app.post("/login", async (req, res) => {
  const { email, password, usertype } = req.body;
  const user = await User.findOne({ email }).lean();
  if (!user) {
    return res.json({
      status: "error",
      error: "Invalid user credentials",
      url: "/login",
    });
  }
  if (await bcrypt.compare(password, user.password)) {
    if (usertype == user.usertype) {
      // the username, password combination is successful
      const token = jwt.sign(
        {
          id: user._id,
          email: user.email,
          usertype: user.usertype,
        },
        JWT_SECRET
      );
      let userUrl;
      if (usertype == "student") {
        userUrl = "/studentHome";
      } else if (usertype == "instructor") {
        userUrl = "/instructorHome";
      } else if (usertype == "admin") {
        userUrl = "/adminHome";
      }
      
      console.log(user)
      const userfullName = user.fullname;
      console.log(userfullName);
      console.log('token', token)
      res.cookie("jwt", token, { httpOnly: true });
      res.cookie("usertype", usertype);
      res.cookie("fullname", userfullName);
      return res.json({ status: "ok", user: user._id, url: userUrl });
    }
  } 
  //if email is correct but password is wrong
  res.json({
    status: "error",
    url: "/login",
    error: "Invalid user credentials",
  });
});

app.post("/register", async (req, res) => {
  const {
    firstname,
    lastname,
    fullname,
    email,
    password: plainTextPassword,
    usertype,
  } = req.body;
  const password = await bcrypt.hash(plainTextPassword, 10);

  try {
    const response = await User.create({
      firstname,
      lastname,
      fullname,
      email,
      password,
      usertype,
    });
    console.log("User created successfully: ", response);
  } catch (error) {
    if (error.code === 11000) {
      return res.json({
        status: "error",
        error: "This email has already been used",
        url: "/register",
      });
    }
  }
  // console.log('User created successfully:', response)
  res.json({ status: "ok", url: "/login" });
});

///////////////////////////////// Create a course POST Method ///////////////////////////
app.post("/newCourse", async (req, res) => {
  const {
    CourseNum,
    CourseName,
    CourseCredits,
    CourseDescription,
    CourseMaterials,
    Instructors
  } = req.body;

  var CourseID = Date.now();
  try {
    const response = await Course.create({
      CourseNum,
      CourseName,
      CourseID,
      CourseCredits,
      CourseDescription,
      CourseMaterials,
      Instructors
    });
    console.log("Course created successfully: ", response);
  } catch (error) {
    console.log(error)
  }
  res.json({ status: "ok", url: "/availCoursesIN" });
});


app.post("/editCourse", async (req, res) => {
  const {
    CourseID,
    CourseNum,
    CourseName,
    CourseCredits,
    CourseDescription,
    CourseMaterials,
    Instructors
  } = req.body;

  console.log(CourseID)
  try {

    Course.updateOne({"_id": CourseID}, {
      "CourseNum": CourseNum,
      "CourseName": CourseName,
      "CourseCredits": CourseCredits,
      "CourseDescription": CourseDescription,
      "CourseMaterials": CourseMaterials,
      "Instructors": Instructors
    }, function(err, result){
      if(err){
        res.send(err)
      }
      else{
        console.log("Course updated successfully: ", result);
      }
    })
    
  } catch (error) {
    console.log(error)
  }
  res.json({ status: "ok", url: "/availCoursesIN" });
});

