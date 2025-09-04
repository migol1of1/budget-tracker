// nav
function showPage(pageId) {
  const pages = document.querySelectorAll(".page-content");
  pages.forEach((page) => page.classList.add("hidden"));

  document.getElementById(`page-${pageId}`).classList.remove("hidden");

  const navItems = document.querySelectorAll(".nav-item");
  navItems.forEach((item) => item.classList.remove("bg-blue-600"));
  document.getElementById(`nav-${pageId}`).classList.add("bg-blue-600");
}

// extra expense
function toggleQuickExpense() {
  const menu = document.getElementById("quick-expense-menu");
  menu.classList.toggle("hidden");
}

function parseCurrency(currencyText) {
  return parseFloat(currencyText.replace("₱", "").replace(/,/g, "")) || 0;
}

function formatCurrency(amount) {
  return `₱${amount.toLocaleString("en-PH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

document.addEventListener("click", function (event) {
  const menu = document.getElementById("quick-expense-menu");
  const button = document.getElementById("quick-expense-button");

  if (!menu.contains(event.target) && !button.contains(event.target)) {
    menu.classList.add("hidden");
  }
});

let currentBudget = 15500;

function addQuickExpense() {
  const amount = document.getElementById("quick-amount").value;
  const description = document.getElementById("quick-description").value;

  if (!amount || !description) {
    alert("Please enter both amount and description.");
    return;
  }

  const expenseAmount = parseFloat(amount);

  if (expenseAmount <= 0 || isNaN(expenseAmount)) {
    alert("Please enter a valid amount greater than 0.");
    return;
  }

  const currentBudget = parseCurrency(
    document.getElementById("remaining-budget").textContent
  );

  const newBudget = currentBudget - expenseAmount;
  const budgetElement = document.getElementById("remaining-budget");
  budgetElement.textContent = formatCurrency(newBudget);

  if (newBudget < 0) {
    budgetElement.style.color = "#ef4444";
    budgetElement.classList.add("font-bold");
  } else if (newBudget < currentBudget * 0.1) {
    budgetElement.style.color = "#f59e0b";
  } else {
    budgetElement.style.color = "";
    budgetElement.classList.remove("font-bold");
  }

  document.getElementById("quick-amount").value = "";
  document.getElementById("quick-description").value = "";
  document.getElementById("quick-expense-menu").classList.add("hidden");
}

// dashboard chart
window.onload = function () {
  const ctx = document.getElementById("savingsChart").getContext("2d");
  new Chart(ctx, {
    type: "line",
    data: {
      labels: ["May", "June", "July", "August", "September"],
      datasets: [
        {
          label: "Monthly Savings (₱)",
          data: [5000, 7500, 8500, 6000, 9000],
          borderColor: "#3b82f6",
          backgroundColor: "rgba(59, 130, 246, 0.1)",
          tension: 0.4,
          fill: true,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
      },
      scales: {
        y: {
          beginAtZero: false,
          ticks: {
            callback: function (value) {
              return "₱" + value.toLocaleString();
            },
          },
        },
      },
    },
  });
};

// upcoming bill
function markBillPaid(checkbox) {
  const amount = parseFloat(checkbox.dataset.amount);
  const budgetElement = document.getElementById("remaining-budget");
  let currentBudget = parseCurrency(budgetElement.textContent);

  if (checkbox.checked) {
    currentBudget -= amount;
  } else {
    currentBudget += amount;
  }

  budgetElement.textContent = formatCurrency(currentBudget);

  if (currentBudget < 0) {
    budgetElement.style.color = "#ef4444";
  } else if (currentBudget < 1000) {
    budgetElement.style.color = "#f59e0b";
  } else {
    budgetElement.style.color = "";
  }
}

// expense form
let expenses = [];
let extraExpenses = [];
let currentEditingExpense = null;
let currentEditingExtraExpense = null;

// Expense Form Management
function showExpenseForm(editExpense = null) {
  const extraForm = document.getElementById("extra-expense-form");
  if (!extraForm.classList.contains("hidden")) {
    hideExtraExpenseForm();
  }

  const form = document.getElementById("expense-form");
  const submitBtn = form.querySelector('button[onclick="saveExpense()"]');

  if (editExpense) {
    currentEditingExpense = editExpense;
    document.getElementById("expense-description").value =
      editExpense.description;
    document.getElementById("expense-amount").value = editExpense.amount;
    document.getElementById("expense-frequency").value = editExpense.frequency;
    submitBtn.textContent = "Update Expense";
    submitBtn.onclick = updateExpense;
  } else {
    currentEditingExpense = null;
    document.getElementById("expense-description").value = "";
    document.getElementById("expense-amount").value = "";
    document.getElementById("expense-frequency").value = "";
    submitBtn.textContent = "Save Expense";
    submitBtn.onclick = saveExpense;
  }

  form.classList.remove("hidden");
}

function hideExpenseForm() {
  document.getElementById("expense-form").classList.add("hidden");
  document.getElementById("expense-description").value = "";
  document.getElementById("expense-amount").value = "";
  document.getElementById("expense-frequency").value = "";
  currentEditingExpense = null;
}

// Extra Expense Form Management
function showExtraExpenseForm(editExpense = null) {
  const expenseForm = document.getElementById("expense-form");
  if (!expenseForm.classList.contains("hidden")) {
    hideExpenseForm();
  }

  const form = document.getElementById("extra-expense-form");
  const submitBtn = form.querySelector('button[onclick="saveExtraExpense()"]');

  if (editExpense) {
    currentEditingExtraExpense = editExpense;
    document.getElementById("extra-expense-description").value =
      editExpense.description;
    document.getElementById("extra-expense-amount").value = editExpense.amount;
    document.getElementById("extra-expense-frequency").value =
      editExpense.frequency;
    submitBtn.textContent = "Update Extra Expense";
    submitBtn.onclick = updateExtraExpense;
  } else {
    currentEditingExtraExpense = null;
    document.getElementById("extra-expense-description").value = "";
    document.getElementById("extra-expense-amount").value = "";
    document.getElementById("extra-expense-frequency").value = "";
    submitBtn.textContent = "Save Extra Expense";
    submitBtn.onclick = saveExtraExpense;
  }

  form.classList.remove("hidden");
}

function hideExtraExpenseForm() {
  document.getElementById("extra-expense-form").classList.add("hidden");
  document.getElementById("extra-expense-description").value = "";
  document.getElementById("extra-expense-amount").value = "";
  document.getElementById("extra-expense-frequency").value = "";
  currentEditingExtraExpense = null;
}

// Initialize on page load
document.addEventListener("DOMContentLoaded", function () {
  displayExpenses();
  displayExtraExpenses();
});

// Expense CRUD Operations
function saveExpense() {
  const description = document.getElementById("expense-description").value;
  const amount = document.getElementById("expense-amount").value;
  const frequency = document.getElementById("expense-frequency").value;

  if (description && amount && frequency) {
    const expense = {
      id: Date.now(),
      description: description.trim(),
      amount: parseFloat(amount),
      frequency: frequency,
      dateAdded: new Date().toISOString(),
    };

    expenses.push(expense);
    displayExpenses();
    hideExpenseForm();
    return true;
  } else {
    alert("Please fill in all fields");
    return false;
  }
}

function updateExpense() {
  const description = document.getElementById("expense-description").value;
  const amount = document.getElementById("expense-amount").value;
  const frequency = document.getElementById("expense-frequency").value;

  if (description && amount && frequency && currentEditingExpense) {
    const expenseIndex = expenses.findIndex(
      (exp) => exp.id === currentEditingExpense.id
    );

    if (expenseIndex !== -1) {
      expenses[expenseIndex] = {
        ...currentEditingExpense,
        description: description.trim(),
        amount: parseFloat(amount),
        frequency: frequency,
        dateModified: new Date().toISOString(),
      };

      displayExpenses();
      hideExpenseForm();
      return true;
    }
  } else {
    alert("Please fill in all fields");
    return false;
  }
}

function editExpense(id) {
  const expense = expenses.find((exp) => exp.id === id);
  if (expense) {
    showExpenseForm(expense);
  }
}

function deleteExpense(id) {
  expenses = expenses.filter((expense) => expense.id !== id);
  displayExpenses();
}

// Extra Expense CRUD Operations
function saveExtraExpense() {
  const description = document.getElementById(
    "extra-expense-description"
  ).value;
  const amount = document.getElementById("extra-expense-amount").value;
  const frequency = document.getElementById("extra-expense-frequency").value;

  if (description && amount && frequency) {
    const extraExpense = {
      id: Date.now(),
      description: description.trim(),
      amount: parseFloat(amount),
      frequency: frequency,
      dateAdded: new Date().toISOString(),
    };

    extraExpenses.push(extraExpense);
    displayExtraExpenses();
    hideExtraExpenseForm();
    return true;
  } else {
    alert("Please fill in all fields");
    return false;
  }
}

function updateExtraExpense() {
  const description = document.getElementById(
    "extra-expense-description"
  ).value;
  const amount = document.getElementById("extra-expense-amount").value;
  const frequency = document.getElementById("extra-expense-frequency").value;

  if (description && amount && frequency && currentEditingExtraExpense) {
    const expenseIndex = extraExpenses.findIndex(
      (exp) => exp.id === currentEditingExtraExpense.id
    );

    if (expenseIndex !== -1) {
      extraExpenses[expenseIndex] = {
        ...currentEditingExtraExpense,
        description: description.trim(),
        amount: parseFloat(amount),
        frequency: frequency,
        dateModified: new Date().toISOString(),
      };

      displayExtraExpenses();
      hideExtraExpenseForm();
      return true;
    }
  } else {
    alert("Please fill in all fields");
    return false;
  }
}

function editExtraExpense(id) {
  const expense = extraExpenses.find((exp) => exp.id === id);
  if (expense) {
    showExtraExpenseForm(expense);
  }
}

function deleteExtraExpense(id) {
  extraExpenses = extraExpenses.filter((expense) => expense.id !== id);
  displayExtraExpenses();
}

function displayExpenses() {
  const container = document.getElementById("monthly-expenses");

  if (expenses.length === 0) {
    container.innerHTML = `
      <div class="flex items-center justify-between">
        <p class="font-normal text-red-500">No monthly expenses saved yet</p>
        <button onclick="showExpenseForm()" class="px-4 py-3 text-sm text-white rounded-3xl bg-primary-blue hover:bg-blue-600">Add</button>
      </div>
    `;
  } else {
    let html = "";
    expenses.forEach((expense) => {
      html += `
        <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg dark:bg-gray-700 mb-2">
          <div class="flex-1">
            <p class="font-medium text-gray-800 dark:text-gray-100">${
              expense.description
            }</p>
            <p class="text-sm text-gray-600 dark:text-gray-400">₱${expense.amount.toFixed(
              2
            )} - ${expense.frequency}</p>
          </div>
          <div class="flex gap-2 ml-4">
            <button onclick="editExpense(${
              expense.id
            })" class="px-4 py-3 text-xs text-white bg-primary-yellow rounded-full hover:bg-yellow-600">Edit</button>
            <button onclick="deleteExpense(${
              expense.id
            })" class="px-4 py-3 text-xs text-white bg-primary-red rounded-full hover:bg-red-600">Delete</button>
          </div>
        </div>
      `;
    });

    html += `
      <div class="flex justify-center mt-4">
        <button onclick="showExpenseForm()" class="px-4 py-3 text-sm text-white rounded-3xl bg-primary-blue hover:bg-blue-600">Add</button>
      </div>
    `;

    container.innerHTML = html;
  }
}

function displayExtraExpenses() {
  const container = document.getElementById("extra-expenses");

  if (extraExpenses.length === 0) {
    container.innerHTML = `
      <div class="flex items-center justify-between">
        <p class="font-normal text-red-500">No extra expenses yet</p>
        <button onclick="showExtraExpenseForm()" class="px-4 py-3 text-sm text-white rounded-3xl bg-primary-blue hover:bg-blue-600">Add</button>
      </div>
    `;
  } else {
    let html = "";
    extraExpenses.forEach((expense) => {
      html += `
        <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg dark:bg-gray-700 mb-2">
          <div class="flex-1">
            <p class="font-medium text-gray-800 dark:text-gray-100">${
              expense.description
            }</p>
            <p class="text-sm text-gray-600 dark:text-gray-400">₱${expense.amount.toFixed(
              2
            )} - ${expense.frequency}</p>
          </div>
          <div class="flex gap-2 ml-4">
            <button onclick="editExtraExpense(${
              expense.id
            })" class="px-4 py-3 text-xs text-white bg-primary-yellow rounded-full hover:bg-yellow-600">Edit</button>
            <button onclick="deleteExtraExpense(${
              expense.id
            })" class="px-4 py-3 text-xs text-white bg-primary-red rounded-full hover:bg-red-600">Delete</button>
          </div>
        </div>
      `;
    });

    html += `
      <div class="flex justify-center mt-4">
        <button onclick="showExtraExpenseForm()" class="px-4 py-3 text-sm text-white rounded-3xl bg-primary-blue hover:bg-blue-600">Add</button>
      </div>
    `;

    container.innerHTML = html;
  }
}

// bills form
let bills = [];
let editingBillId = null;

function showBillForm() {
  const form = document.getElementById("bill-form");
  form.classList.remove("hidden");

  if (!editingBillId) {
    clearBillForm();
  }
}

function hideBillForm() {
  const form = document.getElementById("bill-form");
  form.classList.add("hidden");
  editingBillId = null;
  clearBillForm();
}

function clearBillForm() {
  document.getElementById("bill-description").value = "";
  document.getElementById("bill-amount").value = "";
  document.getElementById("bill-due-date").value = "";
  document.getElementById("bill-frequency").value = "";
}

function saveBill() {
  const description = document.getElementById("bill-description").value.trim();
  const amount = parseFloat(document.getElementById("bill-amount").value);
  const dueDate = document.getElementById("bill-due-date").value;
  const frequency = document.getElementById("bill-frequency").value;

  if (!description || !amount || !dueDate || !frequency) {
    alert("Please fill in all fields");
    return;
  }

  if (amount <= 0) {
    alert("Amount must be greater than 0");
    return;
  }

  const billData = {
    description,
    amount,
    dueDate,
    frequency,
  };

  if (editingBillId) {
    const index = bills.findIndex((bill) => bill.id === editingBillId);
    if (index !== -1) {
      bills[index] = { ...billData, id: editingBillId };
    }
    editingBillId = null;
  } else {
    const newBill = {
      ...billData,
      id: Date.now(),
    };
    bills.push(newBill);
  }

  hideBillForm();
  displayBills();
}

function displayBills() {
  const container = document.getElementById("bills-list");

  if (bills.length === 0) {
    container.innerHTML = `
      <div class="flex items-center justify-between">
        <p class="font-normal text-red-500">No bills saved yet</p>
        <button onclick="showBillForm()" class="px-4 py-3 text-sm text-white rounded-3xl bg-primary-blue hover:bg-blue-600">Add</button>
      </div>
    `;
  } else {
    let html = "";
    bills.forEach((bill) => {
      const formattedDate = new Date(bill.dueDate).toLocaleDateString();
      html += `
        <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg dark:bg-gray-700 mb-2">
          <div class="flex-1">
            <p class="font-medium text-gray-800 dark:text-gray-100">${
              bill.description
            }</p>
            <p class="text-sm text-gray-600 dark:text-gray-400">₱${bill.amount.toFixed(
              2
            )} - Due: ${formattedDate}</p>
            <p class="text-xs text-gray-500 dark:text-gray-500 capitalize">${
              bill.frequency
            }</p>
          </div>
          <div class="flex gap-2 ml-4">
            <button onclick="editBill(${
              bill.id
            })" class="px-4 py-3 text-xs text-white bg-primary-yellow rounded-full hover:bg-yellow-600">Edit</button>
            <button onclick="deleteBill(${
              bill.id
            })" class="px-4 py-3 text-xs text-white bg-primary-red rounded-full hover:bg-red-600">Delete</button>
          </div>
        </div>
      `;
    });

    html += `
      <div class="flex justify-center mt-4">
        <button onclick="showBillForm()" class="px-4 py-3 text-sm text-white rounded-3xl bg-primary-blue hover:bg-blue-600">Add</button>
      </div>
    `;

    container.innerHTML = html;
  }
}

function editBill(id) {
  const bill = bills.find((bill) => bill.id === id);
  if (!bill) return;

  document.getElementById("bill-description").value = bill.description;
  document.getElementById("bill-amount").value = bill.amount;
  document.getElementById("bill-due-date").value = bill.dueDate;
  document.getElementById("bill-frequency").value = bill.frequency;

  editingBillId = id;
  showBillForm();
}

function deleteBill(id) {
  bills = bills.filter((bill) => bill.id !== id);
  displayBills();
}

document.addEventListener("DOMContentLoaded", function () {
  displayBills();
});

// calendar page
let currentDate = new Date();

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function renderCalendar() {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  document.getElementById(
    "calendar-month-year"
  ).textContent = `${monthNames[month]} ${year}`;

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const calendarGrid = document.getElementById("calendar-grid");
  calendarGrid.innerHTML = "";

  let dayCount = 1;
  let nextMonthDay = 1;

  const totalCells = 42;

  for (let i = 0; i < totalCells; i++) {
    const dayCell = document.createElement("div");
    dayCell.className = "h-24 p-3 border-b border-gray-200 hover:bg-gray-50";

    if (i % 7 !== 6) {
      dayCell.classList.add("border-r");
    }

    let dayNumber = "";
    let isCurrentMonth = false;
    let isToday = false;

    if (i < firstDay) {
      dayNumber = daysInPrevMonth - firstDay + i + 1;
      dayCell.classList.add("text-gray-400");
    } else if (dayCount <= daysInMonth) {
      dayNumber = dayCount;
      isCurrentMonth = true;
      isToday = isDateToday(year, month, dayCount);
      dayCount++;
    } else {
      dayCell.style.visibility = "hidden";
    }

    if (isToday) {
      dayCell.classList.add("bg-primary-blue", "text-white");
      dayCell.classList.remove("hover:bg-gray-50");
    } else if (isCurrentMonth) {
      dayCell.classList.add("text-gray-800");
    }

    if (dayNumber) {
      dayCell.innerHTML = `<div class="font-semibold">${dayNumber}</div>`;
    }

    calendarGrid.appendChild(dayCell);
  }
}

function isDateToday(year, month, day) {
  const today = new Date();
  return (
    year === today.getFullYear() &&
    month === today.getMonth() &&
    day === today.getDate()
  );
}

function previousMonth() {
  currentDate.setMonth(currentDate.getMonth() - 1);
  renderCalendar();
}

function nextMonth() {
  currentDate.setMonth(currentDate.getMonth() + 1);
  renderCalendar();
}

renderCalendar();
