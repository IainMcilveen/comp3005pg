function removeBook(isbn){
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        
        if(this.readyState==4 && this.status==200){
            alert(xhttp.responseText);
            window.location = "/bookManage";   
        }
        
    };
    xhttp.open("POST", "http://localhost:3000/removeBook/"+isbn, true);
    xhttp.send();
}