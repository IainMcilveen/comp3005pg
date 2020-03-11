function getLogin(){;
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;
    
    if(username.length < 1 || password.length < 1){
        alert("Please enter a user name and password before logging in");
    }
    
    let userData = {'username':username,'password':password};

    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        
        if(this.readyState==4 && this.status==200){
            if(xhttp.responseText == "/"){
                window.location = xhttp.responseText;
            }else{
                alert(xhttp.responseText);
            }
        }
        
    };
    xhttp.open("POST", "http://localhost:3000/login", true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send(JSON.stringify(userData));
    
}