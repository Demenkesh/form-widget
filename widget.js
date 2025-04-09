<<<<<<< HEAD
function initWidget(apiKey) {
  (function submitWithApiKey() {
    // Inject jQuery first (needed by toastr.js)
    const jqueryScript = document.createElement("script");
    jqueryScript.src = "https://code.jquery.com/jquery-3.6.0.min.js";
    document.head.appendChild(jqueryScript);

    jqueryScript.onload = () => {
      // Inject Toastr CSS
      const toastrCSS = document.createElement("link");
      toastrCSS.rel = "stylesheet";
      toastrCSS.href =
        "https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/css/toastr.min.css";
      document.head.appendChild(toastrCSS);

      // Inject Toastr JS
      const toastrScript = document.createElement("script");
      toastrScript.src =
        "https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/js/toastr.min.js";
      document.head.appendChild(toastrScript);

      toastrScript.onload = () => {
        // Custom Toastr configuration
        toastr.options = {
          closeButton: true,
          progressBar: true,
          positionClass: "toast-top-right",
          timeOut: "3000",
          showDuration: "300",
          hideDuration: "1000",
          showEasing: "swing",
          hideEasing: "linear",
          showMethod: "fadeIn",
          hideMethod: "fadeOut",
        };

        // Styles for the widget
        const style = document.createElement("style");
        style.textContent = `
          .call-widget-container {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            max-width: 420px;
            padding: 1.5rem;
            margin: 2rem auto;
            background: linear-gradient(135deg, #ffffff, #f1f1f1);
            border-radius: 12px;
            box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
          }

          .call-widget-container h2 {
            text-align: center;
            margin-bottom: 1rem;
            color: #333;
          }

          .call-widget-container input {
            width: 100%;
            padding: 0.75rem;
            margin-bottom: 1rem;
            border: 1px solid #ccc;
            border-radius: 6px;
            font-size: 1rem;
          }

          .call-widget-container button {
            width: 100%;
            padding: 0.75rem;
            background-color: #28a745;
            color: white;
            border: none;
            font-size: 1rem;
            border-radius: 6px;
            cursor: pointer;
            transition: background-color 0.3s ease;
          }

          .call-widget-container button:hover {
            background-color: #218838;
          }
        `;
        document.head.appendChild(style);
        console.log("Widget initialized with API Key:", apiKey);
        // HTML for the widget
        const container = document.createElement("div");
        container.className = "call-widget-container";
        container.innerHTML = `
          <h2>Make a Call</h2>
          <form id="callForm">
            <input type="text" id="caller" placeholder="Caller Number (e.g., Recipient)" required  />
            <input type="text" id="callee" placeholder="Callee Number (e.g., Sender)" required />
            <button type="submit">Call Now</button>
          </form>
        `;

        const target = document.getElementById("callWidget") || document.body;
        target.appendChild(container);

        // Toastr notify function
        function notify(type, message) {
          if (typeof toastr !== "undefined") {
            toastr[type](message);
          } else {
            alert(message);
          }
=======
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
>>>>>>> 7529bc409de850db884987d8fe8a3aab03011a46
        }

        // Form Logic
        const form = container.querySelector("#callForm");

        form.addEventListener("submit", function (e) {
          e.preventDefault();

          const caller = form.querySelector("#caller").value.trim();
          const callee = form.querySelector("#callee").value.trim();

          if (!caller || !callee) {
            notify("error", "Both caller and callee are required.");
            return;
          }

          const formData = new FormData();
          formData.append("caller", caller);
          formData.append("callee", callee);

          // Use AJAX instead of fetch
          $.ajax({
            url: "http://bigpvoiceopt.test/api/callvoice",
            method: "POST",
            headers: {
              Authorization: `Bearer ${apiKey}`, // Dynamic API Key
              "Content-Type": "application/json", // Ensure JSON content-type
            },
            data: JSON.stringify({
              caller: caller,
              callee: callee,
            }),
            success: function (data) {
              const isSuccess = data.status === true || data.success === true;
              if (isSuccess) {
                notify(
                  "success",
                  data.message || "Call initiated successfully!"
                );
                form.reset();
              } else {
                const errorMsg =
                  data.message || data.error || "Call could not be initiated.";
                notify("error", errorMsg);
              }
            },
            error: function (err) {
              console.error(err.responseJSON.message);
              if (err.responseJSON.message) {
                notify("error", err.responseJSON.message);
              } else {
                notify("error", err.responseJSON.error);
              }
            },
          });
        });
      };
    };
  })();
}
