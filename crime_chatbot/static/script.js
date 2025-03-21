// Function to switch between pages
function navigate(page) {
    document.querySelectorAll(".page").forEach((p) => p.classList.add("hidden"));
    document.getElementById(page).classList.remove("hidden");
}



// Send message to Flask backend and get response
function sendMessage() {
    let userInput = document.getElementById("userInput").value;
    if (!userInput.trim()) return;

    // Display user message
    let chatbox = document.getElementById("chatbox");
    let userMessage = document.createElement("div");
    userMessage.classList.add("chat-message", "user");
    userMessage.innerText = userInput;
    chatbox.appendChild(userMessage);

    // Send to backend
    fetch('/chat', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userInput })
    })
    .then(response => response.json())
    .then(data => {
        let botMessage = document.createElement("div");
        botMessage.classList.add("chat-message", "bot");
        botMessage.innerText = data.reply;
        chatbox.appendChild(botMessage);

        chatbox.scrollTop = chatbox.scrollHeight;
    })
    .catch(error => console.error("Error:", error));

    document.getElementById("userInput").value = "";
}

// Function to handle Enter key for sending messages
document.getElementById("userInput").addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        event.preventDefault(); // Prevents default new line action
        sendMessage(); // Calls the existing sendMessage() function
    }
});


// Dark mode toggle
function toggleDarkMode() {
    document.body.classList.toggle("dark-mode");
}
// Function to save user settings
function saveSettings() {
    let notifications = document.getElementById("notifications").checked;
    let soundAlerts = document.getElementById("soundAlerts").checked;
    let customStatus = document.getElementById("customStatus").value;

    alert("Settings Saved!\n\n" +
          "Notifications: " + (notifications ? "ON" : "OFF") + "\n" +
          "Sound Alerts: " + (soundAlerts ? "ON" : "OFF") + "\n" +
          "Custom Status: " + (customStatus || "None"));
}

// Function to save case details
function saveCase() {
    let caseTitle = document.getElementById("caseTitle").value;
    let caseDetails = document.getElementById("caseDetails").value;
    let officerName = document.getElementById("officerName").value;
    let caseStatus = document.getElementById("caseStatus").value;

    if (caseTitle === "" || caseDetails === "" || officerName === "") {
        alert("Please fill in all fields!");
        return;
    }

}

function addCase() {
    const caseDetails = {
        case_title: document.getElementById("caseTitle").value,
        case_details: document.getElementById("caseDetails").value,
        suspect_name: document.getElementById("suspectName").value,
        father_name: document.getElementById("fatherName").value,
        friends_names: document.getElementById("friendsNames").value,
        mostly_seen_area: document.getElementById("mostlySeenArea").value,
        previous_case_history: document.getElementById("previousCaseHistory").value,
        crime_type: document.getElementById("crimeType").value,
        wanted_level: document.getElementById("wantedLevel").value,
        assigned_officer: document.getElementById("assignedOfficer").value,
        case_status: document.getElementById("caseStatus").value
    };

}

document.getElementById("suspectPhoto").addEventListener("change", function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById("photoPreview").src = e.target.result;
            document.getElementById("photoPreview").style.display = "block";
        };
        reader.readAsDataURL(file);
    }
});

//to display stored case details



// Ensure the search function runs after the page loads
document.addEventListener("DOMContentLoaded", function () {
    let searchInput = document.getElementById("caseSearchInput");
    let caseList = document.getElementById("caseList");

    if (searchInput && caseList) {
        console.log("Search bar and case list found!"); // Debugging line
        searchInput.addEventListener("keyup", searchCases);
    } else {
        console.log("Error: Search bar or case list not found!"); // Debugging line
    }
});

// Function to search and filter cases
function searchCases() {
    let input = document.getElementById("caseSearchInput").value.toLowerCase();
    let caseList = document.getElementById("caseList");
    let caseItems = document.getElementsByClassName("case-item");

    console.log("User input: ", input); // Debugging log

    if (!caseList || caseItems.length === 0) {
        console.log("Error: No cases found!"); // Debugging line
        return;
    }

    let found = false;

    for (let i = 0; i < caseItems.length; i++) {
        let caseText = caseItems[i].textContent.toLowerCase();
        if (caseText.includes(input)) {
            caseItems[i].style.display = "block"; 
            found = true;
        } else {
            caseItems[i].style.display = "none";
        }
    }

    let noResults = document.getElementById("noResultsMessage");
    if (!noResults) {
        noResults = document.createElement("p");
        noResults.id = "noResultsMessage";
        noResults.style.color = "red";
        noResults.style.marginTop = "10px";
        caseList.appendChild(noResults);
    }

    noResults.textContent = found ? "" : "No matching cases found.";
}

/* to check element present before modify*/ 
function navigate(sectionId) {
    // Hide all pages
    let pages = document.getElementsByClassName("page");
    for (let i = 0; i < pages.length; i++) {
        pages[i].classList.add("hidden");
    }

    // Get the target section
    let targetSection = document.getElementById(sectionId);
    
    // Ensure the target section exists before modifying it
    if (targetSection) {
        targetSection.classList.remove("hidden");
    } else {
        console.error("Error: Section with ID", sectionId, "not found.");
    }
}

document.addEventListener("DOMContentLoaded", function () {
    let navLinks = document.querySelectorAll(".sidebar a");

    navLinks.forEach(link => {
        link.addEventListener("click", function (event) {
            event.preventDefault();  // Stops the URL from changing
            let sectionId = this.getAttribute("data-section");
            navigate(sectionId);
        });
    });
});

// Function to switch sections
function navigate(sectionId) {
    let pages = document.getElementsByClassName("page");

    // Hide all sections
    for (let i = 0; i < pages.length; i++) {
        pages[i].classList.add("hidden");
    }

    // Show the selected section
    let targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.remove("hidden");
    } else {
        console.error("Error: Section with ID", sectionId, "not found.");
    }
}

// Voice Recognition for Chat Input
document.getElementById("voiceInputButton").addEventListener("click", function() {
    let voiceBtn = document.getElementById("voiceInputButton");
    let recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = "en-US"; // Set language
    
    voiceBtn.classList.add("recording"); // Turn mic red & animate
    recognition.start(); // Start listening

    recognition.onresult = function(event) {
        let voiceText = event.results[0][0].transcript; // Get speech text
        document.getElementById("userInput").value = voiceText; // Insert into input box
    };

    recognition.onerror = function(event) {
        console.error("Voice recognition error:", event.error);
    };

    recognition.onend = function() {
        voiceBtn.classList.remove("recording"); // Reset mic color
    };
});

/* cases categories */

let caseCategories = [
    "Robbery in Downtown",
    "Fraud Investigation",
    "Missing Person Report",
    "Cybercrime Hacking",
    "Drug Trafficking Arrest",
    "Kidnapping Case",
    "Human Trafficking Incident",
    "Domestic Violence Report",
    "Terrorist Threat Investigation",
    "Money Laundering Case",
    "Vandalism and Property Damage",
    "Illegal Smuggling Case",
    "Arson Investigation",
    "Illegal Firearms Possession",
    "Bribery and Corruption"
];

console.log("Updated Case Categories:", caseCategories);
