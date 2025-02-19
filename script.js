let total_balance;

login = localStorage.getItem("login");
console.log(login);
//localStorage.clear();

//localStorage.setItem("para","[]");
//localStorage.setItem("total_balance",30000);

total_balance = localStorage.getItem("total_balance");

if(login=="true")
{
    window.onload = function () {
        total_balance = parseInt(localStorage.getItem("total_balance"));
        document.getElementById("bal").innerHTML = total_balance;
        let storedPara = JSON.parse(localStorage.getItem("para")) || [];
        let list = document.getElementById("lis");
        list.innerHTML = storedPara.map((para) => `<li>${para}</li>`).join(" ");   
        calculateTotals();  
    };
}

else
{
    window.location.href = "login.html";
}

function transaction() {
    let amt = parseInt(document.querySelector(".amount").value);
    let category = document.getElementById("category").value;
    let date = new Date();
    let today = date.toISOString().split('T')[0];
    let description = document.querySelector(".description").value;
    let storedPara = JSON.parse(localStorage.getItem("para")) || [];
   
    console.log("category" + category);
    if (category == "income") {
        total_balance += amt;
    } else {
        total_balance -= amt;
    }
        let transactionDetails = {
        description: description,
        amount: amt,
        category: category,
        date: today
    };
     let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

    transactions.push(transactionDetails);
    localStorage.setItem("transactions", JSON.stringify(transactions));
    localStorage.setItem("total_balance", total_balance);
    document.getElementById("bal").innerHTML = total_balance;

    storedPara.push(`${description} - ₹${amt} (${category}) on ${today}`);
    localStorage.setItem("para", JSON.stringify(storedPara));
    let list = document.getElementById("lis");
    list.innerHTML = storedPara.map((para) => `<li>${para}</li>`).join("");

    calculateTotals();
}

function calculateTotals() {
    let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
    let today = new Date().toISOString().split('T')[0];
    let weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay()); 
    let monthStart = new Date();
    monthStart.setDate(1);

    let dailyTotal = 0, weeklyTotal = 0, monthlyTotal = 0;

    transactions.forEach(({ amount, category, date }) => {
        let transactionDate = new Date(date);
        
    
        let signedAmount = category === "income" ? amount : -amount;

        if (date === today) {
            dailyTotal += signedAmount;
        }
        if (transactionDate >= weekStart) {
            weeklyTotal += signedAmount;
        }
        if (transactionDate >= monthStart) {
            monthlyTotal += signedAmount;
        }
    });

    document.getElementById("dailyTotal").innerHTML = `Today's Total: ₹${dailyTotal}`;
    document.getElementById("weeklyTotal").innerHTML = `This Week's Total: ₹${weeklyTotal}`;
    document.getElementById("monthlyTotal").innerHTML = `This Month's Total: ₹${monthlyTotal}`;
}



function exc() {
    let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
    
    let formattedData = [["Description", "Amount", "Category", "Date"]];

    transactions.forEach(({ description, amount, category, date }) => {
        formattedData.push([description, amount, category, date]);
    });

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(formattedData);
    
    ws['!cols'] = [
        { wch: 25 }, 
        { wch: 10 },
        { wch: 15 }, 
        { wch: 15 }  
    ];

    XLSX.utils.book_append_sheet(wb, ws, "Transactions");
    XLSX.writeFile(wb, "transactions.xlsx");
}

