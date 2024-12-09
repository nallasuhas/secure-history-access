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

  async function setMasterPassword() {
    const masterPassword = prompt("Set a master password for security:");
  
    if (masterPassword) {
      const hashedPassword = await hashPIN(masterPassword);
  
      // Save the hashed master password
      chrome.storage.local.set({ masterPasswordHash: hashedPassword }, () => {
        alert("Master password has been set.");
        // You could redirect to another page or perform other actions here
      });
    }
  }

  async function authenticateMasterPassword(callback) {
    const enteredPassword = prompt("Enter your master password:");
  
    const hashedEnteredPassword = await hashPIN(enteredPassword);
  
    // Retrieve stored hashed master password
    chrome.storage.local.get("masterPasswordHash", (data) => {
      if (data.masterPasswordHash === hashedEnteredPassword) {
        callback(); // Proceed with PIN setting
      } else {
        alert("Incorrect master password.");
      }
    });
  }
  
  document.addEventListener("DOMContentLoaded", () => {
    const modal = document.getElementById("modal");
    const historyContent = document.getElementById("history-content");
    const submitPinBtn = document.getElementById("submitPin");
    const setPinBtn = document.getElementById("setPin");
    const pinInput = document.getElementById("pin");
    const errorMsg = document.getElementById("error");

    chrome.storage.local.get("masterPasswordHash", (data) => {
        if (!data.masterPasswordHash) {
          // No master password is set, so prompt the user to set it
          setMasterPassword();
        } else {
          // Master password is already set, allow normal operations
          console.log("Master password already set");
        }
      });

      
  
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
        // Authenticate before allowing PIN setup
        authenticateMasterPassword(async () => {
          const pin = prompt("Enter your new PIN:");
      
          if (pin) {
            const hashedPin = await hashPIN(pin);
      
            // Store the hashed PIN
            chrome.storage.local.set({ hashedPIN: hashedPin }, () => {
              alert("Your PIN has been set.");
            });
          }
        });
      }
  
    submitPinBtn.addEventListener("click", validatePIN);
    setPinBtn.addEventListener("click", setNewPIN);
  });
  