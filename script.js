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

