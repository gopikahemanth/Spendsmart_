function register() {

    const userInput = document.getElementById("regUser").value.trim();
    const pass = document.getElementById("regPass").value.trim();
    const error = document.getElementById("regError");

    // Convert username to lowercase like Instagram
    const user = userInput.toLowerCase();

    // Instagram-style username rule
   const usernameRegex = /^(?!.*\.\.)(?!\.)(?!.*\.$)[a-z0-9._]{3,20}$/;

    // Clear old error
    error.innerText = "";

    // Validate username format
    if (!usernameRegex.test(user)) {
      error.innerText =
"Username must be 3-20 characters. Use lowercase letters, numbers, _ or . but cannot start or end with .";
        return;
    }

    // Validate password
    if (!pass) {
        error.innerText = "Password is required.";
        return;
    }

    // Check if username already exists
    if (localStorage.getItem("user_" + user)) {
        error.innerText = "Username already taken.";
        return;
    }

    // Save user
    localStorage.setItem("user_" + user, (pass));
    localStorage.setItem("currentUser", user);
localStorage.setItem("join_" + user, 
    new Date().toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    })
);

localStorage.setItem("askName_" + user, "true");
    // Redirect safely
    window.location.replace("avatar-select.html");
}

// LOGIN
function login() {

const user = document.getElementById("loginUser").value.trim().toLowerCase();
const pass = document.getElementById("password").value.trim();
const error = document.getElementById("loginError");

error.innerText = "";

if (!user || !pass) {
    error.innerText = "Please enter both username and password.";
    return;
}

const storedPass = localStorage.getItem("user_" + user);

// storedPass is null for any username that was never registered, so this
// can only succeed for an account that actually exists with a matching,
// non-blank password.
if (storedPass !== null && storedPass === pass) {
    localStorage.setItem("currentUser", user);
    window.location.replace("welcome.html");
} else {
    error.innerText = "Invalid username or password!";
}

}
function logout() {

    const confirmLogout = confirm("Are you sure you want to logout?");

    if (confirmLogout) {
        localStorage.removeItem("currentUser");
        sessionStorage.clear();
        window.location.replace("index.html");
    }

}

function resetPassword(){

const user = document.getElementById("resetUser").value.trim().toLowerCase();
const newPass = document.getElementById("newPass").value.trim();
const error = document.getElementById("resetError");

const stored = localStorage.getItem("user_" + user);

if(!stored){
error.innerText = "Username not found";
error.style.color = "";
return;
}

if(!newPass){
error.innerText = "Please enter a new password.";
error.style.color = "";
return;
}

localStorage.setItem("user_" + user, newPass);

error.style.color = "green";
error.innerText = "Password updated successfully";

}

function checkUsername(){

    const input = document.getElementById("regUser");
    const status = document.getElementById("usernameStatus");

    let username = input.value.trim().toLowerCase();
    input.value = username; // force lowercase

    if(username.length === 0){
        status.innerText = "";
        return;
    }

    if(username.length < 3){
        status.innerText = "Username must be at least 3 characters";
        status.className = "taken";
        return;
    }
const usernameRegex = /^(?!.*\.\.)(?!\.)(?!.*\.$)[a-z0-9._]{3,20}$/;

if(!usernameRegex.test(username)){
status.innerText = "Invalid username format";
status.className = "taken";
return;
}
    if(localStorage.getItem("user_" + username)){
        status.innerText = "✖ Username already taken";
        status.className = "taken";
    }
    else{
        status.innerText = "✔ Username available";
        status.className = "available";
    }
}