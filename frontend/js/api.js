// profile add income
async function addIncome() {
  const description = document
    .getElementById("income-description")
    .value.trim();
  const amount = document.getElementById("income-amount").value.trim();
  const frequency = document.getElementById("income-frequency").value;

  if (!description || !amount || !frequency) {
    alert("Please fill in all fields.");
    return;
  }

  const data = {
    description,
    amount: parseFloat(amount),
    frequency,
  };

  try {
    const response = await fetch("http://localhost:5500/api/income", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Failed to add income");
    }

    const result = await response.json();

    const incomeSources = document.getElementById("income-sources");
    if (incomeSources.textContent.includes("No income source yet")) {
      incomeSources.innerHTML = "";
    }

    const div = document.createElement("div");
    div.className =
      "flex items-center justify-between p-3 border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600";
    div.innerHTML = `
        <div>
          <p class="font-medium text-gray-800 dark:text-gray-100">${
            result.description
          }</p>
          <p class="text-sm text-gray-600 dark:text-gray-300">${
            result.frequency
          }</p>
        </div>
        <span class="font-bold text-primary-blue">₱${result.amount.toLocaleString()}</span>
      `;
    incomeSources.appendChild(div);

    document.getElementById("income-description").value = "";
    document.getElementById("income-amount").value = "";
    document.getElementById("income-frequency").value = "";
  } catch (err) {
    console.error(err);
    alert("Error: " + err.message);
  }
}
