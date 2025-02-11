document.getElementById('fetch-btn').addEventListener('click', async () => {
    const username = document.getElementById('username').value;
    if (!username) {
        document.getElementById('uuid-data').innerHTML = "Please enter a username.";
        return;
    }

    try {
        const sbresponse = await fetch(`https://sky.shiiyu.moe/api/v2/profile/${username}`);
        
        // Check if the response is okay
        if (!sbresponse.ok) {
            document.getElementById('uuid-data').innerHTML = "Skyblock player not found.";
            return;
        }
        
        const sbstats = await sbresponse.json();
        
        if (Array.isArray(sbstats.profiles) && sbstats.profiles.length > 0) {
            document.getElementById('stats').innerHTML = `
                <select id="sel"></select>
                <div id="profileData"></div>
                <p>${JSON.stringify(sbstats)}</p>
            `;

            const dropdown = document.getElementById('sel');
            for (const profile of sbstats.profiles) {
                const option = document.createElement("option");
                option.value = profile.profile_id; // Set the value to the profile ID
                option.textContent = profile.cute_name; // Set the displayed text to the cute name
                dropdown.appendChild(option);
            }
        } else {
            document.getElementById('stats').innerHTML = `
            <p>No profiles found for the Skyblock player.
            <br>${JSON.stringify(sbstats)}</p>
            `;
        }
    } catch (error) {
        console.error(error); // Log the error for debugging
        document.getElementById('stats').innerHTML = `An error occurred loading Skyblock stats. (${error})`;
    }
});
