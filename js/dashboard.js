let savedMonth = localStorage.getItem("selectedMonth");
let savedYear = localStorage.getItem("selectedYear");

let selectedMonth = savedMonth !== null ? Number(savedMonth) : new Date().getMonth();
let selectedYear = savedYear !== null ? Number(savedYear) : new Date().getFullYear();

function loadDashboard() {

const list = document.getElementById("transactionList");
if (!list) return;

const transactions = getTransactions();

if (transactions.length === 0) {

document.getElementById("totalIncome").innerText = "₹0";
document.getElementById("totalExpense").innerText = "₹0";
document.getElementById("totalBalance").innerText = "₹0";

loadCategoryChart([]);
loadMonthlyChart([]);
loadCurrent();
updateMonthLabel();
return;

}

let income = 0;
let expense = 0;


const currentMonth = selectedMonth;
const currentYear = selectedYear;

list.innerHTML = "";

// ⭐ filter current month transactions
const monthlyTransactions = transactions.filter(t => {
const d = new Date(t.date);
return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
});

// ⭐ calculate monthly income & expense
monthlyTransactions.forEach(t => {

if(t.type === "income"){
income += Number(t.amount);
}else{
expense += Number(t.amount);
}

});

// ⭐ show latest 10 transactions
const latestTransactions = [...monthlyTransactions]
.reverse()
.slice(0,10);

latestTransactions.forEach(t => {

list.innerHTML += `
<div class="transaction-item">

<div>
<strong>${t.title}</strong><br>
<small>${formatDateLabel(t.date)}</small>
</div>

<div style="color:${t.type === "income" ? "green" : "red"}">
${t.type === "income" ? "+" : "-"}${formatCurrency(t.amount)}
</div>

</div>
`;

});

// ⭐ update dashboard cards
document.getElementById("totalIncome").innerText = formatCurrency(income);
document.getElementById("totalExpense").innerText = formatCurrency(expense);
document.getElementById("totalBalance").innerText = formatCurrency(income - expense);



// ⭐ charts only for current month
loadCategoryChart(monthlyTransactions);
loadMonthlyChart(monthlyTransactions);

loadCurrent();
updateMonthLabel();

}
function changeMonth(direction){

selectedMonth += direction;

if(selectedMonth > 11){
selectedMonth = 0;
selectedYear++;
}

if(selectedMonth < 0){
selectedMonth = 11;
selectedYear--;
}
localStorage.setItem("selectedMonth", selectedMonth);
localStorage.setItem("selectedYear", selectedYear);
updateMonthLabel();
loadDashboard();
loadCurrent();


}
let financeChart;

function loadCategoryChart(transactions){

const ctx = document.getElementById("financeChart");
if(!ctx) return;

// ✅ ONLY EXPENSES
const expenseTransactions = transactions.filter(t => t.type === "expense");

let categories = {};

// ❗ FIX: handle no expense case properly
if(expenseTransactions.length === 0){
    categories = { "No Spending": 1 };
}else{
    expenseTransactions.forEach(t=>{
        const cat = t.category || "Other";

        categories[cat] =
        (categories[cat] || 0) + Number(t.amount || 0);
    });
}

// ✅ destroy safely
if(financeChart){
    financeChart.destroy();
}

financeChart = new Chart(ctx,{
type:'doughnut',
data:{
labels:Object.keys(categories),
datasets:[{
data:Object.values(categories),
backgroundColor:[
"#e74c3c","#3498db","#2ecc71",
"#f39c12","#9b59b6"
]
}]
}
});

}
let monthlyChart;
function loadMonthlyChart(transactions){

const monthlyIncome = new Array(12).fill(0);
const monthlyExpense = new Array(12).fill(0);
transactions.forEach(t=>{

const month = new Date(t.date).getMonth();

if(t.type === "income"){
monthlyIncome[month] += Number(t.amount);
}else{
monthlyExpense[month] += Number(t.amount);
}

});

const ctx = document.getElementById("monthlyChart");
if(!ctx) return;

// ⭐ destroy previous chart
if(monthlyChart){
monthlyChart.destroy();
}

monthlyChart = new Chart(ctx,{
type:'bar',
data:{
labels:[
"Jan","Feb","Mar","Apr","May","Jun",
"Jul","Aug","Sep","Oct","Nov","Dec"
],
datasets:[
{
label:"Income",
data:monthlyIncome,
backgroundColor:"#2ecc71"
},
{
label:"Expense",
data:monthlyExpense,
backgroundColor:"#e74c3c"
}
]
},
options:{
responsive:true,
plugins:{
legend:{
position:'top'
}
}
}
});

}

function updateMonthLabel(){

const months = [
"January","February","March","April","May","June",
"July","August","September","October","November","December"
];

const label = document.getElementById("navMonthLabel");

if(label){
label.innerText =
months[selectedMonth] + " " + selectedYear + " ▼";
}

}

function nextMonth(){

selectedMonth++;

if(selectedMonth > 11){
selectedMonth = 0;
selectedYear++;
}

updateMonthLabel();
loadDashboard();

}

function prevMonth(){

selectedMonth--;

if(selectedMonth < 0){
selectedMonth = 11;
selectedYear--;
}

updateMonthLabel();
loadDashboard();

}
function toggleMonthDropdown(){

const dropdown = document.getElementById("monthDropdown");

if(dropdown.style.display === "block"){
dropdown.style.display = "none";
return;
}
renderMonthDropdown();
dropdown.style.display = "block";



}
function renderMonthDropdown(){

const dropdown = document.getElementById("monthDropdown");

const months = [
"Jan","Feb","Mar","Apr","May","Jun",
"Jul","Aug","Sep","Oct","Nov","Dec"
];

let yearOptions = "";

for(let y = 2020; y <= 2035; y++){
yearOptions += `<option value="${y}" ${y===selectedYear?"selected":""}>${y}</option>`;
}

dropdown.innerHTML = `
<button class="this-month-option" onclick="goToCurrentMonth()">
This Month
</button>

<select id="yearDropdown" class="year-select" onchange="changeYear()">
${yearOptions}
</select>

<div class="month-grid" id="monthGrid"></div>
`;
// ⭐ FORCE correct selected year
const yearDropdown = document.getElementById("yearDropdown");
if(yearDropdown){
    yearDropdown.value = selectedYear;
}
const grid = document.getElementById("monthGrid");
months.forEach((m,index)=>{

const item = document.createElement("div");
item.innerText = m;

if(index === selectedMonth){
item.classList.add("active-month");
}
item.onclick = function(){

selectedMonth = index;
localStorage.setItem("selectedMonth", selectedMonth);
localStorage.setItem("selectedYear", selectedYear);
updateMonthLabel();
loadDashboard();
loadCurrent();   // 🔥 ADD THIS


document.getElementById("monthDropdown").style.display = "none";

};

grid.appendChild(item);

});


}
function changeYear(){

selectedYear = Number(document.getElementById("yearDropdown").value);
localStorage.setItem("selectedMonth", selectedMonth);
localStorage.setItem("selectedYear", selectedYear);
updateMonthLabel();
loadDashboard();
updateBudgetUI();

}
function goToCurrentMonth(){

const today = new Date();

selectedMonth = today.getMonth();
selectedYear = today.getFullYear();
localStorage.setItem("selectedMonth", selectedMonth);
localStorage.setItem("selectedYear", selectedYear);
// ✅ update dashboard
updateMonthLabel();
loadDashboard();
updateBudgetUI();
// ✅ CLOSE dropdown FIRST
const dropdown = document.getElementById("monthDropdown");
if(dropdown) dropdown.style.display = "none";

// ✅ THEN reopen fresh (forces correct UI)
setTimeout(() => {
    toggleMonthDropdown();
}, 50);

}
