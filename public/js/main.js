let playerdata = {};
let profilesData = {};

// Create page
addEventListener("load", (event) => {
    document.getElementById("main").innerHTML = `
        <h1>Profile</h1>
        <input type="text" id="username" placeholder="Enter Minecraft Username">
        <button id="fetch-btn" onclick="loadStats()">Get stats</button>
        <div id="stats"></div>
    `;
});

// Load Stats for player
async function loadStats() {
    document.getElementById('stats').innerHTML = "Loading...";
    
    const username = document.getElementById('username').value;
    
    // Check if the username is empty
    if (!username) {
        document.getElementById('stats').innerHTML = "Please enter a username.";
        return;
    }
    
    playerdata = await fetchStats(username);
    document.getElementById('stats').innerHTML = `
        <h1>${username}</h1>
        <select id="sel"></select>
        <p>${JSON.stringify(playerdata, null, 2)}</p>
    `;

    // Populate the dropdown with cute names
    const dropdown = document.getElementById('sel');

    // Clear existing options except for the default one
    dropdown.innerHTML = '<option value="">Select a profile</option>';

    // Iterate through each profile in playerdata
    profilesData = playerdata.profiles;
    
    for (const profileId in profilesData) {
        const profile = profilesData[profileId];
        const option = document.createElement("option");
        option.value = profile.profile_id; // Set the value to the profile ID
        option.textContent = profile.cute_name; // Set the displayed text to the cute name
        dropdown.appendChild(option);
    }

    // Add change event listener to the dropdown
    dropdown.addEventListener('change', (event) => {
        const selectedProfileId = event.target.value;
        const selectedProfile = Object.values(profilesData).find(profile => profile.profile_id === selectedProfileId);

        // Clear previous stats
        document.getElementById('stats').innerHTML = '';

        if (selectedProfile) {
            // Display the selected profile's information
            document.getElementById('stats').innerHTML = `
                <h2>${selectedProfile.cute_name}</h2>
                <p><strong>Profile ID:</strong> ${selectedProfile.profile_id}</p>
                <p><strong>Last Save:</strong> ${new Date(selectedProfile.last_save).toLocaleString()}</p>
                <p><strong>Current:</strong> ${selectedProfile.current ? 'Yes' : 'No'}</p>
                <p><strong>Data:</strong> ${JSON.stringify(selectedProfile.data, null, 2)}</p>
            `;
        }
    });
}

// Fetch player stats from SkyCrypt API
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
