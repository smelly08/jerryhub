var playerdata = 0;
addEventListener("load", (event) => {
    document.getElementById("main").innerHTML = `
        <h1>Profile</h1>
        <input type="text" id="username" placeholder="Enter Minecraft Username">
        <button id="fetch-btn" onclick="loadStats()">Get stats</button>
        <div id="stats"></div>
    `;
});
async function loadStats() {
    document.getElementById('stats').innerHTML = "Loading...";
    
    const username = document.getElementById('username').value;
    
    // Check if the username is empty
    if (!username) {
        document.getElementById('stats').innerHTML = "Please enter a username.";
        return;
    }
    
    playerdata = fetchStats(username);
    document.getElementById('stats').innerHTML = `
        <h1>${username}</h1>
        <p>${JSON.stringify(playerdata, null, 2)}</p>
    `;
}
async function fetchStats(un) {
    console.log("fetching");

    
    try {
        // Fetch stats from the API
        const response = await fetch(`https://sky.shiiyu.moe/api/v2/profile/${un}`);
        
        // Check if the response is okay
        if (!response.ok) {
            throw new Error("User not found or an error occurred.");
        }

        const data = await response.json();
        return data;
        // Display the fetched JSON in the stats div
        //document.getElementById('stats').innerText = JSON.stringify(data, null, 2); // Pretty print JSON
    } catch (error) {
        try {
            // Fetch stats from the API
            const response2 = await fetch(`https://api.codetabs.com/v1/tmp/?quest=https://sky.shiiyu.moe/api/v2/profile/${un}`);
            
            // Check if the response is okay
            if (!response2.ok) {
                throw new Error("User not found or an error occurred.");
            }
    
            const data = await response2.json();
            return data;
            // Display the fetched JSON in the stats div
            //document.getElementById('stats').innerText = JSON.stringify(data, null, 2); // Pretty print JSON
        } catch (error) {
            document.getElementById('stats').innerHTML = ``;
            return error.message;
        }
    }
};

function updatePage(data) {
    
    document.geElementById('stats').innerHTML = data;
}
