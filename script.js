document.getElementById('fetch-btn').addEventListener('click', async () => {
    const username = document.getElementById('username').value;
    if (!username) {
        document.getElementById('uuid-data').innerHTML = "Please enter a username.";
        return;
    }

    try {
        const response = await fetch(`https://api.mojang.com/users/profiles/minecraft/${username}`);
        const data = await response.json();

        if (data && data.id) {
            document.getElementById('uuid-data').innerHTML = `
                <h2>${username}'s UUID</h2>
                <p>UUID: ${data.id}</p>
            `;
        } else {
            document.getElementById('uuid-data').innerHTML = "User not found.";
        }
    } catch (error) {
        document.getElementById('uuid-data').innerHTML = "An error occurred.";
    }
});
