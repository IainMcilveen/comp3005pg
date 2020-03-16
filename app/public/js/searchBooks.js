function searchBooks(){
    ids = ["genre","title","ISBN","author"];
    let query = null;
    for(id in ids){
        let radio = document.getElementById(ids[id]);
        if(radio.checked){
            query = radio.value;
            break;
        }
    }
    if(query == null){
        alert("please select what you are searching for.");
        return;
    }

    let text = document.getElementById("searchbox").value;
    if(text == ""){
        alert("please type what you are looking for");
        return;
    }
    console.log(text);

    if(query == "author"){
        let name = text.trim().split(" ");
        query = "first_name";
        text = name[0];
    }



    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        
        if(this.readyState==4 && this.status==200){
            window.location = "/books/search/"+query+" = '"+text.trim()+"'"
        }
        
    };
    xhttp.open("GET", "http://localhost:3000/books/search/"+query+" = '"+text.trim()+"'", true);
    xhttp.send();

}

function clearSearch(){
    window.location = "/books"
}
