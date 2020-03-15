function addCart(query){
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if(this.readyState==4 && this.status==200){
            alert(xhttp.responseText);  
        }    
    };
    xhttp.open("POST", "http://localhost:3000/addCart?"+query, true);
    xhttp.send();
}