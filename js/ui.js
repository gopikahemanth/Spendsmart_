function toggleMenu() {
    const menu = document.getElementById("dropdownMenu");

    if (menu.style.display === "block") {
        menu.style.display = "none";

        // close all submenus
        document.querySelectorAll(".submenu").forEach(s => {
            s.style.display = "none";
        });

    } else {
        menu.style.display = "block";
    }
}
function toggleSection(id) {

    const allSections = document.querySelectorAll(".submenu");

    allSections.forEach(section => {
        if (section.id !== id) {
            section.style.display = "none";
        }
    });

    const selected = document.getElementById(id);

    if (selected.style.display === "block") {
        selected.style.display = "none";
    } else {
        selected.style.display = "block";
    }

}
function closeMenu() {
    document.getElementById("dropdownMenu").style.display = "none";
}
function togglePassword() {
    const password = document.getElementById("password")||document.getElementById("regPass");
    const icon = document.querySelector(".toggle-password");

    if (password.type === "password") {
        password.type = "text";
        icon.textContent = "👁‍🗨";
    } else {
        password.type = "password";
        icon.textContent = "👁️";
    }
}

function toggleDarkMode() {
    document.body.classList.toggle("dark-mode");

    if (document.body.classList.contains("dark-mode")) {
        localStorage.setItem("darkMode", "enabled");
        document.getElementById("darkToggle").innerText = "☀️";
    } else {
        localStorage.setItem("darkMode", "disabled");
        document.getElementById("darkToggle").innerText = "🌙";
    }
}

function loadDarkMode() {
    const darkMode = localStorage.getItem("darkMode");

    if (darkMode === "enabled") {
        document.body.classList.add("dark-mode");
        const btn = document.getElementById("darkToggle");
        if (btn) btn.innerText = "☀️";
    }
}
function showEye(){

const password = document.getElementById("password")||document.getElementById("regPass");
const eye = document.querySelector(".toggle-password");
if(!password||!eye)
    return;
if(password.value.length > 0){
eye.style.display = "block";
}else{
eye.style.display = "none";
}

}
function loadNavbarUser(){

const user = localStorage.getItem("currentUser");
if(!user) return;

let name = localStorage.getItem("name_" + user);

if(!name || name.trim() === "" || name === user){
name = "User";
}

const avatar = localStorage.getItem("avatar_" + user);

const hello = document.getElementById("navHello");
const avatarBox = document.getElementById("navAvatar");

if(hello){
hello.innerText = "Hello, " + name;
}

if(avatarBox){

if(avatar){
avatarBox.innerHTML =
`<img src="../assets/${avatar}" style="width:100%;height:100%;border-radius:50%;">`;
}else{
avatarBox.innerText = user.charAt(0).toUpperCase();
}

}

}

function acceptConsent() {
  localStorage.setItem("spendsmartConsent", "true");

  const overlay = document.getElementById("consentOverlay");
  if (overlay) overlay.style.display = "none";
}
function loadYearOptions(){

const select = document.getElementById("yearSelect");

if(!select) return;   // ⭐ important fix

const currentYear = new Date().getFullYear();

for(let y=currentYear; y>=2020; y--){

const option = document.createElement("option");
option.value = y;
option.text = y;

select.appendChild(option);

}

}

function selectAvatar(elOrSrc, maybeSrc){
    // Supports selectAvatar('avatar1.jpeg') and selectAvatar(el, 'avatar1.jpeg')
    let el = null;
    let src = maybeSrc;
    if (typeof elOrSrc === "string") {
        src = elOrSrc;
    } else {
        el = elOrSrc;
    }
    if (!src) return;

    const user = localStorage.getItem("currentUser");
    if (user) localStorage.setItem("avatar_" + user, src);

    const avatar = document.getElementById("editAvatar");
    if (avatar) {
        avatar.style.background = "none";
        avatar.innerHTML =
            `<img src="../assets/${src}" style="width:100%;height:100%;border-radius:50%;object-fit:cover;">`;
    }

    document.querySelectorAll(".avatar-grid img").forEach(img => img.classList.remove("selected"));
    if (el && el.classList) el.classList.add("selected");
    else {
        const match = document.querySelector(`.avatar-grid img[src$="${src}"]`);
        if (match) match.classList.add("selected");
    }
}
function loadProfileAvatar(){

const user = localStorage.getItem("currentUser");
const saved = localStorage.getItem("avatar_" + user);

const avatar = document.getElementById("editAvatar");

if(saved && avatar){
avatar.style.background = "none";
avatar.innerHTML = `<img src="../assets/${saved}" style="width:100%;height:100%;border-radius:50%;">`;
}

}
function checkNamePopup(){

const user = localStorage.getItem("currentUser");
if(!user) return;

const ask = localStorage.getItem("askName_" + user);

if(ask === "true"){
const popup = document.getElementById("namePopup");
if(popup) popup.style.display = "flex";
}

}
function saveName(){

const user = localStorage.getItem("currentUser");
const name = document.getElementById("popupName").value.trim();

if(name){
localStorage.setItem("name_" + user, name);
}
loadNavbarUser();
localStorage.setItem("askName_" + user, "false");

document.getElementById("namePopup").style.display="none";

}

function skipName(){

const user = localStorage.getItem("currentUser");

localStorage.setItem("askName_" + user, "false");

document.getElementById("namePopup").style.display="none";

}

function exportCSV() {
    const transactions = getTransactions();

    let csv = "Title,Type,Category,Amount,Date\n";

    transactions.forEach(t => {
        csv += `${t.title},${t.type},${t.category},${t.amount},${t.date}\n`;
    });

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "transactions.csv";
    a.click();

    window.URL.revokeObjectURL(url);
}
function openDateFilter() {
    const box = document.getElementById("calendarFilter");
    box.style.display = box.style.display === "none" ? "block" : "none";
}


let currentDate = new Date();


function deleteAccount() {
    if (confirm("This will delete your account permanently. Continue?")) {
        const user = localStorage.getItem("currentUser");
        localStorage.removeItem("user_" + user);
        localStorage.removeItem("currentUser");
        window.location.replace("index.html");
    }
}
function changeCurrency() {

    const user = localStorage.getItem("currentUser");
    const selected = document.getElementById("currencySelect").value;

    localStorage.setItem("currency_" + user, selected);

    showToast("Currency updated successfully!");

    // Reload dashboard to reflect changes
    location.reload();
}

let currentSlide = 0;

function nextSlide(){

const slides = document.querySelectorAll(".slide");

slides[currentSlide].classList.remove("active");

currentSlide++;

if(currentSlide >= slides.length){
currentSlide = 0;
}

slides[currentSlide].classList.add("active");

}
document.addEventListener("DOMContentLoaded", function () {

    const categorySelect = document.getElementById("category");
    const customInput = document.getElementById("customCategory");

    if (categorySelect && customInput) {
        categorySelect.addEventListener("change", function () {
            if (this.value === "Other") {
                customInput.style.display = "block";
            } else {
                customInput.style.display = "none";
            }
        });
    }

    const titleInput = document.getElementById("title");

    if (titleInput) {
        titleInput.addEventListener("focus", function () {
            this.value = "";
            this.dispatchEvent(new Event("input"));
        });
    }

});
document.addEventListener("DOMContentLoaded", function () {

    document.addEventListener("click", function (event) {

        const menu = document.getElementById("dropdownMenu");
        const toggle = document.querySelector(".menu-toggle");

        if (!menu || !toggle) return;

        if (!menu.contains(event.target) && !toggle.contains(event.target)) {

            menu.style.display = "none";

            document.querySelectorAll(".submenu").forEach(section => {
                section.style.display = "none";
            });

        }

    });

});

// Load saved currency on page load
document.addEventListener("DOMContentLoaded", function () {

    const user = localStorage.getItem("currentUser");
    if (!user) return;

    const savedCurrency = localStorage.getItem("currency_" + user) || "₹";

    const select = document.getElementById("currencySelect");
    if (select) {
        select.value = savedCurrency;
    }
});
function loadProfileAvatar() {
    const user = localStorage.getItem("currentUser");
    if (!user) return;

    const avatarBox = document.getElementById("editAvatar");

    if (avatarBox) {
        const savedAvatar = localStorage.getItem("avatar_" + user);

        if (savedAvatar) {
            avatarBox.style.background = "none";
            avatarBox.innerHTML =
                `<img src="../assets/${savedAvatar}" 
                style="width:100%;height:100%;border-radius:50%;object-fit:cover;">`;
        } else {
            avatarBox.innerText = user.charAt(0).toUpperCase();
        }
    }
}
function initAvatarSelection() {

    const avatars = document.querySelectorAll(".avatar-option");

    avatars.forEach(avatar => {

        avatar.addEventListener("click", function () {

            // remove previous selection
            avatars.forEach(a => a.classList.remove("selected"));

            // highlight selected
            this.classList.add("selected");

            // save selected avatar filename
            const selectedAvatar = this.getAttribute("data-avatar");

            const user = localStorage.getItem("currentUser");

            localStorage.setItem("avatar_" + user, selectedAvatar);

        });

    });

}