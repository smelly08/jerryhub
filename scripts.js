async function getProfileData() {
    const username = document.getElementById('usernameInput').value;
    if (!username) {
        alert('Please enter a Minecraft username');
        return;
    }

    try {
        // Fetch UUID from Mojang API
        const uuidResponse = await fetch(`https://api.mojang.com/users/profiles/minecraft/${username}`);
        if (!uuidResponse.ok) {
            throw new Error('Username not found');
        }
        const uuidData = await uuidResponse.json();
        const uuid = uuidData.id;

        // Display UUID
        document.getElementById('uuid').textContent = `UUID: ${uuid}`;

        // Display Skin
        const skinUrl = `https://crafatar.com/renders/body/${uuid}?overlay`;
        document.getElementById('skin').src = skinUrl;

        // Fetch Profile Data from Soopy API
        const profileResponse = await fetch(`https://api.soopy.dev/skyblock/stats/${uuid}`);
        if (!profileResponse.ok) {
            throw new Error('Failed to fetch profile data');
        }
        const profileData = await profileResponse.json();

        // Display Profile Data
        document.getElementById('profileData').textContent = JSON.stringify(profileData, null, 2);

    } catch (error) {
        alert(error.message);
    }
}
