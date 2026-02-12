# Expense Tracker (Vanilla JS)

A sleek, lightweight expense tracking application built with Vanilla JavaScript, CSS3, and HTML5. This project features real-time balance updates, transaction filtering, and data persistence using the browser's LocalStorage.

## Features

* **Real-time Calculations:** Automatically calculates Total Balance, Income, and Expenses.
* **Monthly Spending Limit:** Set a custom budget and monitor progress with a dynamic, color-coded progress bar.
* **Savings Goal Management:** Dedicated section to track savings progress with the ability to deposit from or withdraw to your main wallet.
* **Visual Data Overview:** Integrated Chart.js doughnut chart to visualize spending by category.
* **Data Persistence:** Uses `localStorage` to ensure your data and theme settings persist after page refreshes.
* **Theme Support:** Dark and Light mode toggle with automatic persistence.
* **Dynamic Filtering:** Filter transactions by "Income," "Expense," or view "All."
* **Live Search:** Search through your transaction history by description in real-time.
* **Responsive Design:** Clean, modern UI designed for both mobile and desktop use.
* **Report Generation:** Built-in print functionality to generate a physical or PDF report of your current dashboard.

---

## Installation and Setup

Follow these steps to get a local copy up and running:

### 1. Clone the Repository

Open your terminal and run:

```bash
git clone https://github.com/your-username/expense-tracker.git

```

### 2. Navigate to the Directory

```bash
cd expense-tracker

```

### 3. Run the Project

Since this project uses pure frontend technologies, you do not need to install any dependencies. Simply open the `index.html` file in your preferred browser:

* **Option A:** Right-click `index.html` and select **Open with Browser**.
* **Option B (Recommended):** Use the **VS Code Live Server** extension for a better development experience.

---

## Project Structure

```text
├── index.html      # Main structure and UI
├── style.css       # Custom styling, variables, and layout
├── script.js       # Modularized application logic and state management
└── README.md       # Project documentation

```

---

## How to Use

1. **Set Goals:** Use the Spending Limit and Savings Goal inputs to define your monthly targets.
2. **Add Transaction:** Enter a description, amount, and category. Use positive numbers for income and negative numbers for expenses.
3. **Manage Savings:** Use the Piggy Bank icon to move funds to savings, or the Wallet icon to withdraw savings back to your main balance.
4. **Edit and Delete:** Use the action buttons next to each transaction in the history list to modify or remove records.
5. **New Month Reset:** Use the Reset Month button to clear current income and expenses while preserving your long-term savings data.
6. **Search and Filter:** Use the search bar or category filters to drill down into specific transaction data.

---

## Technical Modularization

The JavaScript logic is organized into several key modules for maintainability:

* **Global State:** Manages the transaction array and Chart.js instance.
* **Theme Engine:** Handles the logic for switching and saving light/dark modes.
* **Calculations:** Pure functions for processing totals for income, expenses, and savings.
* **UI Rendering:** A centralized function that updates the DOM, charts, and progress bars.
* **Event Handlers:** Specific logic for handling user interactions like saving, editing, and resetting data.

---

## License

Distributed under the MIT License. See `LICENSE` for more information.

---