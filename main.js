addEventListener("load", (event) => {
    document.getElementById("main").innerHTML = `
        <h1>JERRY'S HUB</h1>
        <p>Welcome to Jerry's Hub, a Hypixel Skyblock utility website created by toosmelly.</p>
        <button onclick="location.href='https://jerryhub.vercel.app/bazaar'" type="button">Bazaar Flipper</button>
        <button onclick="location.href='https://jerryhub.vercel.app/profile'" type="button">Profile Viewer (not finished)</button>
        <div id="stats"></div>
    `;
});
