let login = false;
const details= 
{
    "username" : "admin",
    "password" : "123"
}

localStorage.setItem("login",login);
console.log(login);

function userDetails()
{
    let username = document.querySelector(".username").value;
    let password = document.querySelector(".password").value;

    if(username === details.username && password=== details.password)
    {
        localStorage.setItem("login", JSON.stringify(true));
        window.location.href = "index.html";
        
    }
    else
    console.log("error");
    
}

function createAccount()
{
    window.location.href = "account.html";
    let username = document.querySelector(".username").value;
    let password = document.querySelector(".password").value;
    details.username = username;
    details.password = password;

}