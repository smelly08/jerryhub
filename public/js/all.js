addEventListener("load", (event) => {
    const homeButton = document.createElement("div");
    homeButton.innerHTML = `
        <img src="/public/img/jerryhead.jpeg" width="24px" height="24px" />
    `;
    homeButton.setAttribute("id", "homeButton")
    document.body.appendChild(homeButton);
    
    const style = document.createElement("style");
    style.innerHTML = `
        #homeButton {
            position: absolute;
            top: 0;
            left: 12px;
            z-index: 9999;
            padding: 4px;
            background: #C6C6C6;
            box-shadow:
                /* Right & bottom */
                4px 0 #555,
                6px 0 black,
                0 4px #555,
                0 6px black,
                /* Left & top */
                -4px 0 white,
                -6px 0 black,
                /* Corner right bottom */
                4px 2px #555,
                2px 4px #555,
                2px 6px black,
                6px 2px black,
                4px 4px black,
                /* Corner bottom left */
                -2px 2px #C6C6C6,
                -4px 2px black,
                -2px 4px black;
        }
    `;
    document.head.appendChild(style);
    
    homeButton.addEventListener("click", (event) => {
        location.href= 'https://jerryhub.vercel.app';
    });
});
