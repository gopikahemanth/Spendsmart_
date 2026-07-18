// Note: applyDateFilter was moved to transaction.js to align with sheet.html loads.

function loadHistoryYearFilter(){

const select = document.getElementById("yearSelect");

if(!select) return;

const year = new Date().getFullYear();

for(let y=year;y>=2020;y--){

select.innerHTML += `<option value="${y}">${y}</option>`;

}

select.value = year;

}

function loadMonthYearSelectors(){

const monthSelect = document.getElementById("monthSelect");
const yearSelect = document.getElementById("yearSelect");

const months = [
"January","February","March","April","May","June",
"July","August","September","October","November","December"
];

months.forEach((m,i)=>{
const option = document.createElement("option");
option.value = i;
option.text = m;
monthSelect.appendChild(option);
});

const currentYear = new Date().getFullYear();

for(let y=currentYear-5; y<=currentYear+1; y++){

const option = document.createElement("option");
option.value = y;
option.text = y;

yearSelect.appendChild(option);

}

}
function goToSelectedMonth(){

const month = Number(document.getElementById("monthSelect").value);
const year = Number(document.getElementById("yearSelect").value);



}


function toggleMonthPicker(){

const picker = document.getElementById("monthPicker");

if(picker.style.display === "block"){
picker.style.display = "none";
}else{
picker.style.display = "block";
}

}
function openMonthPicker(){

const picker = document.getElementById("monthPicker");

if(picker.showPicker){
picker.showPicker();
}else{
picker.click();
}

}

function selectMonthFromPicker(){

const picker = document.getElementById("monthPicker").value;

if(!picker) return;

const date = new Date(picker);


}

function loadMonthlyHistory(){

const year = Number(document.getElementById("yearSelect").value);

const transactions = getTransactions();
const body = document.getElementById("historyBody");

body.innerHTML = "";

const monthlyData = {};

transactions.forEach(t=>{

const [y, m, d] = t.date.split("-").map(Number);

if(y !== year) return;

const month = m - 1;

if(!monthlyData[month]){
monthlyData[month] = {income:0,expense:0};
}

if(t.type === "income"){
monthlyData[month].income += Number(t.amount);
}else{
monthlyData[month].expense += Number(t.amount);
}

});

const months = [
"Jan","Feb","Mar","Apr","May","Jun",
"Jul","Aug","Sep","Oct","Nov","Dec"
];

for(let m=0;m<12;m++){

const data = monthlyData[m] || {income:0,expense:0};

const balance = data.income - data.expense;

body.innerHTML += `
<tr>
<td>${months[m]} ${year}</td>
<td>₹${data.income}</td>
<td>₹${data.expense}</td>
<td>₹${balance}</td>
</tr>
`;

}

}
function loadYearlyHistory(){

const transactions = getTransactions();
const body = document.getElementById("historyBody");

body.innerHTML = "";

const yearlyData = {};

transactions.forEach(t=>{

const [y, m, d] = t.date.split("-").map(Number);
const year = y;

if(!yearlyData[year]){
yearlyData[year] = {income:0,expense:0};
}

if(t.type === "income"){
yearlyData[year].income += Number(t.amount);
}else{
yearlyData[year].expense += Number(t.amount);
}

});

Object.keys(yearlyData).sort().forEach(year=>{

const data = yearlyData[year];
const balance = data.income - data.expense;

body.innerHTML += `
<tr>
<td>${year}</td>
<td>₹${data.income}</td>
<td>₹${data.expense}</td>
<td>₹${balance}</td>
</tr>
`;

});

}

