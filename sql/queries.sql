/* This is the query used to get all of the user_name's in the database */
select user_name from users

/* This is the query used to add a new user to the database with given data 
$1 is the new user_name
$2 is the new password
$3 is the new credit card number
$4 is the new address
$5 is whether user is an admin (false always)
*/
insert into users(user_name,password,cdr_num,address,admin) values($1,$2,$3,$4,$5)

/* This is the query used for when a user logs into the store 
$1 is the user_name entered
*/
select * from users where user_name = $1

/* This is the query used to grab all the books with unique ISBN's and their author and publisher data */
select distinct on (isbn) * from book natural join author natural join publisher

/* This is the query used to get all the data for a specific book by ISBN
$1 is the ISBN queried for
*/
select * from (book natural join publisher) natural join author where isbn = $1

/* This is the query used to search for books based on specific attributes
req.params.query changes depending on what the user searched for on the page
*/
select * from (book natural join publisher) natural join author where "+req.params.query

/* This is the query used to get the information on a specific publisher
$1 is the pub_id being queried
 */
select * from publisher natural join contact where pub_id = $1

/* This is the query for inserting a new book into the user's check out 
$1 is the user's id
$2 is the book being checked out's ISBN
$3 is the books price
$4 is the books title
*/
insert into check_out(user_id,ISBN,price,title) values($1,$2,$3,$4)

/* This is the query used for getting a specific user's checked out books
$1 is the user's id
 */
select * from check_out where user_id = $1

/* This is the query used for when a user wants to remove a book from their cart
$1 is the user's id
$2 is the books ISBN
$3 is the order's id
 */
delete from check_out where user_id = $1 and isbn = $3 and order_id = $2

/* This is the query used for getting all of the books in a users checked out cart as well as all of their data 
$1 is the user's id
*/
select * from (check_out natural join book) where user_id = $1

/* This is the query used on a book goes below it's threshold and the database needs to make a store order to replenish its stock of that book
$1 is the book's ISBN
 */
select * from user_order where ISBN = $1

/* This query actually creates the store_order
$1 is the book's ISBN
$2 is the amount to be ordered
$3 is the order status ('Not Shipped')
$4 is the email for the book being order
*/
insert into store_order values(DEFAULT,$1,$2,$3,$4)

/* This is the query used when a user orders a book thats in their check_out cart
$1 is the order_id
$2 is the order_number
$3 is the user's id
$4 is the ISBN
$5 is the price
$6 is the prf_cdr_num
$7 is the prf_address
*/
insert into user_order(order_id,order_number,user_id,date_order,ISBN,price,prf_cdr_num,prf_address,order_progress) values($1,$2,$3,CURRENT_DATE,$4,$5,$6,$7,'Not Shipped')

/* This query updates a books quantity after it has been order
$1 is the ISBN
 */
update book set quantity = quantity - 1 where isbn = $1

/* This gets the bank information for a book being ordered 
$1 is the ISBN of the book
*/
select * from book natural join (publisher natural join bank) where ISBN = $1

/* This updates the balance in the bank
$1 is the cost of the book
$2 is the bank's id 
 */
update bank set balance = balance + $1 where bank_id = $2

/* The removes the books from check_out when they are ordered
$1 is the user's id
 */
delete from check_out where user_id = $1

/* get all of the orders for a specific user 
$1 is the user's id
*/
select order_number, date_order, sum(price) as tot_cost from user_order where user_id = '$1' group by order_number, date_order

/* This gets a specific user's order from the order number
$1 is the order_number
 */
select * from user_order natural join book where order_number = $1

/* This gets all of the books and their info for the admins */
select distinct on (isbn) * from book natural join author natural join publisher

/* This query is used to delete a book from the database
$1 is the ISBN
 */
delete from book where isbn = $1

/* This query gets the isbn's for all of the book, so that they can be check for repeats when adding a new book */
select ISBN from book

/* This is the query for adding a new book to the database
$1 is the isbn
$2 is the publisher id
$3 is the title
$4 is the genre
$5 is the number of page
$6 is the price
$7 is the quanitity
$8 is the threshold
$9 is the expenditure for each one of this book sold
*/
insert into book values($1,$2,$3,$4,$5,$6,$7,$8,$9)

/* This is the query used for adding new authors assoicated with the new book 
$1 is the ISBN for the book
$2 is the authors first name
$3 is the authors last name
*/
insert into author(ISBN,first_name,last_name) values($1,$2,$3)

/* This is the query for getting the total sales and expenditure for all of the books sold */
select sum(price) as price, sum(expenditure) as expenditure from user_order natural join book

/* This is the query for getting the total sales per genre */
select sum(price), genre from user_order natural join book group by genre

/* This is the query for getting the total sales per author */
select sum(price), first_name, last_name from user_order natural join (book natural join author) group by first_name,last_name

/* This is the query for getting the toal sales per publisher */
select sum(price), pub_name from user_order natural join (book natural join publisher) group by pub_name