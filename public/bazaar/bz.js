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
            updateBazaarData(data);
        } else {
            throw new Error('Failed');
        }
    } catch (error) {
        try {
            const corsresponse = await fetch('https://api.codetabs.com/v1/tmp/?quest=https://api.hypixel.net/skyblock/bazaar');
            const corsdata = await corsresponse.json();

            if (corsdata.success) {
                updateBazaarData(corsdata.products);
            } else {
                throw new Error("Failed to retrieve data.");
            }
        } catch (error) {
            document.getElementById('bzdata').innerText = 'Error fetching data: ' + error.message;
        }
    }
}

function updateBazaarData(bazaarData) {
    // Create an array to hold items and their margins
    const itemList = [];

    for (const item in bazaarData) {
        const buyPrice = bazaarData[item].quick_status.buyPrice;
        const sellPrice = bazaarData[item].quick_status.sellPrice;
        const margin = buyPrice - sellPrice;

        // Push item details into the array
        itemList.push({
            name: item,
            buyPrice,
            sellPrice,
            margin,
        });
    }

    // Sort the items based on margin from highest to lowest
    itemList.sort((a, b) => b.margin - a.margin);

    // Create display data
    let displayData = '<h2>Bazaar Prices (Sorted by Margin)</h2><ul>';
    itemList.forEach(item => {
        displayData += `<li>${item.name}: Buy price ${item.buyPrice} | Sell price ${item.sellPrice} | Margin ${item.margin}</li>`;
    });
    displayData += '</ul>';

    // Update the HTML with sorted data
    document.getElementById('bzdata').innerHTML = displayData;
}


// Fetch data immediately and set interval to fetch every minute
fetchBazaarData();
setInterval(fetchBazaarData, 60000);
