// Load Node Modules
const express = require("express");
const PORT = process.env.PORT || '8080';
const ejs = require("ejs");
const mongoose = require('mongoose');
const User = require('./model/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'sdafjlkdsjfljweiojrlsndfk4w5u4usdjfkdsjfkjweijfsdnfndskfnadjfqoeiur343uqr[oj'

// Initialize Express
const app = express();

const dbURI = 'mongodb+srv://cbUser:chalkUser@chalkboard.youmj.mongodb.net/chalkboard?authSource=admin&replicaSet=atlas-untow0-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true';

mongoose.connect(dbURI, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true
})
    .then((result) => {
        console.log('connected to db');
        app.listen(PORT)})
    .catch((err) => console.log(err))

// Render Static Files
app.use(express.static("public"));
// app.use(express.static(__dirname + '/public'));
app.use(express.json());

// Set the view engine to ejs
app.set("view engine", "ejs");

// Port website will run on
// app.listen(8080);

// *** GET Routes - display pages ***

app.get('/adminHome', function(res, res){
    User.find()
        .then((result) => {
            res.render('pages/Admin/adminHomePage', {users: result});
        })
        .catch((err) => {
            console.log(err);
        })
});

app.get('/users', function(res, res){
    User.find()
        .then((result) => {
            res.render('pages/Admin/usersDB', {users: result});
        })
        .catch((err) => {
            console.log(err);
        })
});
app.get('/StHomepage', function (req, res){
    res.render('pages/Student/studentHomePage')
})
app.get('/login', function (req, res) {
    res.render("pages/login");
});
app.get('/register', function (req, res) {
    res.render("pages/register");
});

// Root Route
app.get("/", function (req, res) {
      res.render('pages/index');
});



// *** POST Routes

app.post('/login', async (req, res) => {
    const { email, password, usertype } = req.body;
    const user = await User.findOne({ email }).lean();
    if(!user){
        return res.json({status: 'error', error: 'Invalid username/password'});
    }
    if(await bcrypt.compare(password, user.password)){
        // the username, password combination is successful
        const token = jwt.sign({ 
            id: user._id, 
            email: user.email
        }, JWT_SECRET)
        return res.json({status: 'ok', data: token })
    }

    res.json({status: 'error', error: 'Invalid username/password'});
})


app.post('/register', async (req, res) => {
    const { firstname, lastname, email, password: plainTextPassword, usertype } = req.body;
    const password = await bcrypt.hash(plainTextPassword, 10);

    try {
        const response = await User.create({
            firstname,
            lastname,
            email,
            password,
            usertype
        })
        // res.redirect('/login');
        console.log('User created successfully: ', response);
        // window.location.href="http://newURL.com";
        // res.redirect('/login');

    } catch (error) {
        if(error.code === 11000){
            return res.json({ status:'error', error: 'This email has already been used'})
        }
        // res.redirect('/register')
        throw error
    }
    // console.log('User created successfully:', response)
    res.json({ status: 'ok' });

})