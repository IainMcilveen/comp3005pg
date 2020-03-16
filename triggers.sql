//trigger to check quantity of books
create trigger make_order after update of book on quantity
referencing new row as nrow
for each row
when nrow.quantity < nrow.threshold
begin 
	store_order(nrow.isbn)
end;