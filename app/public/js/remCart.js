function remCart(query){
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if(this.readyState==4 && this.status==200){
            alert("item removed");
            window.location = xhttp.responseText;  
        }    
    };
    xhttp.open("POST", "http://localhost:3000/remCart?"+query, true);
    xhttp.send();
}