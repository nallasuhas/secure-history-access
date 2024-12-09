async function hashPIN(pin) {
    const encoder = new TextEncoder();
    const data = encoder.encode(pin);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    return Array.from(new Uint8Array(hashBuffer))
      .map((byte) => byte.toString(16).padStart(2, "0"))
      .join("");
  }
  
  function fetchAndDisplayHistory() {
    chrome.history.search({ text: '', maxResults: 50 }, (historyItems) => {
      const historyList = document.getElementById("history-content");
      historyItems.forEach((item) => {
        const listItem = document.createElement("li");
        listItem.innerHTML = `<a href="${item.url}" target="_blank">${item.title || item.url}</a>`;
        historyList.appendChild(listItem);
      });
    });
  }
  
  document.addEventListener("DOMContentLoaded", () => {
    const modal = document.getElementById("modal");
    const historyContent = document.getElementById("history-content");
    const submitPinBtn = document.getElementById("submitPin");
    const setPinBtn = document.getElementById("setPin");
    const pinInput = document.getElementById("pin");
    const errorMsg = document.getElementById("error");
  
    async function validatePIN() {
      const enteredPin = pinInput.value;
      const enteredHash = await hashPIN(enteredPin);
  
      chrome.storage.local.get("hashedPIN", (data) => {
        if (data.hashedPIN === enteredHash) {
          // Hide modal and display history
          modal.style.display = "none";
          historyContent.style.display = "block";
          fetchAndDisplayHistory();
        } else {
          errorMsg.style.display = "block";
        }
      });
    }
  
    async function setNewPIN() {
      const newPin = prompt("Enter a new PIN:");
      if (newPin) {
        const hashedPin = await hashPIN(newPin);
        chrome.storage.local.set({ hashedPIN: hashedPin }, () => {
          alert("PIN has been set successfully!");
        });
      }
    }
  
    submitPinBtn.addEventListener("click", validatePIN);
    setPinBtn.addEventListener("click", setNewPIN);
  });
  