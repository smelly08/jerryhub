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
    let displayData = '<h2>Bazaar Prices</h2><ul>';
    for (const item in bazaarData) {
        displayData += `<li>${item}: Buy price ${bazaarData[item].quick_status.buyPrice} | Sell price ${bazaarData[item].quick_status.sellPrice}</li>`;
    }
    displayData += '</ul>';
    /*bazaarData.forEach(item => {
        const listItem = document.createElement('li');
        listItem.textContent = `${item.name}: ${item.price}`;
        itemList.appendChild(listItem);
    });*/
    document.getElementById('bzdata').appendChild(displayData);
}

// Fetch data immediately and set interval to fetch every minute
fetchBazaarData();
setInterval(fetchBazaarData, 60000);
