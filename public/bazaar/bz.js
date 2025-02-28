let hideInflated = 0;
let sortMethod = "hourlyProfit";
let textures = {};
let cachedData = {};
let lastUpdated = 0;

window.addEventListener("load", initialize);

function initialize() {
    const mainContent = `
        <h1>Bazaar Flipper, v1.003</h1>
        <p id="lastUpdated"></p>
        <input type="text" id="username" placeholder="Search for an item">
        <button id="fetch-btn">Refresh data</button>
        <select id="sort">
            <option value="hourlyProfit" selected="selected">Sort by: hourly profit</option>
            <option value="sellPrice">Sort by: buy order</option>
            <option value="buyPrice">Sort by: sell order</option>
            <option value="margin">Sort by: margin</option>
            <option value="marginPercent">Sort by: margin percent</option>
            <option value="instaBuy">Sort by: 1h instabuys</option>
            <option value="instaSell">Sort by: 1h instasells</option>
            <option value="flipScore">Sort by: score</option>
        </select>
        <div id="bzdata" class="grid-container"></div>
    `;

    document.getElementById("main").innerHTML = mainContent;
    document.getElementById("fetch-btn").addEventListener("click", fetchBazaarData);
    document.getElementById('username').addEventListener('input', filterItems);
    document.getElementById('sort').addEventListener('change', changeSortMethod);
    appendStyles();
}

function appendStyles() {
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
        }
        .grid-item p, .grid-item span {
            display: inline-block;
        }
    `;
    document.head.appendChild(style);
}

async function fetchBazaarData() {
    try {
        const res = await fetch('https://api.hypixel.net/skyblock/bazaar');
        const data = await res.json();
        if (data.success) {
            cachedData = data;
            updateBazaarData(data.products, data.lastUpdated);
        } else {
            throw new Error('Failed to retrieve data.');
        }
    } catch {
        // Use the CORS proxy as fallback
        const corsRes = await fetch('https://api.codetabs.com/v1/tmp/?quest=https://api.hypixel.net/skyblock/bazaar');
        const corsData = await corsRes.json();
        if (corsData.success) {
            cachedData = corsData;
            updateBazaarData(corsData.products, corsData.lastUpdated);
        } else {
            document.getElementById('bzdata').innerText = 'Error fetching data.';
        }
    }
}

let globalItemList = [];
let uninflatedItemList = [];

function updateBazaarData(bazaarData, updated) {
    const itemList = [];
    uninflatedItemList = [];

    for (const item in bazaarData) {
        processItem(bazaarData[item], item, itemList);
    }

    globalItemList = itemList;
    lastUpdated = updated;
    
    document.getElementById('lastUpdated').innerHTML = `Last updated at ${new Date(updated).toLocaleTimeString("en-US")}`;
    displayItems(globalItemList.sort((a, b) => b[sortMethod] - a[sortMethod]));
    filterItems();
}

function processItem(itemData, itemName, itemList) {
    const buyPrice = itemData.buy_summary.length ? Math.round(itemData.buy_summary[0].pricePerUnit * 10) / 10 : 0;
    const sellPrice = itemData.sell_summary.length ? Math.round(itemData.sell_summary[0].pricePerUnit * 10) / 10 : 0;
    const margin = Math.round(((buyPrice * 0.9875) - sellPrice) * 10) / 10;
    const marginPercent = Math.round(1000 * (((buyPrice * 0.9875) / sellPrice) - 1)) / 10;

    const buyMovingWeek = itemData.quick_status.buyMovingWeek || 0;
    const sellMovingWeek = itemData.quick_status.sellMovingWeek || 0;
    const instaBuy = Math.round(buyMovingWeek / 168);
    const instaSell = Math.round(sellMovingWeek / 168);
    const hourlyProfit = Math.round(Math.min(instaBuy, instaSell) * margin * 10) / 10;
    const flipScore = bzScore(sellPrice, buyPrice, instaBuy, instaSell);
    
    const inflated = marginPercent >= 100 ? `<br><span class="red">[!] Likely inflated [!]</span><br>` : `<br>`;
    const color = hourlyProfit >= 0 ? "green" : "red";

    const itemDetails = {
        name: itemName,
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
    };

    itemList.push(itemDetails);

    if (marginPercent < 100) {
        uninflatedItemList.push(itemDetails);
    }
}

function displayItems(items) {
    const displayData = items.map(item => `
        <div class="grid-item">
            <div class="inventory-slot">
                <img src="${textures[item.name]?.texture || "https://www.mc-heads.net/head/b6e522d918252149e6ede2edf3fe0f2c2c58fee6ac11cb88c617207218ae4595"}" width="32px" height="32px" />
            </div>
            <strong>${item.name}</strong><br>
            <div class="tooltipDiv">
                <p>Buy order: <span class="gold">${item.sellPrice.toLocaleString()}</span><br>
                Sell order: <span class="gold">${item.buyPrice.toLocaleString()}</span><br>
                Margin: <span class="purple">${item.margin.toLocaleString()}</span> (<span class="aqua">${item.marginPercent.toLocaleString()}%</span>)<br>
                1h instabuys: <span class="blue">${item.instaBuy.toLocaleString()}</span><br>
                1h instasells: <span class="blue">${item.instaSell.toLocaleString()}</span>${item.infl}<br>
                Coins per Hour: <span class="${item.clr}">${item.hourlyProfit.toLocaleString()}</span><br>
                <span class="yellow">Score: ${item.flipScore}</p>
            </div>
        </div>
    `).join('');
    //<p><span class="yellow">${item.flipScore}</p>
    document.getElementById('bzdata').innerHTML = `<div class="grid-container">${displayData}</div>`;
}

function filterItems() {
    const searchTerm = document.getElementById('username').value.toLowerCase().replace(/[\s_]/g, '');
    const filterList = hideInflated === 1 ? uninflatedItemList : globalItemList;
    
    const filteredItems = filterList.filter(item => item.name.toLowerCase().replace(/[\s_]/g, '').includes(searchTerm));
    displayItems(filteredItems.length ? filteredItems : globalItemList);
}

function bzScore(a, b, c, d) {
    const term1 = 0.9875 * b - a;
    const minCD = Math.min(c, d);
    const term2 = Math.floor((Math.log10((term1 * minCD) + 1) * Math.log10(minCD + 1))  / 2) / 2;
    if (term2 <= 0) {
        return 0;
    } else {
        return term2;
    }
}

async function fetchTexturesData() {
    try {
        const response = await fetch('https://raw.githubusercontent.com/smelly08/jerryhub/refs/heads/main/public/js/textures.json');
        textures = await response.json();
        console.log('Fetched Textures Data:', textures);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

function changeSortMethod() {
    alert(JSON.stringify(cachedData));
    sortMethod = document.getElementById('sort').value;
    if (!['hourlyProfit', 'buyPrice', 'sellPrice', 'margin', 'marginPercent', 'instaBuy', 'instaSell', 'flipScore'].indexOf(sortMethod) >= 0) {
        sortMethod = hourlyProfit;
        alert(`error, ${sortMethod} is not a valid sort method.`);
    }
    updateBazaarData(cachedData.products, cachedData.lastUpdated);
}

fetchTexturesData();
fetchBazaarData();
setInterval(fetchBazaarData, 60000);
