var total_balance;
var login = localStorage.getItem("login");
console.log(login);
//localStorage.clear();
//localStorage.setItem("para","[]");
//localStorage.setItem("total_balance","30000");
var doc = document;
var tb = localStorage.getItem("total_balance") || "[]";
var para = localStorage.getItem("para") || "[]";
var trans = localStorage.getItem("transactions") || "[]";
if (login == "true") {
    window.onload = function () {
        total_balance = parseInt(tb);
        var balc = doc.getElementById("bal");
        if (balc)
            balc.innerHTML = total_balance.toString();
        else
            console.log("error");
        var storedPara = JSON.parse(para) || [];
        var list = document.getElementById("lis");
        if (list)
            list.innerHTML = storedPara.map(function (para) { return "<li>".concat(para, "</li>"); }).join(" ");
        calculateTotals();
    };
}
else {
    window.location.href = "login.html";
}
function transaction() {
    var amount = doc.querySelector(".amount");
    var categ = doc.getElementById("category");
    var desc = doc.querySelector(".description");
    if (amount && categ && desc) {
        var amt = parseInt(amount.value);
        var category = categ.value;
        var date = new Date();
        var today = date.toISOString().split('T')[0]; // YYYY-MM-DD format
        var description = desc.value;
        var storedPara = JSON.parse(para) || [];
        console.log("category" + category);
        if (category == "income") {
            total_balance += amt;
        }
        else {
            total_balance -= amt;
        }
        var transactionDetails = {
            description: description,
            amount: amt,
            category: category,
            date: today
        };
        var transactions = JSON.parse(trans) || [];
        transactions.push(transactionDetails);
        localStorage.setItem("transactions", JSON.stringify(transactions));
        localStorage.setItem("total_balance", total_balance.toString());
        var balc = doc.getElementById("bal");
        if (balc)
            balc.innerHTML = total_balance.toString();
        storedPara.push("".concat(description, " - \u20B9").concat(amt, " (").concat(category, ") on ").concat(today));
        localStorage.setItem("para", JSON.stringify(storedPara));
        var list = document.getElementById("lis");
        if (list)
            list.innerHTML = storedPara.map(function (para) { return "<li>".concat(para, "</li>"); }).join("");
        else
            console.log("error");
        calculateTotals();
    }
}
function calculateTotals() {
    var transactions = JSON.parse(trans) || [];
    var today = new Date().toISOString().split('T')[0];
    var weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    var monthStart = new Date();
    monthStart.setDate(1);
    var dailyTota = 0, weeklyTota = 0, monthlyTota = 0;
    transactions.forEach(function (_a) {
        var amount = _a.amount, category = _a.category, date = _a.date;
        var transactionDate = new Date(date);
        var signedAmount = category === "income" ? amount : -amount;
        if (date === today) {
            dailyTota += signedAmount;
        }
        if (transactionDate >= weekStart) {
            weeklyTota += signedAmount;
        }
        if (transactionDate >= monthStart) {
            monthlyTota += signedAmount;
        }
    });
    var dailyT = doc.getElementById("dailyTotal");
    var weeklyT = doc.getElementById("weeklyTotal");
    var monthlyT = doc.getElementById("monthlyTotal");
    if (dailyT && weeklyT && monthlyT) {
        dailyT.innerHTML = "Today's Total: \u20B9".concat(dailyTota);
        weeklyT.innerHTML = "This Week's Total: \u20B9".concat(weeklyTota);
        monthlyT.innerHTML = "This Month's Total: \u20B9".concat(monthlyTota);
    }
}
function exc() {
    var transactions = JSON.parse(trans) || [];
    var formattedData = [["Description", "Amount", "Category", "Date"]];
    transactions.forEach(function (_a) {
        var description = _a.description, amount = _a.amount, category = _a.category, date = _a.date;
        formattedData.push([description, amount, category, date]);
    });
    var wb = XLSX.utils.book_new();
    var ws = XLSX.utils.aoa_to_sheet(formattedData);
    ws['!cols'] = [
        { wch: 25 },
        { wch: 10 },
        { wch: 15 },
        { wch: 15 }
    ];
    XLSX.utils.book_append_sheet(wb, ws, "Transactions");
    XLSX.writeFile(wb, "transactions.xlsx");
}
