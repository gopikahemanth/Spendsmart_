
function loadCalendar() {

    const grid = document.getElementById("calendarGrid");
    const monthYear = document.getElementById("monthYear");
    const monthSelect = document.getElementById("monthSelect");
    const yearSelect = document.getElementById("yearSelect");

    if (!grid) return;

    grid.innerHTML = "";

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const monthNames = [
        "January","February","March","April","May","June",
        "July","August","September","October","November","December"
    ];

    // Set heading text
    if (monthYear) {
        monthYear.innerText = monthNames[month] + " " + year;
    }

    // Fill month dropdown (only once)
    if (monthSelect && monthSelect.options.length === 0) {
        monthNames.forEach((m, index) => {
            const option = document.createElement("option");
            option.value = index;
            option.text = m;
            monthSelect.appendChild(option);
        });
    }

    // Fill year dropdown (2000–2035)
    if (yearSelect && yearSelect.options.length === 0) {
        for (let y = 2000; y <= 2035; y++) {
            const option = document.createElement("option");
            option.value = y;
            option.text = y;
            yearSelect.appendChild(option);
        }
    }

    if (monthSelect) monthSelect.value = month;
    if (yearSelect) yearSelect.value = year;

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Build a lookup of every date that already has a transaction, so we
    // can mark those days on the grid (this was missing entirely before -
    // there was no visual way to tell which dates had data).
    const transactions = (typeof getTransactions === "function") ? getTransactions() : [];
    const transactionDates = new Set(transactions.map(t => t.date));

    // Empty cells before first day
    for (let i = 0; i < firstDay; i++) {
        const empty = document.createElement("div");
        empty.style.visibility = "hidden";
        grid.appendChild(empty);
    }

    // Generate days
    for (let day = 1; day <= daysInMonth; day++) {

        const cell = document.createElement("div");
        cell.innerText = day;

        const dateStr =
            year + "-" +
            String(month + 1).padStart(2, '0') + "-" +
            String(day).padStart(2, '0');

        // Highlight today
        const today = new Date();
        if (
            day === today.getDate() &&
            month === today.getMonth() &&
            year === today.getFullYear()
        ) {
            cell.classList.add("today");
        }

        // Mark days that already have a transaction saved
        if (transactionDates.has(dateStr)) {
            cell.classList.add("has-transaction");
        }

        // Make each day cell keyboard-operable, not just clickable.
        // Before this, the cells were plain <div>s with no tabindex/role,
        // so they couldn't be reached or activated with the keyboard.
        cell.tabIndex = 0;
        cell.setAttribute("role", "button");
        cell.setAttribute("aria-label", monthNames[month] + " " + day + ", " + year);

        const goToSelectedDay = function () {
            localStorage.setItem("selectedDate", dateStr);
            window.location.href = "day.html";
        };

        cell.onclick = goToSelectedDay;

        cell.addEventListener("keydown", function (e) {
            if (e.key === "Enter" || e.key === " " || e.key === "Spacebar") {
                e.preventDefault();
                goToSelectedDay();
            }
        });

        grid.appendChild(cell);
    }
}
function changeCalendarMonth(direction) {
    currentDate.setMonth(currentDate.getMonth() + direction);
    loadCalendar();
}


function openNativePicker() {
    const picker = document.getElementById("hiddenDatePicker");
    if (picker.showPicker) {
        picker.showPicker();
    } else {
        picker.focus();
        picker.click();
    }
}

function jumpToDate() {
    const selected = document.getElementById("hiddenDatePicker").value;
    if (!selected) return;

    const dateObj = new Date(selected);
    currentDate = new Date(
        dateObj.getFullYear(),
        dateObj.getMonth()
    );

    loadCalendar();
}
function goToDay() {

    const date = document.getElementById("calendarDate").value;

    if (!date) {
        alert("Please select a date.");
        return;
    }

    // store selected date temporarily
    localStorage.setItem("selectedDate", date);

    window.location.href = "day.html";
}

function filterByDate() {

    const selectedDate = document.getElementById("selectedDate").value;
    if (!selectedDate) return;

    const transactions = getTransactions();
    const list = document.getElementById("transactionList");

    list.innerHTML = "";

    const filtered = transactions.filter(t =>
        t.date.startsWith(selectedDate)
    );

    if (filtered.length === 0) {
        list.innerHTML = "<p>No transactions on this date.</p>";
        return;
    }

    filtered.forEach(t => {
        list.innerHTML += `
            <div class="transaction-item">
                <div>
                    <strong>${t.title}</strong><br>
                    <small>${t.date}</small>
                </div>
                <div style="color:${t.type === 'income' ? 'green' : 'red'}">
                    ${t.type === 'income' ? '+' : '-'}${formatCurrency(t.amount)}
                </div>
            </div>
        `;
    });
}
