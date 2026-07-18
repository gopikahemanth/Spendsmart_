function verifyPin() {

    const user = localStorage.getItem("currentUser");
    const savedPin = localStorage.getItem("pin_" + user);
    const enteredPin = document.getElementById("pinInput").value;

    if (enteredPin === savedPin) {

        sessionStorage.setItem("pinVerified", "true");
        wrongAttempts = 0;

        window.location.replace("dashboard.html");

    } else {

        wrongAttempts++;
        document.getElementById("pinError").innerText =
            "Wrong PIN (" + wrongAttempts + "/3)";

        if (wrongAttempts >= 3) {
            showToast("Too many attempts. Logging out.");
            logout();
        }
    }
}
  function savePin() {
    const user = localStorage.getItem("currentUser");
    const newPin = document.getElementById("newPin").value;

    if (!newPin || newPin.length !== 4 || isNaN(newPin)) {
        document.getElementById("pinError").innerText =
            "PIN must be exactly 4 digits.";
        return;
    }

    localStorage.setItem("pin_" + user, newPin);
    sessionStorage.setItem("pinVerified", "true");

    showToast("PIN saved!");
      window.location.href="pin.html";
}
function removePin(){

const user = localStorage.getItem("currentUser");

// ❌ no confirm popup
// directly remove OR you can keep confirm logic separately if needed

localStorage.removeItem("pin_" + user);
sessionStorage.removeItem("pinVerified");

// ✅ show toast message
showToast("PIN removed successfully");

}
function checkEnter(event) {
    if (event.key === "Enter") {
        verifyPin();
    }
}
function changePin() {
    const user = localStorage.getItem("currentUser");
    const savedPin = localStorage.getItem("pin_" + user);

    const oldPin = document.getElementById("oldPin").value;
    const newPin = document.getElementById("newPin").value;
    const confirmPin = document.getElementById("confirmPin").value;
    const message = document.getElementById("pinMessage");

    if (savedPin && oldPin !== savedPin) {
        message.innerText = "Old PIN is incorrect!";
        return;
    }

    if (!newPin || newPin.length !== 4 || isNaN(newPin)) {
        message.innerText = "PIN must be exactly 4 digits.";
        return;
    }

    if (newPin !== confirmPin) {
        message.innerText = "PIN confirmation does not match.";
        return;
    }

    localStorage.setItem("pin_" + user, newPin);
    sessionStorage.setItem("pinVerified", "true");

    showToast("PIN updated successfully!");
    window.location.href = "dashboard.html";
}
