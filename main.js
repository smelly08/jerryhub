addEventListener("load", (event) => {
    document.getElementById("main").innerHTML = `
        <h1>JERRY'S HUB</h1>
        <p>Welcome to <span class="purple">Jerry's Hub</span>, a Hypixel Skyblock utility website created by <span class="darkaqua">toosmelly</span>.</p>
        <button onclick="location.href='https://jerryhub.vercel.app/bazaar'" type="button">Bazaar Flipper</button>
        <button onclick="location.href='https://jerryhub.vercel.app/profile'" type="button">Profile Viewer (not finished)</button>
        <div id="body"></div>
    `;
    newInventory("body", 6, "main", "Jerry's Hub");
});
