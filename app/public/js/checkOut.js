function checkOut(){

    let address = document.getElementById("address").value;
    let credit = document.getElementById("credit").value;
    if(address == ""){
        address = "-1";
    }
    if(credit == ""){
        credit = "-1";
    }

    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        
        if(this.readyState==4 && this.status==200){
            alert("items checked out");
            window.location = xhttp.responseText;   
        }
        
    };
    xhttp.open("POST", "http://localhost:3000/checkOut/"+address+"/"+credit, true);
    xhttp.send();
}