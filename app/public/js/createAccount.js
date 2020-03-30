function createAccount(){
    let user_name = document.getElementById("user_name").value;
    if(user_name.trim() == ""){
        alert("please enter a username.")
        return;
    }
    let password = document.getElementById("password").value;
    if(password.trim() == ""){
        alert("please enter a password.")
        return;
    }
    let cdr_num = document.getElementById("cdr_num").value;
    if(cdr_num.trim() == "" || cdr_num.trim().length < 16 ){
        alert("please enter a valid credit card number.")
        return;
    }
    let address = document.getElementById("address").value;
    if(address.trim() == ""){
        alert("please enter a valid address.")
        return;
    }
    user_data = {"user_name":user_name,"password":password,"cdr_num":cdr_num,"address":address};

    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        
        if(this.readyState==4 && this.status==200){
            alert(xhttp.responseText);
            window.location = "/";   
        }
        
    };
    xhttp.open("POST", "http://localhost:3000/createAccount", true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send(JSON.stringify(user_data));
}