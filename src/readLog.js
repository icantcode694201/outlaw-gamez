function loadLogEntries() {
    fetch("Log.txt")
        .then(response => response.text())
        .then(text => {
            const entries = text.split("---ENTRY START---").slice(1); // Split log into entries
            const dropdown = document.getElementById("entryDate");
            dropdown.innerHTML = ""; // Clear previous options
            window.entryMap = {}; // Reset global entry storage

            entries.forEach(entry => {
                const dateMatch = entry.match(/Date:\s*([\d-]+)/); // Extracts YYYY-MM-DD
                const titleMatch = entry.match(/Title:\s*(.+)/); // Extracts Title
                if (dateMatch && titleMatch) {
                    const date = dateMatch[1].trim();
                    const title = titleMatch[1].trim();
                    
                    // Remove metadata before storing
                    let content = entry
                        .replace(/ID:\s*\d+/g, "")  // Remove ID line
                        .replace(/Date:\s*[\d-]+/g, "")  // Remove Date line
                        .replace(/Title:\s*.+/g, "")  // Remove Title line
                        .replace("---ENTRY END---", "") // Remove ---ENTRY END---
                        .trim(); // Remove extra spaces

                    // Replace **imageFile.png with <img> tags
                    content = content.replace(/\*\*(\S+\.(png|jpg|jpeg|gif|webp))/g, '<img src="img/$1" alt="$1" class="log-image">');

                    // Store in entryMap
                    window.entryMap[date] = { title, content };

                    // Add to dropdown
                    const option = document.createElement("option");
                    option.value = date;
                    option.textContent = date;
                    dropdown.appendChild(option);
                }
            });

            // If no entries found, show a message
            if (Object.keys(window.entryMap).length === 0) {
                dropdown.innerHTML = "<option>No entries found</option>";
                document.getElementById("logTitle").innerText = "No Log Entries Available";
                document.getElementById("logContent").innerText = "";
            } else {
                dropdown.selectedIndex = dropdown.options.length - 1; // Select latest date
                loadLogEntry();
            }
        })
        .catch(error => {
            console.error("Error loading log:", error);
            document.getElementById("logTitle").innerText = "Error Loading Log";
            document.getElementById("logContent").innerText = "";
        });
}

function loadLogEntry() {
    const selectedDate = document.getElementById("entryDate").value;
    const entry = window.entryMap[selectedDate];

    if (entry) {
        document.getElementById("logTitle").innerText = entry.title; // Set title
        document.getElementById("logContent").innerHTML = entry.content; // Use innerHTML for images
    } else {
        document.getElementById("logTitle").innerText = "Entry Not Found";
        document.getElementById("logContent").innerText = "";
    }
}

// Load entries when the page is ready
document.addEventListener("DOMContentLoaded", loadLogEntries);
