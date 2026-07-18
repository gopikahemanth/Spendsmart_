
let wrongAttempts = 0;

const path = window.location.pathname;
const user = localStorage.getItem("currentUser");

/* Protect dashboard */
if (path.includes("dashboard.html")) {

    if (!user) {
        window.location.replace("login.html");
    } else {

        const savedPin = localStorage.getItem("pin_" + user);

        if (savedPin && sessionStorage.getItem("pinVerified") !== "true") {
            window.location.replace("pin.html");
        }
    }
}

/* If already verified, prevent going back to PIN page */
if (path.includes("pin.html")) {

    if (sessionStorage.getItem("pinVerified") === "true") {
        window.location.replace("welcome.html");
    }
}

function formatCurrency(amount) {

    const user = localStorage.getItem("currentUser");
    const currency = localStorage.getItem("currency_" + user) || "₹";

    return currency + Number(amount).toLocaleString("en-IN");
}

function syncWithCurrentDate(){
    // Initialise the selected month/year only when nothing is stored yet.
    // Never overwrite what the user picked in the month dropdown.
    const today = new Date();
    const savedMonth = localStorage.getItem("selectedMonth");
    const savedYear = localStorage.getItem("selectedYear");

    if(savedMonth === null || savedYear === null){
        selectedMonth = today.getMonth();
        selectedYear = today.getFullYear();
        localStorage.setItem("selectedMonth", selectedMonth);
        localStorage.setItem("selectedYear", selectedYear);
    } else {
        selectedMonth = Number(savedMonth);
        selectedYear = Number(savedYear);
    }
}
if (window.location.pathname.includes("index.html")) {

    const user = localStorage.getItem("currentUser");
    const authLink = document.getElementById("authLink");

    if (authLink) {
        if (user) {
            authLink.innerText = "Dashboard";
            authLink.href = "pages/welcome.html";
        } else {
            authLink.innerText = "Login";
            authLink.href = "pages/login.html";
        }
    }
}
document.addEventListener("DOMContentLoaded", function () {
syncWithCurrentDate();
    loadDarkMode();
    loadNavbarUser();
loadProfileAvatar();
initAvatarSelection();
loadYearOptions();
    const currentPath = window.location.pathname;
    const user = localStorage.getItem("currentUser");

    /* DASHBOARD */
    if (currentPath.includes("dashboard.html")) {

        if (!user) {
            window.location.href = "login.html";
            return;
        }

        const savedPin = localStorage.getItem("pin_" + user);

        if (savedPin && !sessionStorage.getItem("pinVerified")) {
            window.location.href = "pin.html";
            return;
        }

        const picker = document.getElementById("monthPicker");
        if (picker) {
            picker.value = new Date().toISOString().slice(0,7);
        }
         updateMonthLabel();

const label = document.getElementById("navMonthLabel");

if(label){
label.addEventListener("click", function(){

if(picker.showPicker){
picker.showPicker();
}else{
picker.click();
}

});
}

if(picker){

picker.addEventListener("change", function(){

const date = new Date(this.value);

selectedYear = date.getFullYear();
selectedMonth = date.getMonth();

// ✅ SAVE (VERY IMPORTANT)
localStorage.setItem("selectedMonth", selectedMonth);
localStorage.setItem("selectedYear", selectedYear);

updateMonthLabel();
loadDashboard();

});

}

        loadDashboard();
    }

    /* CALENDAR */
    if (currentPath.includes("calendar.html")) {
        loadCalendar();
    }

    /* DAY */
    if (currentPath.includes("day.html")) {
        loadDayTransactions();
    }

    /* TRANSACTION SHEET */
    if (document.getElementById("transactionTable")) {
        loadTransactionSheet();
    }

    /* BUDGET */
    if (document.getElementById("budgetInput")) {
        loadCurrent();
        loadHistory();
    }

    /* ADD PAGE */
    if (currentPath.includes("add.html")) {
        updateCategories();
        updateTitles();
    }

    /* WELCOME */
    if (currentPath.includes("welcome.html")) {
        checkNamePopup();
    }
if(document.getElementById("yearFilter")){
loadYearFilter();
document.getElementById("yearFilter").value = new Date().getFullYear();
}

if(document.getElementById("historyTable")){
loadHistory();
}

if(document.getElementById("budgetValue")){
loadCurrent();
}
const consent = localStorage.getItem("spendsmartConsent");

if (consent === "true") {
    const overlay = document.getElementById("consentOverlay");
    if (overlay) overlay.style.display = "none";
}
document.addEventListener("click", function(event){

const dropdown = document.getElementById("monthDropdown");
const label = document.getElementById("navMonthLabel");

if(!dropdown || !label) return;

// if click is NOT on dropdown and NOT on label
if(!dropdown.contains(event.target) && !label.contains(event.target)){

dropdown.style.display = "none";

}

});
});
window.acceptConsent = acceptConsent;
window.saveName = saveName;
window.skipName = skipName;

document.addEventListener("click", function(event){

const dropdown = document.getElementById("monthDropdown");
const label = document.getElementById("navMonthLabel");

if(!dropdown || !label) return;

// ✅ only if open
if(dropdown.style.display === "block"){

// click outside both
if(!dropdown.contains(event.target) && !label.contains(event.target)){
dropdown.style.display = "none";
}

}

});
function showToast(message){

const toast = document.createElement("div");

toast.innerText = message;

toast.style.position = "fixed";
toast.style.bottom = "20px";
toast.style.left = "50%";
toast.style.transform = "translateX(-50%)";
toast.style.background = "#2ecc71";
toast.style.color = "#fff";
toast.style.padding = "10px 20px";
toast.style.borderRadius = "8px";
toast.style.fontSize = "14px";
toast.style.zIndex = "9999";
toast.style.boxShadow = "0 4px 10px rgba(0,0,0,0.2)";
toast.style.opacity = "0";
toast.style.transition = "opacity 0.3s ease";

document.body.appendChild(toast);

// fade in
setTimeout(() => {
    toast.style.opacity = "1";
}, 10);

// remove after 2s
setTimeout(() => {
    toast.style.opacity = "0";
    setTimeout(() => toast.remove(), 300);
}, 2000);

}