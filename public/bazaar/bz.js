addEventListener("load", (event) => {
    document.getElementById("main").innerHTML = `
        <h1>Bazaar</h1>
        <p id="lastUpdated"></p>
        <input type="text" id="username" placeholder="Search for an item">
        <button id="fetch-btn" onclick="fetchBazaarData()">Reload prices (automatically updates every minute)</button>
        <div id="bzdata" class="grid-container"></div>
    `;
});

// Add CSS for grid layout
const style = document.createElement('style');
style.innerHTML = `
    .grid-container {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 10px;
        margin-top: 20px;
        justify-content: center;
    }
    .grid-item {
        padding: 10px;
        text-align: center;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        transition: background-color 0.3s;
        background-color: #C6C6C6;
        color: #555555;
        box-sizing: border-box;
        box-shadow:
            /* Right & bottom */
            4px 0 #555,
            6px 0 black,
            0 4px #555,
            0 6px black,
            /* Left & top */
            -4px 0 white,
            -6px 0 black,
            0 -4px white,
            0 -6px black,
            /* Corner right bottom */
            4px 2px #555,
            2px 4px #555,
            2px 6px black,
            6px 2px black,
            4px 4px black,
            /* Corner top right */
            2px -2px #C6C6C6,
            4px -2px black,
            2px -4px black,
            /* Corner top left */
            -4px -2px white,
            -2px -4px white,
            -2px -6px black,
            -6px -2px black,
            -4px -4px black,
            /* Corner bottom left */
            -2px 2px #C6C6C6,
            -4px 2px black,
            -2px 4px black;
    }
    .green {
        color: #00AA00;
        display: inline-block;
    }
    .gold {
        color: #FFAA00;
        display: inline-block;
    }
    .blue {
        color: #0000AA;
        display: inline-block;
    }
`;
document.head.appendChild(style);

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

        const hourlyProfit = Math.min(instaBuy, instaSell) * margin;
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

    // Sort the items based on margin from highest to lowest
    itemList.sort((a, b) => b.hourlyProfit - a.hourlyProfit);

    // Create display data in grid format
    document.getElementById('lastUpdated').innerHTML = `Last updated at ${new Date(updated).toLocaleTimeString("en-US")}`;

    let displayData = '<div class="grid-container">';
    itemList.forEach(item => {
        displayData += `
            <div class="grid-item">
                <strong>${item.name}</strong><br>
                <p>Buy order price: <span class="gold">${item.sellPrice.toLocaleString()}</span></p>
                <p>Sell order price: <span class="gold">${item.buyPrice.toLocaleString()}</span></p>
                <p>Margin: <span class="gold">${item.margin.toLocaleString()}</span></p>
                <p>One-hour instabuys: <span class="blue">${item.instaBuy.toLocaleString()}</span></p>
                <p>One-hour instasells: <span class="blue">${item.instaSell.toLocaleString()}</span></p>
                <p>Coins per Hour: <span class="green">${item.hourlyProfit.toLocaleString()}</span></p>
            </div>
        `;
    });
    displayData += '</div>';

    // Update the HTML with the grid data
    document.getElementById('bzdata').innerHTML = displayData;
}

// Fetch data immediately and set interval to fetch every minute
fetchBazaarData();
setInterval(fetchBazaarData, 60000);
