create table bank
	(bank_id	varchar(5),
	 balance	numeric(9,2),
	 primary key (bank_id)
	);

create table publisher
	(pub_id 	varchar(5),
	 bank_id	varchar(5),
	 pub_name		varchar(30),
	 pub_address	varchar(75),
	 email		varchar(70),
	 primary key (pub_id),
	 foreign key (bank_id) references bank
	);

create table contact
	(contact_id		varchar(5),
	 pub_id			varchar(5),
	 phone_number	varchar(20),
	 primary key (contact_id),
	 foreign key (pub_id) references publisher
	);
	
create table book
	(ISBN 		varchar(13),
	 pub_id 	varchar(5),
	 title 		varchar(50),
	 genre		varchar(25),
	 num_pages  int,
	 price		numeric(5,2),
	 quantity	int
		check (quantity > 0),
	 threshold	int,
	 expenditure numeric(5,2),
	 primary key (ISBN),
	 foreign key (pub_id) references publisher
	);

create table author
	(author_id		serial,
	 ISBN			varchar(13),
	 first_name 	varchar(12),
	 last_name		varchar(15),
	 primary key (author_id,ISBN),
	 foreign key (ISBN) references book
	 	on delete cascade
	);
	
create table users
	(user_id	serial,
	 user_name 	varchar(20),
	 password 	varchar(20),
	 cdr_num 	varchar(19),
	 address	varchar(75),
	 admin		boolean,
	 primary key (user_id)
	);
	
create table check_out
	(user_id	serial,
	 order_id	serial,
	 ISBN 		varchar(13),
	 price		numeric(5,2),
	 title 		varchar(50),
	 primary key (user_id,ISBN,order_id),
	 foreign key (user_id) references users,
	 foreign key (ISBN) references book
	);

create table user_order
	(user_order_id serial,
	 user_id		varchar(5),
	 order_id 		int,
	 order_number	int,
	 date_order		date,
	 ISBN 		varchar(13),
	 price		numeric(5,2),
	 prf_cdr_num varchar(19),
	 prf_address varchar(75),
	 order_progress varchar(15)
		check (order_progress in ('Not Shipped', 'In Transit', 'Delivered')),
	 primary key (user_order_id),
	 foreign key (ISBN) references book
	);
	
create table store_order
	(store_order_id	serial,
	 ISBN 			varchar(13),
	 order_quantity		int,
	 order_progress varchar(15)
		check (order_progress in ('Not Shipped', 'In Transit', 'Delivered')),
	 email			varchar(100),
	 primary key (store_order_id),
	 foreign key (ISBN) references book
	);
	