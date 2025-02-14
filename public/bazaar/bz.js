addEventListener("load", (event) => {
    document.getElementById("main").innerHTML = `
        <h1>Bazaar</h1>
        <p id="lastUpdated"></p>
        <input type="text" id="username" placeholder="Search for an item">
        <button id="fetch-btn" onclick="fetchBazaarData()">Reload prices (automatically updates every minute)</button>
        <div id="bzdata" class="grid-container"></div>
    `;

    // Add search input event listener
    document.getElementById('username').addEventListener('input', filterItems);
});

// CSS added here...

async function fetchBazaarData() {
    try {
        const response = await fetch('https://api.hypixel.net/skyblock/bazaar');
        const data = await response.json();
        
        if (data.success) {
            updateBazaarData(data, data.lastUpdated);
        } else {
            throw new Error('Failed');
        }
    } catch (error) {
        try {
            const corsresponse = await fetch('https://api.codetabs.com/v1/tmp/?quest=https://api.hypixel.net/skyblock/bazaar');
            const corsdata = await corsresponse.json();

            if (corsdata.success) {
                updateBazaarData(corsdata.products, corsdata.lastUpdated);
            } else {
                throw new Error("Failed to retrieve data.");
            }
        } catch (error) {
            document.getElementById('bzdata').innerText = 'Error fetching data: ' + error.message;
        }
    }
}

let globalItemList = []; // Store the list of items globally

function updateBazaarData(bazaarData, updated) {
    // Create an array to hold items and their metrics
    const itemList = [];

    for (const item in bazaarData) {
        const buyPrice = Math.round(bazaarData[item].quick_status.buyPrice * 10) / 10;
        const sellPrice = Math.round(bazaarData[item].quick_status.sellPrice * 10) / 10;
        const margin = buyPrice - sellPrice;

        // Mockup of buyMovingWeek and sellMovingWeek for the demonstration
        const buyMovingWeek = bazaarData[item].quick_status.buyMovingWeek || 0; 
        const sellMovingWeek = bazaarData[item].quick_status.sellMovingWeek || 0; 

        // Calculate one-hour insta-sells and insta-buys
        const instaBuy = Math.round(buyMovingWeek / 168);
        const instaSell = Math.round(sellMovingWeek / 168);
        const hourlyProfit = Math.round(Math.min(instaBuy, instaSell) * margin * 10) / 10;

        // Push item details into the array
        itemList.push({
            name: item,
            buyPrice,
            sellPrice,
            margin,
            instaBuy,
            instaSell,
            hourlyProfit
        });
    }

    globalItemList = itemList; // Store the item list globally

    // Sort the items based on hourly profit from highest to lowest
    itemList.sort((a, b) => b.hourlyProfit - a.hourlyProfit);

    // Create display data in grid format
    document.getElementById('lastUpdated').innerHTML = `Last updated at ${new Date(updated).toLocaleTimeString("en-US")}`;

    displayItems(itemList); // Display items on the page
}

function displayItems(items) {
    let displayData = '<div class="grid-container">';
    items.forEach(item => {
        displayData += `
            <div class="grid-item">
                <strong>${item.name}</strong><br>
                <p>Buy order: <span class="gold">${item.sellPrice.toLocaleString()}</span></p>
                <p>Sell order: <span class="gold">${item.buyPrice.toLocaleString()}</span></p>
                <p>Margin: <span class="gold">${item.margin.toLocaleString()}</span></p>
                <p>1h instabuys: <span class="blue">${item.instaBuy.toLocaleString()}</span></p>
                <p>1h instasells: <span class="blue">${item.instaSell.toLocaleString()}</span></p>
                <p>Coins per Hour: <span class="green">${item.hourlyProfit.toLocaleString()}</span></p>
            </div>
        `;
    });
    displayData += '</div>';

    // Update the HTML with the grid data
    document.getElementById('bzdata').innerHTML = displayData;
}

// Function to filter items based on the search input
function filterItems() {
    const searchTerm = document.getElementById('username').value.toLowerCase();
    const filteredItems = globalItemList.filter(item => item.name.toLowerCase().includes(searchTerm));
    displayItems(filteredItems); // Display filtered items
}

// Fetch data immediately and set interval to fetch every minute
fetchBazaarData();
setInterval(fetchBazaarData, 60000);
