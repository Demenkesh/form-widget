(function () {
    // Add some basic styles
    const style = document.createElement("style");
    style.textContent = `
      .widget-form-container {
        font-family: sans-serif;
        padding: 1rem;
        max-width: 400px;
        border: 1px solid #ccc;
        border-radius: 8px;
        background: #f9f9f9;
      }
      .widget-form-container input {
        width: 100%;
        padding: 0.5rem;
        margin-bottom: 0.5rem;
        border: 1px solid #ccc;
        border-radius: 4px;
      }
      .widget-form-container button {
        padding: 0.5rem 1rem;
        background: #007bff;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
      }
      .widget-form-success {
        color: green;
        font-weight: bold;
      }
      .widget-form-error {
        color: red;
        font-size: 0.9rem;
      }
    `;
    document.head.appendChild(style);

    // Create form container
    const container = document.createElement("div");
    container.className = "widget-form-container";
    container.innerHTML = `
      <form id="widgetForm">
        <input type="text" id="widgetName" placeholder=" Names" required />
        <input type="email" id="widgetEmail" placeholder="Your Emails" required />
        <div class="widget-form-error" id="formError"></div>
        <button type="submit">Submit</button>
      </form>
      <div class="widget-form-success" id="formSuccess" style="display: none;"></div>
    `;

    document.body.appendChild(container);

    // Handle form logic
    const form = container.querySelector("#widgetForm");
    const errorDiv = container.querySelector("#formError");
    const successDiv = container.querySelector("#formSuccess");

    form.addEventListener("submit", function (e) {
        e.preventDefault();
        errorDiv.textContent = "";
        successDiv.style.display = "none";

        const name = form.querySelector("#widgetName").value.trim();
        const email = form.querySelector("#widgetEmail").value.trim();

        // Basic validation
        if (!name || !email) {
            errorDiv.textContent = "Please enter both name and email.";
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            errorDiv.textContent = "Invalid email address.";
            return;
        }

        // Send to server
        fetch("https://yourserver.com/api/form-submit", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ name, email }),
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.status === true) {
                    successDiv.textContent =
                        data.message || "Form submitted successfully!";
                    successDiv.style.display = "block";
                    form.reset();
                } else {
                    errorDiv.textContent = data.message || "Something went wrong.";
                }
            })
            .catch((err) => {
                errorDiv.textContent = "Error connecting to server.";
            });
    });
})();
