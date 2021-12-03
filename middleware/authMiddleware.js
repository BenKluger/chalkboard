const jwt = require("jsonwebtoken");
const JWT_SECRET =
  "sdafjlkdsjfljweiojrlsndfk4w5u4usdjfkdsjfkjweijfsdnfndskfnadjfqoeiur343uqr[oj";

//Add user validation jwt auth

const requireAuth = (req, res, next) => {
  const token = req.cookies.jwt;

  //check json web token exists & is verified/valid
  if (token) {
    //only true if there is a token
    jwt.verify(token, JWT_SECRET, (err, decodedToken) => {
      if (err) {
        console.log(err.message);
        res.redirect("/login");
      } else {
        console.log(decodedToken);
        next();
      }
    });
  } else {
    res.redirect("/login"); //this should work because this is in our get request
  }
};
module.exports = { requireAuth };
