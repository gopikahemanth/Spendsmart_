function saveBudget(){

const input = document.getElementById("budgetInput");
const budget = Number(input.value);

if(!budget){
showToast("Enter budget");
return;
}

const user = localStorage.getItem("currentUser");

const transactions = JSON.parse(
localStorage.getItem("transactions_" + user)
) || [];

let totalIncome = 0;

transactions.forEach(t=>{
if(t.type === "income"){
totalIncome += Number(t.amount);
}
});

if(budget > totalIncome){
showToast("Budget exceeds total income");
input.value = "";
return;
}

// ⭐ use selected month instead of current month
const year = selectedYear;
const month = selectedMonth;

const key = "budget_" + user + "_" + year + "_" + month;

// save budget
localStorage.setItem(key, budget);

// clear input
input.value = "";

// refresh UI
loadCurrent();
loadHistory();
if(typeof loadDashboard === "function") loadDashboard();

}

function calculateSpent(month, year){

const user = localStorage.getItem("currentUser");

const transactions = JSON.parse(
localStorage.getItem("transactions_" + user)
) || [];

let spent = 0;

transactions.forEach(t => {

const [y, m, d] = t.date.split("-").map(Number);

// use the function parameters
if((m - 1) === month && y === year){

if(t.type === "expense"){
spent += Number(t.amount);
}

}

});

return spent;

}
function loadCurrent(){
selectedMonth = Number(localStorage.getItem("selectedMonth")) ?? selectedMonth;
selectedYear = Number(localStorage.getItem("selectedYear")) ?? selectedYear;
// ✅ ALWAYS sync with latest saved month/year
let savedMonth = localStorage.getItem("selectedMonth");
let savedYear = localStorage.getItem("selectedYear");

if(savedMonth !== null && savedYear !== null){
    selectedMonth = Number(savedMonth);
    selectedYear = Number(savedYear);
}

const user = localStorage.getItem("currentUser");

const month = localStorage.getItem("selectedMonth") !== null
    ? Number(localStorage.getItem("selectedMonth"))
    : selectedMonth;

const year = localStorage.getItem("selectedYear") !== null
    ? Number(localStorage.getItem("selectedYear"))
    : selectedYear;
const key = "budget_" + user + "_" + year + "_" + month;
// ✅ DEBUG (optional – remove later)
console.log("Checking budget key:", key);

const rawBudget = localStorage.getItem(key);
const budget = rawBudget !== null ? Number(rawBudget) : null;

const spent = calculateSpent(month, year);



const budgetEl = document.getElementById("budgetValue");
const spentEl = document.getElementById("spentValue");
const remainEl = document.getElementById("remainingValue");

if(!budgetEl) return;

/* Budget */
budgetEl.innerText = formatCurrency(budget);
budgetEl.style.color = "#000";

/* Spent */
spentEl.innerText = formatCurrency(spent);

if(budget === null){
    budgetEl.innerText = "—";
    spentEl.innerText = formatCurrency(0);
    remainEl.innerText = "—";
    remainEl.style.color = "#999";
    return;
}
// ✅ SHOW VALUES WHEN BUDGET EXISTS
budgetEl.innerText = formatCurrency(budget);
spentEl.innerText = formatCurrency(spent);
const remaining = budget - spent;

remainEl.innerText = formatCurrency(remaining);
remainEl.style.color = remaining < 0 ? "red" : "#2ecc71";
/* Progress */
const progress = budget  ? (spent / budget) * 100 : 0;

const progressFill = document.getElementById("progressFill");
const progressText = document.getElementById("progressText");

if(progressFill){

const percent = Math.min(progress,100);

progressFill.style.width = percent + "%";
progressText.innerText = percent.toFixed(1) + "% of budget used";

if(percent > 80){
progressFill.style.background = "#e74c3c";
}else if(percent > 50){
progressFill.style.background = "#f39c12";
}else{
progressFill.style.background = "#2ecc71";
}

}
}
function loadHistory(){

const table = document.getElementById("historyTable");

table.innerHTML="";

const year = Number(document.getElementById("yearFilter").value);

for(let m=0;m<12;m++){

const user = localStorage.getItem("currentUser");

const key = "budget_" + user + "_" + year + "_" + m;

const budget = Number(localStorage.getItem(key));

if(!budget) continue;

const spent = calculateSpent(m,year);

const remaining = budget-spent;

table.innerHTML+=`
<tr>
<td>${monthNames[m]} ${year}</td>
<td>${formatMoney(budget)}</td>
<td>${formatMoney(spent)}</td>
<td>${formatMoney(remaining)}</td>
</tr>
`;

}

}
function loadYearFilter(){

const select=document.getElementById("yearFilter");

const year=new Date().getFullYear();

for(let y=year;y>=2020;y--){
select.innerHTML+=`<option value="${y}">${y}</option>`;
}

}
function updateBudgetUI(){
    loadCurrent();
}
function clearBudget(){

const user = localStorage.getItem("currentUser");

// current selected month/year
const month = selectedMonth;
const year = selectedYear;

const key = "budget_" + user + "_" + year + "_" + month;

if(!confirm("Clear this month's budget?")) return;

// remove budget
localStorage.removeItem(key);

// refresh UI
loadCurrent();
loadHistory();

}