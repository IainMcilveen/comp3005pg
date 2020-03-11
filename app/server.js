//constants
const express = require('express');
const app = express();
const session = require('express-session');

//db
const pgp = require('pg-promise')(/* options */);
const db = pgp('postgres://postgres:password@localhost:5432/project');

//setting of the session for auth
app.use(session({
  store: new (require('connect-pg-simple')(session))(),
  secret: process.env.FOO_COOKIE_SECRET,
  resave: false,
  cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 } // 30 days
}));

//routes
app.get("/books", getBooks);

//get all of the books
function getBooks(req,res){
    //query for all books
    db.many('select * from book')
        .then(function (data) {
            console.log('DATA:', data)
        })
        .catch(function (error) {
            console.log('ERROR:', error)
    });

    //send all of the data as json 
    //res.send(data)
}

//start app, should probably establish connection to db first
app.listen(3000);
console.log("Listening on port 3000");