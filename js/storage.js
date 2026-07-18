function getTransactions() {
    const user = localStorage.getItem("currentUser");
    return JSON.parse(localStorage.getItem("transactions_" + user)) || [];
}

function saveTransactions(data) {
    const user = localStorage.getItem("currentUser");
    localStorage.setItem("transactions_" + user, JSON.stringify(data));
}
