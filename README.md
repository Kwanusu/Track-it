# README: Modern Expense Tracker

## Project Overview

This is a lightweight, client-side financial management dashboard built with a focus on modularity and user experience. It allows users to track their liquidity while maintaining strict budgeting goals through visual feedback.

### Key Design Choices

* **Modular Architecture:** The JavaScript is separated into distinct functional areas (Theme, Calculation, UI Rendering, Event Handlers). This ensures that a change in the calculation logic (like how savings affect the balance) doesn't break the UI rendering.
* **Single Source of Truth:** The `transactions` array is the primary state. All UI elements—including the balance, the doughnut chart, and the progress bars—are re-rendered from this array whenever a change occurs, ensuring data consistency.
* **Accessibility (A11y) Integration:** We utilized ARIA roles (`progressbar`, `status`) and semantic HTML to ensure the dashboard is usable by individuals relying on assistive technologies.
* **Local Persistence:** By using `localStorage`, the app provides a "faux-database" experience, allowing users to return to their data without needing a backend server.
* **Visual Psychology:** The spending progress bar uses a traffic-light color system (Green < 50%, Amber < 80%, Red > 80%) to subconsciously guide user spending habits.

---

## Setup Instructions

### 1. Prerequisites

You only need a modern web browser (Chrome, Firefox, Edge, or Safari).

### 2. Local Installation

1. **Clone the Repository:**
```bash
git clone https://github.com/Kwanusu/finance.git

```

2. **Navigate to Folder:**
```bash
cd finance

```

### 3. Running the App

* **Direct Open:** Double-click `index.html` to view the app.
* **Live Server (Recommended):** If using VS Code, right-click `index.html` and select **"Open with Live Server"** to enable real-time updates as you edit the code.

---

# Grading Rubric for Learners

This rubric defines the criteria for evaluating the implementation of the Expense Tracker.

| Criteria | Satisfactory (Pass) | Excellent (Distinction) |
| --- | --- | --- |
| **Logic & Math** | Correctly calculates balance, income, and expenses from the array. | Implements complex logic for savings withdrawals and "limit exceeded" alerts. |
| **Code Structure** | Code is contained in a single script with basic functions. | Code is fully modularized with clear separation of concerns and pure functions. |
| **Data Persistence** | Transactions are saved to and loaded from `localStorage`. | Persistence includes user preferences like Dark/Light theme and custom budget limits. |
| **UI/UX Design** | Responsive layout that works on mobile and desktop. | Includes micro-interactions, CSS transitions, and dynamic Chart.js integration. |
| **Accessibility** | Includes basic `alt` tags and standard HTML form labels. | Full ARIA implementation, keyboard navigability, and `aria-live` regions for dynamic updates. |
| **Code Quality** | Minimal comments; mostly understandable variable naming. | Professional documentation, JSDoc comments, and consistent naming conventions. |

---