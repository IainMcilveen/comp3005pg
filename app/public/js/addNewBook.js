function addBook(){
    let title = document.getElementById("title").value;
    if(title.trim() == ""){
        alert("please enter a title.")
        return;
    }
    let genre = document.getElementById("genre").value;
    if(genre.trim() == ""){
        alert("please enter a genre.")
        return;
    }
    let author = document.getElementById("author").value;
    tempall = author.trim().split(",");
    authors = []
    for(i in tempall){
        temp = []
        temp.push(tempall[i].trim().split(" ")[0]);
        temp.push(tempall[i].trim().split(" ")[1]);
        authors.push(temp);
    }
    if(temp.length < 2 || temp[0] == "" || temp[1] == ""){
        alert("please enter the first and last name separated by a space");
        return;
    }
    let isbn = document.getElementById("isbn").value;
    if(isbn.length != 13 || isbn.charAt(1) != "-" || isbn.charAt(6) != "-" || isbn.charAt(11) != "-"){
        alert("please enter valid length 13 isbn");
        return;
    }
    let numpages = Number(document.getElementById("numpages").value);
    if(numpages < 1){
        alert("please enter a valid number of pages");
        return;
    }
    let price = document.getElementById("price").value;
    if(price < 0){
        alert("please enter a valid price");
        return;
    }
    let expenditure = document.getElementById("expenditure").value;
    if(expenditure < 0 || expenditure > price){
        alert("please enter a valid expenditure");
        return;
    }
    let threshold = Number(document.getElementById("threshold").value);
    if(threshold < 0){
        alert("please enter a valid threshold");
        return;
    }
    let quantity = Number(document.getElementById("quantity").value);
    if(quantity < 1 || quantity < threshold){
        alert("please enter a valid quantity");
        return;
    }
    let pub = Number(document.getElementById("publisher").value);
    if(pub < 0 || pub.toString().length != 5){
        alert("please enter a valid publisher id");
        return;
    }
    book = {"title":title,"pub_id":pub,"authors":authors,"isbn":isbn,"num_pages":numpages,"genre":genre,"price":price,"expenditure":expenditure,"threshold":threshold,"quantity":quantity}
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