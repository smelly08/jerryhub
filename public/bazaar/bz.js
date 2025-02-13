addEventListener("load", (event) => {
    document.getElementById("main").innerHTML = `
        <h1>Bazaar</h1>
        <input type="text" id="username" placeholder="Enter Minecraft Username">
        <button id="fetch-btn" onclick="loadStats()">Get stats</button>
        <select id="sel"><option value="">Select a profile</option></select>
        <div id="bzdata"></div>
    `;
});

async function fetchBazaarData() {
    try {
        const response = await fetch('https://api.hypixel.net/skyblock/bazaar');
        const data = await response.json();
        
        if (data.success) {
            updateBazaarData(data.data);
        } else {
            throw new Error("Failed to retrieve data.");
        }
    } catch (error) {
        document.getElementById('bzdata').innerText = 'Error fetching data: ' + error.message;
    }
}

function updateBazaarData(bazaarData) {
    let displayData = '<h2>Bazaar Prices</h2><ul>';
    for (const item in bazaarData) {
        displayData += `<li>${item}: Buy price ${bazaarData[item].quick_status.buyPrice} | Sell price ${bazaarData[item].quick_status.sellPrice}</li>`;
    }
    displayData += '</ul>';
    document.getElementById('bzdata').innerHTML = displayData;
}

// Fetch data immediately and set interval to fetch every minute
fetchBazaarData();
setInterval(fetchBazaarData, 60000);
