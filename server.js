// Load Node Modules
const express = require("express");
const favicon = require("serve-favicon");
require("dotenv").config();
const PORT = process.env.PORT || "8080";
const dbURI = process.env.mongodb_URI;
const JWT_SECRET = process.env.JWT_SECRET;
const ejs = require("ejs");
const mongoose = require("mongoose");
const User = require("./model/user");
const Course = require("./model/course");
const Submission = require("./model/assignmentsubmission");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const { requireAuth } = require("./middleware/authMiddleware");

// Initialize Express
const app = express();
app.use(favicon(__dirname + "/public/img/favicon.ico"));

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
app.get("/adminHome", requireAuth("admin"), function (req, res) {
  User.find()
    .then((result) => {
      const userResult = result;
      Submission.find().then((result) => {
        const submissionResult = result;
        Course.find().then((result) => {
          console.log(result);
          const courseResult = result;
          //Course.assignments.find().then((result) => {
          res.render("pages/Admin/adminHomePage", {
            users: userResult,
            submission: submissionResult,
            course: courseResult,
            //assignment: result,
            //});
          });
        });
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

////////////Path for full User list
app.get("/users", requireAuth("admin"), function (req, res) {
  User.find()
    .sort({ lastname: 1, usertype: 1 })
    .then((result) => {
      res.render("pages/Admin/usersDB", { users: result });
    })
    .catch((err) => {
      console.log(err);
    });
});

////////////Path for full Submission list
app.get("/submissionList", requireAuth("admin"), function (req, res) {
  Submission.find()
    .sort({ username: 1 }) //, usertype: 1
    .then((result) => {
      res.render("pages/Admin/submissionsDB", { submission: result });
    })
    .catch((err) => {
      console.log(err);
    });
});

////////////Path for full course list
app.get("/courseList", requireAuth("admin"), function (req, res) {
  Course.find()
    .sort({ CourseName: 1 }) //, usertype: 1
    .then((result) => {
      res.render("pages/Admin/courseDB", { course: result });
    })
    .catch((err) => {
      console.log(err);
    });
});

///////////////////////////// INSTRUCTOR ROUTES
app.get("/instructorHome", requireAuth("instructor"), function (req, res) {
  let userfullname = req.cookies.fullname;
  Course.find({ Instructors: userfullname })
    .then((result) => {
      res.render("pages/Instructor/instructorHomePage", { courses: result,
      user: userfullname });
    })
    .catch((err) => {
      console.log(err);
    });
});

app.get("/availCoursesIN", requireAuth("instructor"), function (req, res) {
  Course.find()
    .sort({ CourseNum: 1 })
    .then((result) => {
      res.render("pages/Instructor/availCoursesIN", { courses: result });
    })
    .catch((err) => {
      console.log(err);
    });
});

app.post("/updateEnrollmentAccept", async (req, res) => {
  const { studentName } = req.body;
  const course = req.cookies.courseid;
  try {
    const response = await Course.findOne({ CourseID: course });
    console.log("response", response);
    console.log(studentName);
    response.Students.push(studentName);
    response.studentRequests.pull(studentName);
    await response.save();
    console.log("Student enrolled successfully: ", response);
  } catch (error) {
    console.log(error);
  }
  res.json({ status: "ok", url: `/coursePageIN/${course}` });
});
app.post("/updateEnrollmentReject", async (req, res) => {
  const { studentName } = req.body;
  const course = req.cookies.courseid;
  try {
    const response = await Course.findOne({ CourseID: course });
    console.log("response", response);
    console.log(studentName);
    response.studentRequests.pull(studentName);
    await response.save();
    console.log("Student rejected successfully: ", response);
  } catch (error) {
    console.log(error);
  }
  res.json({ status: "ok", url: `/coursePageIN/${course}` });
});

////////////////// Course pages specifically for My Courses
app.post("/coursePageIN", (req, res) => {
  const { CourseID } = req.body;
  res.json({
    status: "ok",
    url: `/coursePageIN/${CourseID}`,
    CourseID: CourseID,
  });
});

app.get(
  "/coursePageIN/:course",
  requireAuth("instructor"),
  function (req, res) {
    let input = req.params.course;
    res.cookie("courseid", input);
    Course.findOne({ CourseID: input })
      .then((result) => {
        res.render("pages/Instructor/coursePageIN", { course: result });
      })
      .catch((err) => {
        console.log(err);
      });
  }
);

//////////////////////////////////// Assignments Dashboard Instructors View

app.get("/assignmentsPage", requireAuth("instructor"), function (req, res) {
  let course = req.cookies.courseid;
  Course.findOne({ CourseID: course })
    .then((result) => {
      res.render("pages/Instructor/assignmentsDB", { course: result });
    })
    .catch((err) => {
      console.log(err);
    });
});

app.get("/createAssignment", requireAuth("instructor"), function (req, res) {
  let course = req.cookies.courseid;
  Course.findOne({ CourseID: course })
    .then((result) => {
      res.render("pages/Instructor/createAssignment", { course: result });
    })
    .catch((err) => {
      console.log(err);
    });
});

app.post("/createAssign", async (req, res) => {
  const { assignmentName, questions, answers } = req.body;
  var assignmentId = Date.now();
  let course = req.cookies.courseid;
  console.log("questions", questions);
  try {
    const response = await Course.findOne({ CourseID: course });
    response.assignments.push({
      assignmentId,
      assignmentName,
      questions,
      answers,
    });
    await response.save();
    console.log("Assignment created successfully: ", response);
  } catch (error) {
    console.log(error);
  }
  res.json({ status: "ok", url: "/assignmentsPage" });
});
//////////////////////////Submit Assignment Grade
app.post("/submitGrade", (req, res) => {
  const {
    submissionID,
    grade,
    feedback
  } = req.body;
  try {
    Submission.updateOne(
    { submissionID: submissionID },
    {
      grade: grade,
      feedback: feedback
    },
      function (err, result) {
        if (err) {
          res.send(err);
        } else {
          console.log("Grade updated successfully: ", result);
        }
      }
    );
  } 
  catch (error) {
    console.log(error);
  }
  res.json({ status: "ok", url: "/assignmentsPage" });
})
app.post("/allowResubmit", (req, res) => {
  const {
    submissionID,
    status
  } = req.body;
  try {
    Submission.updateOne(
    { submissionID: submissionID },
    {
      status: status
    },
      function (err, result) {
        if (err) {
          res.send(err);
        } else {
          console.log("Resubmission enabled successfully: ", result);
        }
      }
    );
  } 
  catch (error) {
    console.log(error);
  }
  res.json({ status: "ok"});
})




/////////////////////////View Submissions

app.post("/submissionXpage", (req, res) => {
  const { submissionID } = req.body;
  res.json({ status: "ok", url: `/submissionXpage/${submissionID}` });
});
app.get(
  "/submissionXpage/:submissionx",
  requireAuth("instructor"),
  function (req, res) {
    let submissionID = req.params.submissionx;
    Submission.findOne({ submissionID: submissionID })
      .then((result) => {
        const submissionFound = result;
        console.log("submission found", submissionFound);
        Course.findOne(
          { "assignments.assignmentId": submissionFound.assignmentID },
          {
            _id: 0,
            assignments: { $elemMatch: { assignmentId: "1" } },
            assignments: 1,
          }
        )
          .then((result) => {
            console.log("Course with Assignment", result);
            const indexx = result.assignments.findIndex(function (assignment) {
              return assignment.assignmentId == submissionFound.assignmentID;
            });
            console.log(indexx);
            res.render("pages/Instructor/studentXsubmission", {
              submission: submissionFound,
              assignment: result,
              index: indexx,
            });
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  }
);
/////////////////////////////View list of students that submitted Assignment
app.post("/viewSubmissions", (req, res) => {
  const { assignmentID } = req.body;
  console.log("assignmentID", assignmentID);
  res.json({ status: "ok", url: `/viewSubmissions/${assignmentID}` });
});
app.get(
  "/viewSubmissions/:assignment",
  requireAuth("instructor"),
  function (req, res) {
    let input = req.params.assignment;
    console.log("input", input);
    Submission.find({ assignmentID: input })
      .then((result) => {
        console.log(result);
        console.log(result[0].status);
        if (result[0].status == "Submitted" || result[0].status == "Draft") {
          res.render("pages/Instructor/assignmentXsubmissions", {
            submission: result,
          });
        } else {
          res.render("pages/Instructor/assignmentXsubmissionsNone");
        }
      })
      .catch((err) => {
        console.log(err);
      });
    // Course.findOne({'assignments.assignmentId': input}, {_id: 0, assignments: {$elemMatch: { assignmentId: '1'}}, CourseNum: 1, assignments: 1})
  }
);

/////////////////////////////////////// Page for each specific assignment page in instructor view

app.post("/assignXpage", (req, res) => {
  const { assignmentId } = req.body;
  res.json({
    status: "ok",
    url: `/assignXpage/${assignmentId}`,
    assignmentId: assignmentId,
  });
});
app.get("/assignXpage/:assign", requireAuth("instructor"), function (req, res) {
  let input = req.params.assign;
  console.log("input", input);
  Course.findOne(
    { "assignments.assignmentId": input },
    {
      _id: 0,
      assignments: { $elemMatch: { assignmentId: "1" } },
      CourseNum: 1,
      assignments: 1,
    }
  )
    .then((result) => {
      console.log(result);
      const indexx = result.assignments.findIndex(function (assignment) {
        return assignment.assignmentId == input;
      });
      res.render("pages/Instructor/assignmentXpage", {
        assign: result,
        index: indexx,
      });
    })
    .catch((err) => {
      console.log(err);
    });
});
//////////////// Course Description Page for all available courses
app.post("/coursedetailsIN", (req, res) => {
  const { CourseID } = req.body;
  res.json({
    status: "ok",
    url: `/coursedetailsIN/${CourseID}`,
    CourseID: CourseID,
  });
});

app.get(
  "/coursedetailsIN/:course",
  requireAuth("instructor"),
  function (req, res) {
    let input = req.params.course;
    Course.findOne({ CourseID: input })
      .then((result) => {
        res.render("pages/Instructor/courseXpage", { course: result });
      })
      .catch((err) => {
        console.log(err);
      });
  }
);
app.get(
  "/updateCourse/:course",
  requireAuth("instructor"),
  function (req, res) {
    let input = req.params.course;
    Course.findOne({ CourseID: input })
      .then((result) => {
        res.render("pages/Instructor/filledCourse", { course: result });
      })
      .catch((err) => {
        console.log(err);
      });
  }
);

app.get("/createCourse", requireAuth("instructor"), function (req, res) {
  res.render("pages/Instructor/createCourse");
});

////////////////////////////// STUDENT ROUTES

/////////////////////////////Save Assignment
app.post("/saveAns", async (req, res) => {
  const { assignmentID, answers, status } = req.body;
  var courseID = req.cookies.courseid;
  var username = req.cookies.fullname;
  try {
    const submission = await Submission.findOne({ assignmentID, username });
    if (!submission) {
      var submissionID = Date.now();
      const response = await Submission.create({
        submissionID,
        assignmentID,
        courseID,
        username,
        answers,
        status,
      });
      console.log("Submission created successfully: ", response);
    } else {
      Submission.updateOne(
        { assignmentID: assignmentID, username: username },
        {
          assignmentID: assignmentID,
          courseID: courseID,
          username: username,
          answers: answers,
          status: status,
        },
        function (err, result) {
          if (err) {
            res.send(err);
          } else {
            console.log("Course updated successfully: ", result);
          }
        }
      );
    }
  } catch (error) {
    console.log(error);
  }
  res.json({ status: "ok", url: "/assignmentsPageST" });
});

//////////////// Submit the Assignment
app.post("/submitAns", async (req, res) => {
  const { assignmentID, answers, status } = req.body;
  var courseID = req.cookies.courseid;
  var username = req.cookies.fullname;
  try {
    const submission = await Submission.findOne({ assignmentID, username });
    if (!submission) {
      var submissionID = Date.now();
      const response = await Submission.create({
        submissionID,
        assignmentID,
        courseID,
        username,
        answers,
        status,
      });
      console.log("Submission created successfully: ", response);
    } else {
      Submission.updateOne(
        { assignmentID: assignmentID, username: username },
        {
          assignmentID: assignmentID,
          courseID: courseID,
          username: username,
          answers: answers,
          status: status,
        },
        function (err, result) {
          if (err) {
            res.send(err);
          } else {
            console.log("Course updated successfully: ", result);
          }
        }
      );
    }
  } catch (error) {
    console.log(error);
  }
  res.json({ status: "ok", url: "/assignmentsPageST" });
});

////////////////////////// Specific Assignment Page
app.post("/assignXpagest", (req, res) => {
  const { assignmentId } = req.body;
  res.json({
    status: "ok",
    url: `/assignXpagest/${assignmentId}`,
    assignmentId: assignmentId,
  });
});
app.get("/assignXpagest/:assign", requireAuth("student"), function (req, res) {
  let input = req.params.assign;
  var username = req.cookies.fullname;
  // Course.findOne({'assignments.assignmentId': input}, {_id: 0, assignments: {$elemMatch: { assignmentId: '0'}}, CourseNum: 1, assignments: 1})
  Submission.findOne({ assignmentID: input, username: username })
    .then((result) => {
      var findSubmit = result;
      if (!findSubmit) {
        Course.findOne({ "assignments.assignmentId": input })
          .select({ assignments: { $elemMatch: { assignmentId: input } } })
          .then((result) => {
            res.render("pages/Student/assignmentXpagest", { assign: result });
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        Course.findOne({ "assignments.assignmentId": input })
          .select({ assignments: { $elemMatch: { assignmentId: input } } })
          .then((result) => {
            if (findSubmit.status == "Draft") {
              res.render("pages/Student/assignmentXpagestSaved", {
                assign: result,
                submit: findSubmit,
              });
            } else if (findSubmit.status == "Submitted") {
              res.render("pages/Student/assignmentXpagestSubmitted", {
                assign: result,
                submit: findSubmit,
              });
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    })
    .catch((err) => {
      console.log(err);
    });
});

////////////////////////// Assignment Page Students
app.get("/assignmentsPageST", requireAuth("student"), function (req, res) {
  let course = req.cookies.courseid;
  Course.findOne({ CourseID: course })
    .then((result) => {
      res.render("pages/Student/assignmentsDBst", { course: result });
    })
    .catch((err) => {
      console.log(err);
    });
});

///////////////////////// Course Pages Specifically for my courses
app.post("/coursePageST", (req, res) => {
  const { CourseID } = req.body;
  res.json({
    status: "ok",
    url: `/coursePageST/${CourseID}`,
    CourseID: CourseID,
  });
});

app.get("/coursePageST/:course", requireAuth("student"), function (req, res) {
  let input = req.params.course;
  res.cookie("courseid", input);
  Course.findOne({ CourseID: input })
    .then((result) => {
      res.render("pages/Student/coursePageST", { course: result });
    })
    .catch((err) => {
      console.log(err);
    });
});
//////////////////Enroll in a course
app.post("/enrollCourse", async (req, res) => {
  const { CourseID } = req.body;
  const studentName = req.cookies.fullname;
  try {
    const response = await Course.findOne({ CourseID: CourseID });
    response.studentRequests.push(studentName);
    await response.save();
    console.log("Enrollment Request Successful: ", response);
  } catch (error) {
    console.log(error);
  }
  res.json({ status: "ok", url: "/availCoursesST" });
});

// app.get("/availCoursesST", requireAuth('student'), function(req, res){
//   var noMatch = null;
//   const { search } = req.body;
//   if(search) {
//       const regex = new RegExp(escapeRegex(search), 'gi');
//       Course.find({CourseNum: regex}, function(err, allCourses){
//          if(err){
//              console.log(err);
//          } else {
//             if(allCourses.length < 1) {
//                 noMatch = "No courses match that query, please try again.";
//             }
//             res.render("pages/Student/availCoursesST",{campgrounds:allCourses, noMatch: noMatch});
//          }
//       });
//   } else {
//       // Get all campgrounds from DB
//       Course.find({}, function(err, allCourse){
//          if(err){
//              console.log(err);
//          } else {
//             res.render("pages/Student/availCoursesST",{campgrounds:allCourses, noMatch: noMatch});
//          }
//       });
//   }
// });

app.get("/availCoursesST", requireAuth("student"), function (req, res) {
  Course.find()
    .sort({ CourseNum: 1 })
    .then((result) => {
      res.render("pages/Student/availCoursesST", { courses: result });
    })
    .catch((err) => {
      console.log(err);
    });
});



app.post("/coursedetailsST", (req, res) => {
  const { CourseID } = req.body;
  res.json({
    status: "ok",
    url: `/coursedetailsST/${CourseID}`,
    CourseID: CourseID,
  });
});

app.get(
  "/coursedetailsST/:course",
  requireAuth("student"),
  function (req, res) {
    let input = req.params.course;
    Course.findOne({ CourseID: input })
      .then((result) => {
        res.render("pages/Student/courseXpage", { course: result });
      })
      .catch((err) => {
        console.log(err);
      });
  }
);
app.get("/studentHome", requireAuth("student"), function (req, res) {
  let userfullname = req.cookies.fullname;
  Course.find({ Students: userfullname })
  .then((result) => {
    const courseResult = result;
    res.render("pages/Student/studentHomePage", {
        courses: courseResult,
        user: userfullname,
      })
  })
  .catch((err) => {
    console.log(err);
  });;
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

      console.log(user);
      const userfullName = user.fullname;
      console.log(userfullName);
      console.log("token", token);
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
    Instructors,
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
      Instructors,
    });
    console.log("Course created successfully: ", response);
  } catch (error) {
    console.log(error);
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
    Instructors,
  } = req.body;

  console.log(CourseID);
  try {
    Course.updateOne(
      { _id: CourseID },
      {
        CourseNum: CourseNum,
        CourseName: CourseName,
        CourseCredits: CourseCredits,
        CourseDescription: CourseDescription,
        CourseMaterials: CourseMaterials,
        Instructors: Instructors,
      },
      function (err, result) {
        if (err) {
          res.send(err);
        } else {
          console.log("Course updated successfully: ", result);
        }
      }
    );
  } catch (error) {
    console.log(error);
  }
  res.json({ status: "ok", url: "/availCoursesIN" });
});
