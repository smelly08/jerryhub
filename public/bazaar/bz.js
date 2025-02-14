addEventListener("load", (event) => {
    document.getElementById("main").innerHTML = `
        <h1>Bazaar</h1>
        <input type="text" id="username" placeholder="Search for an item">
        <button id="fetch-btn" onclick="fetchBazaarData()">Reload prices (automatically updates every minute)</button>
        <div id="bzdata"></div>
    `;
});

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

function updateBazaarData(bazaarData, updated) {
    // Create an array to hold items and their metrics
    const itemList = [];

    for (const item in bazaarData) {
        const buyPrice = bazaarData[item].quick_status.buyPrice;
        const sellPrice = bazaarData[item].quick_status.sellPrice;
        const margin = buyPrice - sellPrice;

        // Mockup of buyMovingWeek and sellMovingWeek for the demonstration
        const buyMovingWeek = bazaarData[item].quick_status.buyMovingWeek || 0; // Replace with actual buy-moving-week data
        const sellMovingWeek = bazaarData[item].quick_status.sellMovingWeek || 0; // Replace with actual sell-moving-week data

        // Calculate one-hour insta-sells and insta-buys
        const instaBuy = buyMovingWeek / 168;
        const instaSell = sellMovingWeek / 168;

        // Push item details into the array
        itemList.push({
            name: item,
            buyPrice,
            sellPrice,
            margin,
            instaBuy,
            instaSell,
        });
    }

    // Sort the items based on margin from highest to lowest
    itemList.sort((a, b) => b.margin - a.margin);

    // Create display data
    let displayData = `<h2>Bazaar Prices (Sorted by Margin) - Last updated at ${new Date(updated).toLocaleTimeString("en-US")}</h2><ul>`;
    itemList.forEach(item => {
        displayData += `<li>${item.name}: Buy price ${item.buyPrice} | Sell price ${item.sellPrice} | Margin ${item.margin} | One hour Insta Buys ${item.instaBuy} | One hour Insta Sell ${item.instaSell}</li>`;
    });
    displayData += '</ul>';

    // Update the HTML with sorted data
    document.getElementById('bzdata').innerHTML = displayData;
}

// Fetch data immediately and set interval to fetch every minute
fetchBazaarData();
setInterval(fetchBazaarData, 60000);
