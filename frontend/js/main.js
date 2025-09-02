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
      labels: ["Oct", "Nov", "Dec", "Jan", "Feb"],
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
          beginAtZero: true,
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
