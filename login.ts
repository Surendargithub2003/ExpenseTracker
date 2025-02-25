login  = "false";
let username
let password 
const details= 
{
    "username" : "admin",
    "password" : "123"
}

const usern = doc.getElementById(".username") as HTMLInputElement | null;
const userp = doc.getElementById(".password") as HTMLInputElement | null;


if(login)
localStorage.setItem("login",login.toString());
console.log(login);

function userDetails()
{
    if(usern && userp)
    {
        username = usern.value;
        password = userp.value;
    
    

    if(username === details.username && password=== details.password)
    {
        localStorage.setItem("login", JSON.stringify(true));
        window.location.href = "index.html";
        
    }
    else
    console.log("error");
}
}

