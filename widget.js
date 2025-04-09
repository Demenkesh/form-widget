
(function () {
  // Styles
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

    .call-widget-message {
      margin-top: 1rem;
      font-weight: bold;
      text-align: center;
    }

    .call-widget-message.success {
      color: #28a745;
    }

    .call-widget-message.error {
      color: #dc3545;
    }
  `;
  document.head.appendChild(style);

  // HTML
  const container = document.createElement("div");
  container.className = "call-widget-container";
  container.innerHTML = `
    <h2>Make a Call</h2>
    <form id="callForm">
      <input type="text" id="caller" placeholder="Caller Number (e.g., 09032491755)" required />
      <input type="text" id="callee" placeholder="Callee Number (e.g., 2342015230052)" required />
      <button type="submit">Call Now</button>
    </form>
    <div class="call-widget-message" id="callMessage"></div>
  `;
  document.getElementById("callWidget").appendChild(container);

  // Script
  const form = document.getElementById("callForm");
  const msg = document.getElementById("callMessage");

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    msg.textContent = "";
    msg.className = "call-widget-message";

    const caller = document.getElementById("caller").value.trim();
    const callee = document.getElementById("callee").value.trim();

    if (!caller || !callee) {
      msg.textContent = "Both caller and callee are required.";
      msg.classList.add("error");
      return;
    }

    // Make the API request (adjust URL and token as needed)
    fetch("http://bigpvoiceopt.test/api/callvoice", {
      method: "POST",
      headers: {
        Authorization: "Bearer WBBvHNbBNrZ1wNW9JM738UmuVt0d4XPBAoBJHJeJdHRKuHuaHURk1g6SSVBbdrpidouDCO"
      },
      body: new FormData(Object.assign(
        document.createElement('form'),
        {
          elements: [
            Object.assign(document.createElement('input'), { name: 'caller', value: caller }),
            Object.assign(document.createElement('input'), { name: 'callee', value: callee })
          ]
        }
      ))
    })
      .then(res => res.json())
      .then(data => {
        if (data.status === true || data.success === true) {
          msg.textContent = data.message || "Call initiated successfully!";
          msg.classList.add("success");
          form.reset();
        } else {
          msg.textContent = data.message || "Call could not be initiated.";
          msg.classList.add("error");
        }
      })
      .catch(err => {
        console.error(err);
        msg.textContent = "An error occurred while connecting to the server.";
        msg.classList.add("error");
      });
  });
})();
