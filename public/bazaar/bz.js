var hideInflated = 0;
addEventListener("load", (event) => {
    document.getElementById("main").innerHTML = `
        <h1>Bazaar</h1>
        <p id="lastUpdated"></p>
        <input type="text" id="username" placeholder="Search for an item">
        <button id="fetch-btn" onclick="fetchBazaarData()">Refresh data</button>
        <div id="bzdata" class="grid-container"></div>
    `;
    // Add search input event listener
    document.getElementById('username').addEventListener('input', filterItems);
});

// Add CSS for bz page
const style = document.createElement('style');
style.innerHTML = `
    .grid-container {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 10px;
        margin-top: 20px;
        justify-content: center;
    }
    .grid-item {
        padding: 10px;
        margin: 10px;
        text-align: center;
        place-items: center;
        transition: backgMath.round-color 0.3s;
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
    .grid-item p {
        display: inline-block;
    }
    .grin-item span {
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

let globalItemList = []; // Store the list of items globally
let uninflatedItemList = [];

function updateBazaarData(bazaarData, updated) {
    // Create an array to hold items and their metrics
    const itemList = [];
    uninflatedItemList = [];

    for (const item in bazaarData) {
        let buyPrice = 0
        let sellPrice = 0;
        if (bazaarData[item].sell_summary.length > 0 && bazaarData[item].buy_summary.length > 0) {
            buyPrice = Math.round(bazaarData[item].buy_summary[0].pricePerUnit * 10) / 10;
            sellPrice = Math.round(bazaarData[item].sell_summary[0].pricePerUnit * 10) / 10;
        }

        // console.log(bazaarData[item].sell_summary[0]);
        
        const margin = Math.round(((buyPrice * 0.9875) - sellPrice) * 10) / 10;
        const marginPercent = Math.round(1000 * (((buyPrice * 0.9875) / sellPrice) - 1)) / 10;

        // Mockup of buyMovingWeek and sellMovingWeek for the demonstration
        const buyMovingWeek = bazaarData[item].quick_status.buyMovingWeek || 0; 
        const sellMovingWeek = bazaarData[item].quick_status.sellMovingWeek || 0; 

        // Calculate one-hour insta-sells and insta-buys
        const instaBuy = Math.round(buyMovingWeek / 168);
        const instaSell = Math.round(sellMovingWeek / 168);
        const hourlyProfit = Math.round(Math.min(instaBuy, instaSell) * margin * 10) / 10;

        const flipScore = bzScore(sellPrice, buyPrice, instaBuy, instaSell);

        let inflated = `<br>`;
        if (marginPercent >= 100) {
            inflated = `<br><span class="red">[!] Likely inflated [!]</span><br>`;
        }
        let color = "red"
        if (hourlyProfit >= 0) {
            color = "green";
        }
        
        // Push item details into the array
        itemList.push({
            name: item,
            buyPrice,
            sellPrice,
            margin,
            marginPercent,
            instaBuy,
            instaSell,
            hourlyProfit,
            flipScore,
            infl: inflated,
            clr: color
        });

        if (!marginPercent >= 100) {
            uninflatedItemList.push({
                name: item,
                buyPrice,
                sellPrice,
                margin,
                marginPercent,
                instaBuy,
                instaSell,
                hourlyProfit,
                flipScore,
                infl: inflated,
                clr: color
            });
        }
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
                <div class="inventory-slot">
                    <img src="https://www.mc-heads.net/head/b6e522d918252149e6ede2edf3fe0f2c2c58fee6ac11cb88c617207218ae4595" width="32px" height="32px" />
                </div>
                <strong>${item.name}</strong><br>
                <div class="tooltipDiv">
                    <!-- <p><span class="yellow">Score: ${item.flipScore}</span><br>-->
                    <p>Buy order: <span class="gold">${item.sellPrice.toLocaleString()}</span><br>
                    Sell order: <span class="gold">${item.buyPrice.toLocaleString()}</span><br>
                    Margin: <span class="purple">${item.margin.toLocaleString()}</span> (<span class="aqua">${item.marginPercent.toLocaleString()}%</span>)<br>
                    1h instabuys: <span class="blue">${item.instaBuy.toLocaleString()}</span><br>
                    1h instasells: <span class="blue">${item.instaSell.toLocaleString()}</span>${item.infl}<br>
                    Coins per Hour: <span class="${item.clr}">${item.hourlyProfit.toLocaleString()}</span>
                </div>
            </div>
        `;
    });
    displayData += '</div>';

    // Update the HTML with the grid data
    document.getElementById('bzdata').innerHTML = displayData;
}

// Function to filter items based on the search input
function filterItems() {
    let filterItemList = globalItemList;
    if (hideInflated === 1) {
        filterItemList = uninflatedItemList;
    }
    const searchTerm = document.getElementById('username').value.toLowerCase().replace(/[\s_]/g, '');
    if (!globalItemList) {
        fetchBazaarData();
    }
    if (searchTerm) {
        const filteredItems = globalItemList.filter(item => item.name.toLowerCase().replace(/[\s_]/g, '').includes(searchTerm));
        displayItems(filteredItems); // Display filtered items
    } else {
        displayItems(globalItemList);
    }
}

function bzScore(a, b, c, d) {
    // Calculate 0.9875b - a
    const term1 = 0.9875 * b - a;

    // Calculate min(c, d)
    const minCD = Math.min(c, d);

    // Calculate b/c + a/d
    const term2 = (a + b) / (c + d);

    // Calculate the numerator
    const numerator = (term1 * minCD) * (term1 / term2) / 1000;

    // Calculate the logarithm and round up to the nearest integer
    return Math.ceil(Math.log10(numerator));
}
// Fetch data immediately and set interval to fetch every minute
fetchBazaarData();
setInterval(fetchBazaarData, 60000);
