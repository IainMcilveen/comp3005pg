//constants
const express = require('express');
const app = express();
const pug = require('pug');
let bodyParser = require('body-parser');
app.use(bodyParser.json());
app.set("view engine", "pug");
app.use(express.static("public"));

//db
const pgp = require('pg-promise')(/* options */);
const db = pgp('postgres://postgres:password@localhost:5432/project');

//current user
let user = null;

//routes
app.get("/",logCheck);
app.post("/login",checkLogin);
app.post("/logout", logout);
app.get("/books/:isbn?", getBooks);
app.get("/cart", getCart);

//Login page
function logCheck(req,res){
    if(user == null){
        res.render("pages/login");
    }else if(user.admin == false){
        console.log("xd");
    }else{
        
    }
}

function logout(req,res){
    user = null;
    res.send("/");
}

function checkLogin(req,res){
	if(user != null){
		res.status(200).send("Already logged in.");
		return;
    }
    console.log(req.body);
	let username = req.body.username;
    let password = req.body.password;
    console.log(username);
    db.one('select * from users where user_name = $1',username)
        .then(function (data) {
            console.log('DATA:', data);
            if(password === data.password){
                user = data;
                res.send("/")
            }else{
                res.send("invalid username or password");
            }
        })
        .catch(function (error) {
            console.log('ERROR:', error);
            res.send("invalid username or password");
        });

};

//get all of the books
function getBooks(req,res){
    //if a specific book isnt specified
    if(req.params.isbn == undefined){
        //query for all books
        db.many('select * from book')
            .then(function (data) {
                console.log('DATA:', data);
                res.render("pages/books",{'books':data});
            })
            .catch(function (error) {
                console.log('ERROR:', error);
        });
    }else{
        db.one("select * from book where isbn = $1",req.params.isbn)
            .then(function (data) {
                console.log('DATA:', data);
                res.render("pages/book",{'book':data});
            })
            .catch(function (error) {
                console.log('ERROR:', error);
        });
    }
        
}

//show whats in the current users cart
function getCart(req,res){}

//start app, should probably establish connection to db first
app.listen(3000);
console.log("Listening on port 3000");