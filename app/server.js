//constants
const express = require('express');
const app = express();
const pug = require('pug');
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.set("view engine", "pug");
app.use(express.static("public"));

//db
const pgp = require('pg-promise')();
const db = pgp('postgres://postgres:password@localhost:5432/project');

//current user
let user = null;

//routes

//general
app.get("/",logCheck);
app.get("/newAccount",newAccount);
app.post("/createAccount",createAccount);

//client
app.post("/login",checkLogin);
app.post("/logout", logout);
app.post("/addCart",addToCart);
app.post("/remCart",remFromCart);
app.get("/toCheckOut",toCheckOut);
app.post("/checkOut/:address/:credit", checkOutCart)
app.get("/books/:isbn?/:query?", getBooks);
app.get("/orders/:num?",getOrders);
app.get("/publisher/:id", getPublisher);
app.get("/cart", getCart);

//administrator 
app.get("/bookManage",getBookManage);
app.get("/stats",getStats);
app.get("/addBookPage",getAddBook);
app.post("/removeBook/:isbn",removeBook);
app.post("/addBook",addBook);

//Login page/ home page
function logCheck(req,res){
    if(user == null){
        res.render("pages/login");
    }else if(user.admin == false){
        res.render("pages/header");
    }else{
        res.render("pages/adminHeader");
    }
}

//log out the user
function logout(req,res){
    user = null;
    res.send("/");
}

//send the user to the create account page
function newAccount(req,res){
    res.render("pages/createAccount");
}

//take data sent in from the user and create a new user account
function createAccount(req,res){
    
    newUser = req.body;
    console.log(newUser);

    //first query from all isbns to make sure there are gonna be no repeats
    db.task(async t => {
        let users = await t.many("select user_name from users")
            .catch(function (error) {
                console.log('ERROR:', error);
            });
        if(users.includes(newUser.user_name) == true){
            res.send("username was already taken");
            return;
        }

        //add user if user_name doesnt exist
        await t.none('insert into users(user_name,password,cdr_num,address,admin) values($1,$2,$3,$4,$5)',[newUser.user_name,newUser.password,newUser.cdr_num,newUser.address,false])
            .catch(function (error) {
                console.log('ERROR:', error);
                res.send("error creating new account");
        });

    });
    res.send("user created");
}

//check to see if the user is logged in or not, then let them log in
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
        db.many('select distinct on (isbn) * from book natural join author natural join publisher')
            .then(function (data) {
                res.render("pages/books",{'books':data});
            })
            .catch(function (error) {
                console.log('ERROR:', error);
        });
    }else if(req.params.isbn != "search"){
        db.many("select * from (book natural join publisher) natural join author where isbn = $1",req.params.isbn)
            .then(function (data) {
                res.render("pages/book",{'book':data});
            })
            .catch(function (error) {
                console.log('ERROR:', error);
        });
    }else{
        let text = "select * from (book natural join publisher) natural join author where "+req.params.query;
        db.query(text)
            .then(function (data) {
                res.render("pages/books",{'books':data});
            })
            .catch(function (error) {
                console.log('ERROR:', error);
        });
    }
        
}


//get a publisher
function getPublisher(req,res){
    db.many('select * from publisher natural join contact where pub_id = $1',req.params.id)
        .then(function (data) {
            res.render("pages/publisher",{"pub":data});
            
        })
        .catch(function (error) {
            console.log('ERROR:', error);
        });

}

//add a book to current users cart
function addToCart(req,res){
    data = Object.keys(req.query);
    db.none('insert into check_out(user_id,ISBN,price,title) values($1,$2,$3,$4)',[user.user_id,data[0],data[1],data[2]])
        .catch(function (error) {
            console.log('ERROR:', error);
        });
    res.send("added to cart");
}

//show whats in the current users cart
function getCart(req,res){
    db.query("select * from check_out where user_id = $1",user.user_id)
        .then(function (data) {
            console.log('DATA:', data);
            res.render("pages/cart",{'books':data});
            
        })
        .catch(function (error) {
            console.log('ERROR:', error);
        });
}

//removing books from cart
function remFromCart(req,res){
    data = Object.keys(req.query);
    console.log(data);
    db.none("delete from check_out where user_id = $1 and isbn = $3 and order_id = $2",data)
        .then(function(){
            res.send("/cart")
        })
        .catch(function (error) {
            console.log('ERROR:', error);
        });
}

//redirect the user to the checkout page
function toCheckOut(req,res){
    res.render("pages/checkOut");
}

//checkout all of the items that a currently in the cart

function checkOutCart(req,res){

    let order_num = Math.round(Math.random() * 1000000);

    //get all of the books in the cart, order them, then remove them from cart
    db.task(async t => {
        let books = await t.many("select * from (check_out natural join book) where user_id = $1",user.user_id)
            .catch(function (error) {
                console.log('ERROR:', error);
            });
        let data = [];
        for(book in books){
            //check to see if the book is going to need to be ordered
            let thresh = Number(books[book].quantity)-Number(1)
            if(thresh < books[book].threshold){
                console.log("threshold breached");
                let tally = 0;
                let prevOrders = await t.query('select * from user_order where ISBN = $1',books[book].isbn)
                for(prev in prevOrders){
                    if(((new Date).getTime() - prevOrders[prev].date_order) < 2592000000){
                        tally++;
                    }
                }
                if(tally < 5){
                    tally = 5;
                }
                await t.none('insert into store_order values(DEFAULT,$1,$2,$3,$4)',[books[book].isbn,tally,'Not Shipped','Ordering new book of this book']);
            
            }

            //get books and update their values
            console.log(books[book]);
            data[0] = books[book].order_id;
            data[1] = order_num;
            data[2] = user.user_id;
            data[3] = books[book].isbn;
            data[4] = books[book].price;
            if(req.params.credit != "-1"){
                data[5] = req.params.credit;
            }else{
                data[5] = user.cdr_num;
            }
            if(req.params.address != "-1"){
                data[6] = req.params.address;
            }else{
                data[6] = user.address;
            }
            await t.none("insert into user_order(order_id,order_number,user_id,date_order,ISBN,price,prf_cdr_num,prf_address,order_progress) values($1,$2,$3,CURRENT_DATE,$4,$5,$6,$7,'Not Shipped')",data)
                .catch(function (error) {
                    console.log('ERROR:', error);
                });
            await t.none("update book set quantity = quantity - 1 where isbn = $1",books[book].isbn);
            //update the balance in the banks
            let bankInfo = await t.one('select * from book natural join (publisher natural join bank) where ISBN = $1',books[book].isbn)
                .catch(function (error) {
                    console.log('ERROR:', error);
                });
            await t.none("update bank set balance = balance + $1 where bank_id = $2",[books[book].price,bankInfo.bank_id]);
            

        }
        await t.none("delete from check_out where user_id = $1",user.user_id);
    })

    res.send("Order Number: "+order_num);
}

//get a specific order or all if not specified
function getOrders(req,res){
    
    if(req.params.num == undefined){
        db.query("select order_number, date_order, sum(price) as tot_cost from user_order where user_id = '$1' group by order_number, date_order",user.user_id)
            .then(function (data) {
                res.render("pages/orders",{'orders':data});
                
            })
            .catch(function (error) {
                console.log('ERROR:', error);
            });
    }else{
        db.query("select * from user_order natural join book where order_number = $1",req.params.num)
        .then(function (data) {
            res.render("pages/order",{'order':data});
            
        })
        .catch(function (error) {
            console.log('ERROR:', error);
        });
    }
}

//gets the book management page
function getBookManage(req,res){
    //query for all books to show admins all books
    db.many('select distinct on (isbn) * from book natural join author natural join publisher')
        .then(function (data) {
            //console.log(data);
            res.render("pages/manageBook",{'books':data});
        })
        .catch(function (error) {
            console.log('ERROR:', error);
        });
}

//removes specified book
function removeBook(req,res){
    console.log(req.params.isbn);
    db.none('delete from book where isbn = $1',req.params.isbn)
        .catch(function (error) {
            console.log('ERROR:', error);
            res.send("failed");
    });
    res.send("success")

}

//gets the book adding page
function getAddBook(req,res){
    res.render("pages/addBook");
}

//adds the new book
function addBook(req,res){

    newBook = req.body;
    console.log(newBook);

    //first query from all isbns to make sure there are gonna be no repeats
    db.task(async t => {
        let isbns = await t.many("select ISBN from book")
            .catch(function (error) {
                console.log('ERROR:', error);
            });
        if(isbns.includes(newBook.isbn) == true){
            res.send("isbn already exists in the database")
            return;
        }

        //add book if isbn doesnt exist
        await t.none('insert into book values($1,$2,$3,$4,$5,$6,$7,$8,$9)',[newBook.isbn,newBook.pub_id,newBook.title,newBook.genre,newBook.num_pages,newBook.price,newBook.quantity,newBook.threshold,newBook.expenditure])
            .catch(function (error) {
                console.log('ERROR:', error);
                res.send("error adding book");
            });
        //add author
        for(i in newBook.authors){
            await t.none('insert into author(ISBN,first_name,last_name) values($1,$2,$3)',[newBook.isbn,newBook.authors[i][0],newBook.authors[i][1]])
                .catch(function (error) {
                    console.log('ERROR:', error);
                    res.send("error adding author");
            });
        }

    });
    res.send("success");
    
}

//get the book statistics
function getStats(req,res){

    db.task(async t => {
        let stats = await t.query('select sum(price) as price, sum(expenditure) as expenditure from user_order natural join book ');
        let sp_genre = await t.query('select sum(price), genre from user_order natural join book group by genre');
        let sp_author = await t.query('select sum(price), first_name, last_name from user_order natural join (book natural join author) group by first_name,last_name');
        let sp_publisher = await t.query('select sum(price), pub_name from user_order natural join (book natural join publisher) group by pub_name');
        res.render("pages/stats",{'stats':stats,"sp_genre":sp_genre,"sp_pub":sp_publisher,"sp_author":sp_author})
    });
    

}



//start app, should probably establish connection to db first
app.listen(3000);
console.log("Listening on port 3000");