function initWidget(apiKey) {
  (function submitWithApiKey() {
    const loadScript = (src) =>
      new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = src;
        script.onload = resolve;
        document.head.appendChild(script);
      });

    const loadStyle = (href) => {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = href;
      document.head.appendChild(link);
    };

    Promise.all([
      loadScript("https://code.jquery.com/jquery-3.6.0.min.js"),
      loadScript("https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"),
      loadScript(
        "https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/js/toastr.min.js"
      ),
    ]).then(() => {
      loadStyle(
        "https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/css/toastr.min.css"
      );

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
        .call-widget-container h2 { text-align: center; margin-bottom: 1rem; color: #333; }
        .call-widget-container input,
        .call-widget-container button {
          width: 100%; padding: 0.75rem; margin-bottom: 1rem;
          border-radius: 6px; font-size: 1rem;
        }
        .call-widget-container input { border: 1px solid #ccc; }
        .call-widget-container button {
          background-color: #28a745; color: white; border: none;
          cursor: pointer; transition: background-color 0.3s ease;
        }
        .call-widget-container button:disabled {
          background-color: #ccc; cursor: not-allowed;
        }
        .call-widget-container button:hover {
          background-color: #218838;
        }
        .modal {
          background: rgba(0, 0, 0, 0.6);
          position: fixed; top: 0; left: 0; width: 100%; height: 100%;
          display: none; align-items: center; justify-content: center;
          z-index: 9999;
        }
        .modal-content {
          background: white; padding: 2rem; border-radius: 10px; text-align: center;
          max-width: 400px; width: 90%;
        }
        .input-code {
          width: 60px; font-size: 1.5rem; text-align: center; padding: 0.5rem;
          border: 1px solid #ccc; margin: 0.5rem;
        }
      `;
      document.head.appendChild(style);

      // HTML for the modals work on the modal , if queue background it still active keep counting , else show the moadl for adding otp to verify it ,and once done clear all the input and hide the main form , then it will be a blank screen.
      document.body.insertAdjacentHTML(
        "beforeend",
        `
        <div id="callSuccessModal" class="modal">
          <div class="modal-content">
            <h3>Call in Progress </h3>
            <p id="countdownText">Time remaining: <span id="timer">00:30</span></p>
            <button id="tryAgainBtn" style="display: none;">Try Again</button>
          </div>
        </div>
        <div id="codeEntryModal" class="modal">
          <div class="modal-content">
            <h3>Enter Verification Code</h3>
            <input type="text" id="codeInput" class="input-code" maxlength="1" />
            <input type="text" id="codeInput2" class="input-code" maxlength="1" />
            <input type="text" id="codeInput3" class="input-code" maxlength="1" />
            <input type="text" id="codeInput4" class="input-code" maxlength="1" />
            <button id="submitCodeBtn" disabled>Submit</button>
          </div>
        </div>
      `
      );

      const modal = document.getElementById("callSuccessModal");
      const codeModal = document.getElementById("codeEntryModal");
      const timerDisplay = document.getElementById("timer");
      const tryAgainBtn = document.getElementById("tryAgainBtn");
      const codeInputs = [
        document.getElementById("codeInput"),
        document.getElementById("codeInput2"),
        document.getElementById("codeInput3"),
        document.getElementById("codeInput4"),
      ];
      const submitCodeBtn = document.getElementById("submitCodeBtn");

      function startCountdown(duration, onComplete) {
        let timer = duration;
        const interval = setInterval(() => {
          const minutes = String(Math.floor(timer / 60)).padStart(2, "0");
          const seconds = String(timer % 60).padStart(2, "0");
          timerDisplay.textContent = `${minutes}:${seconds}`;
          if (--timer < 0) {
            clearInterval(interval);
            onComplete();
          }
        }, 1000);
      }

      function notify(type, message) {
        if (typeof toastr !== "undefined") {
          toastr[type](message);
        } else {
          alert(message);
        }
      }

      const container = document.createElement("div");
      container.className = "call-widget-container";
      container.innerHTML = `
        <h2>Make a Call</h2>
        <form id="callForm">
          <input type="text" id="caller" placeholder="Caller Number (e.g., Sender)" required />
          <input type="text" id="callee" placeholder="Callee Number (e.g., Recipient)" required />
          <button type="submit">Request Otp By Call</button>
        </form>
      `;
      (document.getElementById("callWidget") || document.body).appendChild(
        container
      );

      let pollingInterval = null;

      function pollCallStatus(callee, caller) {
        pollingInterval = setInterval(() => {
          axios
            .get(
              `http://bigpvoiceopt.test/api/call-status/${callee}/${caller}`,
              {
                headers: {
                  Authorization: `Bearer ${apiKey}`,
                },
              }
            )
            .then((res) => {
              if (res.data.status === true) {
                const callStatus = res.data.call_status;
                if (callStatus === "ringing") {
                  if (modal.style.display !== "flex") {
                    modal.style.display = "flex";
                    tryAgainBtn.style.display = "none";
                    document.getElementById("countdownText").style.display =
                      "block";
                    startCountdown(30, () => {
                      document.getElementById("countdownText").style.display =
                        "none";
                      tryAgainBtn.style.display = "inline-block";
                      codeModal.style.display = "flex"; // Show the code entry modal after countdown
                    });
                  }
                } else if (callStatus === "initiated") {
                  modal.style.display = "none";  // Hide timer modal
                  notify("info", "Call has been initiated.");
                  // Handle the initiated state as necessary
                } else if (callStatus !== "initiated") {
                  clearInterval(pollingInterval);
                  document.getElementById("countdownText").textContent =
                    "Call ended.";
                  let cooldown = 30;
                  tryAgainBtn.disabled = true;
                  tryAgainBtn.style.display = "inline-block";
                  tryAgainBtn.textContent = `Try Again (${cooldown}s)`;
                  const cooldownInterval = setInterval(() => {
                    cooldown--;
                    tryAgainBtn.textContent = `Try Again (${cooldown}s)`;
                    if (cooldown <= 0) {
                      clearInterval(cooldownInterval);
                      tryAgainBtn.textContent = "Try Again";
                      tryAgainBtn.disabled = false;
                    }
                  }, 1000);
                }
              } else {
                clearInterval(pollingInterval);
                notify(
                  "error",
                  res.data.message || "Could not fetch call status."
                );
              }
            })
            .catch((err) => {
              clearInterval(pollingInterval);
              console.error("Polling error:", err);
            });
        }, 3000);
      }

      const form = container.querySelector("#callForm");

      form.addEventListener("submit", function (e) {
        e.preventDefault();
        const caller = form.querySelector("#caller").value.trim();
        const callee = form.querySelector("#callee").value.trim();
        if (!caller || !callee) {
          notify("error", "Both caller and callee are required.");
          return;
        }

        const callBtn = form.querySelector("button[type='submit']");
        callBtn.disabled = true;

        $.ajax({
          url: "http://bigpvoiceopt.test/api/callvoice",
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          data: JSON.stringify({ caller, callee }),
          success: function (data) {
            const isSuccess = data.status === true || data.success === true;
            if (isSuccess) {
              tryAgainBtn.style.display = "none";
              document.getElementById("countdownText").style.display = "block";
              pollCallStatus(callee, caller);
              notify("success", data.message || "Call initiated successfully!");
              tryAgainBtn.onclick = () => {
                clearInterval(pollingInterval);
                modal.style.display = "none";
                callBtn.disabled = false;
              };
            } else {
              notify("error", data.message || "Call could not be initiated.");
              callBtn.disabled = false;
            }
          },
          error: function (err) {
            console.error(err.responseJSON?.message || err.responseJSON?.error);
            notify("error", err.responseJSON?.message || "Server error");
            callBtn.disabled = false;
          },
        });
      });

      // Handle code input
      codeInputs.forEach((input) => {
        input.addEventListener("input", function () {
          // Check if all 4 inputs have a value
          const allFilled = codeInputs.every(
            (input) => input.value.length === 1
          );
          submitCodeBtn.disabled = !allFilled;
        });
      });

      // Handle code submission
      submitCodeBtn.addEventListener("click", function () {
        const code = codeInputs.map((input) => input.value).join("");
        const callee = document.getElementById("callee").value; // Get callee dynamically from input field
        const caller = document.getElementById("caller").value; // Get caller dynamically from input field

        // Submit the code to the server
        $.ajax({
          url: "http://bigpvoiceopt.test/api/callvoice/verify",
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          data: JSON.stringify({
            callee,
            caller,
            code,
          }),
          success: function (data) {
            if (data.status) {
              notify("success", "Verification successful!");
              codeModal.style.display = "none";
              // Handle successful code verification
            } else {
              notify("error", data.message || "Verification failed!");
            }
          },
          error: function (err) {
            console.error(err.responseJSON?.message || err.responseJSON?.error);
            notify("error", err.responseJSON?.message || "Server error");
          },
        });
      });
    });
  })();
}
// https://bigture.com.ng/assets/js/widget.js