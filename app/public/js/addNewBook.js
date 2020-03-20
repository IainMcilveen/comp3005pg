function addBook(){
    let title = document.getElementById("title").value;
    if(title.trim() == ""){
        alert("please enter a title.")
        return;
    }
    let author = document.getElementById("author").value;
    temp = author.trim().split(" ");
    if(temp.length < 2 || temp[0] == "" || temp[1] == ""){
        alert("please enter the first and last name separated by a space");
        return;
    }
    let isbn = document.getElementById("isbn").value;
    if(isbn.length != 13 || isbn.charAt(1) != "-" || isbn.charAt(6) != "-" || isbn.charAt(11) != "-"){
        alert("please enter valid length 13 isbn");
        return;
    }
    let numpages = document.getElementById("numpages").value;
    if(numpages < 1){
        alert("please enter a valid number of pages");
        return;
    }
    let price = document.getElementById("price").value;
    if(price < 0){
        alert("please enter a valid price");
        return;
    }
    let threshold = document.getElementById("threshold").value;
    if(threshold < 0){
        alert("please enter a valid threshold");
        return;
    }
    let quantity = document.getElementById("quantity").value;
    if(quantity < 1 || quantity > threshold){
        alert("please enter a valid quantity");
        return;
    }
    book = {"title":title,"first_name":temp[0],"last_name":temp[1],"isbn":isbn,"num_pages":numpages,"price":price,"threshold":threshold,"quantity":quantity}
    console.log(book);


    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        
        if(this.readyState==4 && this.status==200){
            alert(xhttp.responseText);
            window.location = "/bookManage";   
        }
        
    };
    xhttp.open("POST", "http://localhost:3000/addBook", true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send(JSON.stringify(book));

}