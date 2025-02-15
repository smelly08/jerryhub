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
            background: #555555;
        }
    `;
    document.head.appendChild(style);
    
    homeButton.addEventListener("click", (event) => {
        location.href= 'https://jerryhub.vercel.app';
    });
});
