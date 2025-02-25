declare const XLSX: any;
let total_balance : number
let login = localStorage.getItem("login");
console.log(login);
//localStorage.clear();

//localStorage.setItem("para","[]");
//localStorage.setItem("total_balance","30000");

const doc : Document = document;

let tb = localStorage.getItem("total_balance") || "[]";
let para = localStorage.getItem("para") || "[]"
let trans = localStorage.getItem("transactions") || "[]"
if(login=="true")
{
    
    window.onload = function () {
        total_balance = parseInt(tb);
        const balc = doc.getElementById("bal") as HTMLInputElement | null;
        if(balc)
        balc.innerHTML = total_balance.toString();
        else
        console.log("error")
        let storedPara = JSON.parse(para) || [];
        let list = document.getElementById("lis");
        if(list)
        list.innerHTML = storedPara.map((para:string) => `<li>${para}</li>`).join(" ");   
        calculateTotals();  
    };
}

else
{
    window.location.href = "login.html";
}

function transaction() {

    const amount = doc.querySelector(".amount") as HTMLInputElement | null;
    const categ = doc.getElementById("category") as HTMLInputElement | null;
    const desc = doc.querySelector(".description") as HTMLInputElement | null;
    if(amount && categ && desc)
    {
    let amt = parseInt(amount.value);
    let category = categ.value;
    let date = new Date();
    let today = date.toISOString().split('T')[0]; // YYYY-MM-DD format
    let description = desc.value;
    
    
    let storedPara = JSON.parse(para) || [];
   
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
     let transactions = JSON.parse(trans) || [];

    transactions.push(transactionDetails);
    localStorage.setItem("transactions", JSON.stringify(transactions));
    localStorage.setItem("total_balance", total_balance.toString());
    const balc = doc.getElementById("bal") as HTMLInputElement | null;
    if(balc)
    balc.innerHTML = total_balance.toString();
    storedPara.push(`${description} - ₹${amt} (${category}) on ${today}`);
    localStorage.setItem("para", JSON.stringify(storedPara));
    let list = document.getElementById("lis");
    if(list)
    list.innerHTML = storedPara.map((para:string) => `<li>${para}</li>`).join("");
    else
    console.log("error");

    calculateTotals();
}
}



function calculateTotals() {
    let transactions = JSON.parse(trans) || [];
    let today = new Date().toISOString().split('T')[0];
    let weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay()); 
    let monthStart = new Date();
    monthStart.setDate(1); 

    let dailyTota = 0, weeklyTota = 0, monthlyTota = 0;

    transactions.forEach(({ amount , category, date }) => {
        let transactionDate = new Date(date);
        
    
        let signedAmount = category === "income" ? amount : -amount;

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
    const dailyT = doc.getElementById("dailyTotal") as HTMLInputElement | null;
const weeklyT = doc.getElementById("weeklyTotal") as HTMLInputElement | null;
const monthlyT = doc.getElementById("monthlyTotal") as HTMLInputElement | null;
    if(dailyT && weeklyT && monthlyT)
    {
        dailyT.innerHTML = `Today's Total: ₹${dailyTota}`;
        weeklyT.innerHTML = `This Week's Total: ₹${weeklyTota}`;
        monthlyT.innerHTML = `This Month's Total: ₹${monthlyTota}`;

    }
 
}

function exc() {
    let transactions  = JSON.parse(trans) || [];
    
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

