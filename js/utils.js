
const monthNames=[
"January","February","March","April","May","June",
"July","August","September","October","November","December"
];

function formatMoney(num){
return "₹"+Number(num).toLocaleString("en-IN");
}

// Turns "2026-07-05" into "05 Jul 2026" for display.
// Was being called from dashboard.js but never existed anywhere in the
// codebase, which threw a silent ReferenceError and stopped the whole
// transaction list from rendering.
function formatDateLabel(dateStr){
    if(!dateStr) return "";

    // Parse as local midnight, not UTC, so the date never shifts by a day.
    const d = new Date(dateStr + "T00:00:00");
    if(isNaN(d)) return dateStr;

    return d.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    });
}