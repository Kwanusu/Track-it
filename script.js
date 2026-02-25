/**
 * --- GLOBAL STATE & INITIALIZATION ---
 * Managing the core data and tracker variables.
 */
let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
let myChart;
let editIndex = -1;

// Cache DOM elements for better performance
const elements = {
    desc: document.getElementById('desc'),
    amount: document.getElementById('amount'),
    category: document.getElementById('category'),
    addBtn: document.getElementById('submit'),
    list: document.getElementById('list'),
    balance: document.getElementById('balance'),
    income: document.getElementById('income'),
    expense: document.getElementById('expense'),
    themeToggle: document.getElementById('themeToggle'),
    savingsTarget: document.getElementById('savings-target'),
    spendingInput: document.getElementById('spending-goal-input')
};

/**
 * --- THEME ENGINE ---
 * Handles dark/light mode switching and persistence.
 */
const initTheme = () => {
    const isDark = localStorage.getItem('theme') === 'dark';
    if (isDark) document.body.classList.add('dark-theme');
    updateThemeIcon(isDark);
};

const updateThemeIcon = (isDark) => {
    elements.themeToggle.innerHTML = isDark 
        ? '<i class="fa-solid fa-sun"></i>' 
        : '<i class="fa-solid fa-moon"></i>';
};

elements.themeToggle.onclick = () => {
    const isDark = document.body.classList.toggle('dark-theme');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    updateThemeIcon(isDark);
    renderUI(); // Redraw UI for chart colors
};

/**
 * --- CALCULATIONS & DATA PROCESSING ---
 * Pure functions to crunch the numbers.
 */
const calculateTotals = (data) => {
    let totals = { income: 0, expense: 0, savings: 0, categories: {} };

    data.forEach(item => {
        if (item.category === "Savings") {
            totals.savings += item.amount;
        } else if (item.amount > 0) {
            totals.income += item.amount;
        } else {
            const absAmount = Math.abs(item.amount);
            totals.expense += absAmount;
            totals.categories[item.category] = (totals.categories[item.category] || 0) + absAmount;
        }
    });

    totals.balance = totals.income - totals.expense - totals.savings;
    return totals;
};

/**
 * --- UI RENDERING ENGINE ---
 * Functions responsible for updating what the user sees.
 */
function renderUI(filteredTransactions = transactions) {
    elements.list.innerHTML = "";
    const totals = calculateTotals(filteredTransactions);

    // Render Transaction List
    filteredTransactions.forEach((item) => {
        const realIndex = transactions.indexOf(item);
        const li = document.createElement('li');
        li.classList.add(item.amount > 0 && item.category !== "Savings" ? 'plus' : 'minus');

        li.innerHTML = `
            <div class='container'>
                <strong>${item.description}</strong> <small>(${item.category})</small>
                <br><span style="font-size: 0.7rem; color: gray;">${item.date}</span>
            </div>
            <div class="action-buttons">
                <span class="money-display">Kes. ${Math.abs(item.amount).toFixed(2)}</span>
                <button class="edit" onclick="handleEdit(${realIndex})"><i class="fa-solid fa-pen"></i></button>
                <button class="delete" onclick="handleDelete(${realIndex})"><i class="fa-solid fa-trash"></i></button>
            </div>
        `;
        elements.list.appendChild(li);
    });

    // Update Text Stats
    elements.balance.textContent = `Kes. ${totals.balance.toFixed(2)}`;
    elements.income.textContent = `+Kes. ${totals.income.toFixed(2)}`;
    elements.expense.textContent = `-Kes. ${totals.expense.toFixed(2)}`;

    // Update Visual Modules
    updateChart(totals.categories);
    updateProgressBar(totals.expense);
    updateSavingsProgress(totals.savings);
}

function updateProgressBar(totalExpense) {
    const limit = parseFloat(localStorage.getItem('spendingLimit')) || 10000;
    const fill = document.getElementById('progress-fill');
    const percent = Math.min((totalExpense / limit) * 100, 100);

    fill.style.width = `${percent}%`;
    document.getElementById('goal-percent').textContent = `${Math.round(percent)}%`;
    
    const remaining = limit - totalExpense;
    document.getElementById('goal-remaining').textContent = remaining > 0 
        ? `Remaining: Kes. ${remaining.toFixed(2)}` 
        : `Limit Exceeded!`;

    // Threshold coloring
    fill.style.background = percent < 50 ? 'var(--success)' : (percent < 80 ? '#fbbf24' : 'var(--danger)');
}

function updateSavingsProgress(totalSaved) {
    const target = parseFloat(localStorage.getItem('savingsTarget')) || 1;
    const fill = document.getElementById('savings-fill');
    const percent = Math.min((totalSaved / target) * 100, 100);

    fill.style.width = `${percent}%`;
    document.getElementById('savings-percent').textContent = `${Math.round(percent)}%`;
    document.getElementById('savings-summary').textContent = `Saved: Kes. ${totalSaved.toFixed(2)} / Kes. ${target.toFixed(2)}`;
    fill.style.boxShadow = percent >= 100 ? '0 0 10px var(--primary)' : 'none';
}

/**
 * --- TRANSACTION HANDLERS ---
 * Logic for adding, editing, and deleting data.
 */
const saveToStorage = () => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
    renderUI();
};

elements.addBtn.onclick = () => {
    const desc = elements.desc.value.trim();
    const amt = parseFloat(elements.amount.value);
    const cat = elements.category.value;

    if (!desc || isNaN(amt)) return alert("Please fill all fields");

    const transaction = { 
        description: desc, 
        amount: amt, 
        category: cat, 
        date: new Date().toLocaleString() 
    };

    if (editIndex === -1) {
        transactions.push(transaction);
    } else {
        transactions[editIndex] = { ...transaction, date: transaction.date + " (Edited)" };
        editIndex = -1;
        elements.addBtn.innerHTML = '<i class="fa-solid fa-save"></i> Save Transaction';
    }

    saveToStorage();
    elements.desc.value = "";
    elements.amount.value = "";
};

window.handleDelete = (index) => {
    if (confirm("Delete transaction?")) {
        transactions.splice(index, 1);
        saveToStorage();
    }
};

window.handleEdit = (index) => {
    const item = transactions[index];
    elements.desc.value = item.description;
    elements.amount.value = item.amount;
    elements.category.value = item.category;
    elements.addBtn.innerHTML = '<i class="fa-solid fa-rotate"></i> Update';
    editIndex = index;
    window.scrollTo({ top: 0, behavior: 'smooth' });
};

/**
 * --- SAVINGS & GOAL SETTERS ---
 */
window.handleSavingsAction = (type, multiplier) => {
    const input = document.getElementById('savings-deposit');
    const amt = parseFloat(input.value);
    
    if (isNaN(amt) || amt <= 0) return alert("Enter valid amount");

    if (multiplier === -1) {
        const current = calculateTotals(transactions).savings;
        if (amt > current) return alert("Insufficient savings!");
    }

    transactions.push({
        description: `${type} from Savings`,
        amount: amt * multiplier,
        category: "Savings",
        date: new Date().toLocaleString()
    });

    saveToStorage();
    input.value = "";
};

// Triggered when moving money from Wallet -> Savings
document.getElementById('deposit-btn').onclick = () => handleSavingsAction("Deposit", 1);

// Triggered when moving money from Savings -> Wallet
document.getElementById('withdraw-btn').onclick = () => handleSavingsAction("Withdrawal", -1);

window.handleSavingsAction = (type, multiplier) => {
    const input = document.getElementById('savings-deposit');
    const amt = parseFloat(input.value);
    
    if (isNaN(amt) || amt <= 0) {
        alert("Please enter a valid amount.");
        return;
    }

    // Logic Check: If withdrawing, ensure user actually has that much saved
    if (multiplier === -1) {
        const currentSavedTotal = calculateTotals(transactions).savings;
        if (amt > currentSavedTotal) {
            alert("Insufficient funds in savings to withdraw to wallet!");
            return;
        }
    }

    // Create the transaction record
    transactions.push({
        description: type === "Withdrawal" ? "Withdrawn to Wallet" : "Saved from Wallet",
        amount: amt * multiplier, // Negative amount for withdrawal reduces the 'savings' total
        category: "Savings",
        date: new Date().toLocaleString()
    });

    saveToStorage();
    input.value = "";
    
    const message = type === "Withdrawal" 
        ? `Kes. ${amt.toFixed(2)} moved back to your Wallet!` 
        : `Kes. ${amt.toFixed(2)} added to Savings!`;
    alert(message);
};

document.getElementById('deposit-btn').onclick = () => handleSavingsAction("Deposit", 1);
document.getElementById('withdraw-btn').onclick = () => handleSavingsAction("Withdrawal", -1);

document.getElementById('set-spending-goal-btn').onclick = () => {
    localStorage.setItem('spendingLimit', elements.spendingInput.value);
    renderUI();
    alert("Limit updated!");
};

document.getElementById('set-goal-btn').onclick = () => {
    localStorage.setItem('savingsTarget', elements.savingsTarget.value);
    renderUI();
    alert("Goal updated!");
};

document.getElementById('resetMonthBtn').onclick = () => {
    if (confirm("Clear all income/expenses for the new month?")) {
        transactions = transactions.filter(t => t.category === "Savings");
        saveToStorage();
    }
};

/**
 * --- CHART, PRINT & FILTERS ---
 */
function updateChart(data) {
    const ctx = document.getElementById('expenseChart').getContext('2d');
    const isDark = document.body.classList.contains('dark-theme');
    if (myChart) myChart.destroy();
    if (Object.keys(data).length === 0) return;

    myChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: Object.keys(data),
            datasets: [{
                data: Object.values(data),
                backgroundColor: ['#6366f1', '#f43f5e', '#fbbf24', '#22c55e', '#94a3b8'],
                borderWidth: isDark ? 0 : 2
            }]
        },
        options: { 
            responsive: true, 
            maintainAspectRatio: false,
            plugins: { legend: { labels: { color: isDark ? '#f8fafc' : '#1e293b' } } }
        }
    });
}

// Filter buttons
document.getElementById('all').onclick = () => renderUI();
document.getElementById('incomeBtn').onclick = () => renderUI(transactions.filter(t => t.amount > 0 && t.category !== "Savings"));
document.getElementById('expenseBtn').onclick = () => renderUI(transactions.filter(t => t.amount < 0));
document.getElementById('search').oninput = (e) => {
    const kw = e.target.value.toLowerCase();
    renderUI(transactions.filter(t => t.description.toLowerCase().includes(kw)));
};

document.getElementById('printBtn').onclick = () => window.print();

/**
 * --- APP STARTUP ---
 */
const startApp = () => {
    initTheme();
    elements.savingsTarget.value = localStorage.getItem('savingsTarget') || 0;
    elements.spendingInput.value = localStorage.getItem('spendingLimit') || 10000;
    renderUI();
};

startApp();