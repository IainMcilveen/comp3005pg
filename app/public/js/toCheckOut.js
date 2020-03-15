function toCheckOut(){
    
    let check = document.getElementById("books").childElementCount;
    if(check < 1){
        alert("No books to check out");
        return;
    }
    
    window.location = "/toCheckOut"
    
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        
        if(this.readyState==4 && this.status==200){
            //console.log(xhttp.responseText);
           // window.location = xhttp.responseText;   
        }
        
    };
    xhttp.open("GET", "http://localhost:3000/toCheckOut", true);
    xhttp.send();
}