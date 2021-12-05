// Load Node Modules
const express = require("express");
const favicon = require('serve-favicon')
require("dotenv").config();
const PORT = process.env.PORT || "8080";
const ejs = require("ejs");
const mongoose = require("mongoose");
const User = require("./model/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const { requireAuth } = require("./middleware/authMiddleware");

const JWT_SECRET =
  "sdafjlkdsjfljweiojrlsndfk4w5u4usdjfkdsjfkjweijfsdnfndskfnadjfqoeiur343uqr[oj";

// Initialize Express
const app = express();

app.use(favicon(__dirname + '/public/img/favicon.ico'));

const dbURI =
  "mongodb+srv://cbUser:chalkUser@chalkboard.youmj.mongodb.net/chalkboard?authSource=admin&replicaSet=atlas-untow0-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true";
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
  User.find()
    .then((result) => {
      res.render("pages/Admin/usersDB", { users: result });
    })
    .catch((err) => {
      console.log(err);
    });
});

///////////////////////////// INSTRUCTOR ROUTES
app.get("/instructorHome", requireAuth('instructor'), function (req, res) {
  res.render("pages/Instructor/instructorHomePage");
});

app.get("/availCoursesIN", requireAuth('instructor'), function (req, res) {
  res.render("pages/Instructor/availCourses");
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
    res.render("pages/login");
});
app.get("/register", function (req, res) {
    res.cookie("jwt", "", { maxAge: 1 });
    res.cookie("usertype", "", { maxAge: 1 });
    res.render("pages/register");
});

// Logout Route
app.get("/logout", (req, res) => {
  res.cookie("jwt", "", { maxAge: 1 }); //overwrite the current jwt
  res.cookie("usertype", "", { maxAge: 1 });
  res.redirect("/");
});

// Root Route
app.get("/", function (req, res) {
    res.cookie("jwt", "", { maxAge: 1 });
    res.cookie("usertype", "", { maxAge: 1 });
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
      res.cookie("jwt", token, { httpOnly: true });
      res.cookie("usertype", usertype);
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
    email,
    password: plainTextPassword,
    usertype,
  } = req.body;
  const password = await bcrypt.hash(plainTextPassword, 10);

  try {
    const response = await User.create({
      firstname,
      lastname,
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
