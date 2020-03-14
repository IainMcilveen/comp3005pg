function logout(){
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        
        if(this.readyState==4 && this.status==200){
            console.log(xhttp.responseText);
            window.location = xhttp.responseText;   
        }
        
    };
    xhttp.open("POST", "http://localhost:3000/logout", true);
    xhttp.send();
}