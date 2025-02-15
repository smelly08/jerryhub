addEventListener("load", (event) => {
    const homeButton = document.createElement("div");
    homeButton.innerHTML = `
        <img src="/public/img/jerryhead.jpeg" width="24px" height="24px" />
    `;
    homeButton.style.position = "absolute";
    homeButton.style.padding = "20px";
    homeButton.style.background = "#555555";
    document.body.appendChild(homeButton);
    
    homeButton.addEventListener("click", (event) => {
        location.href= 'https://jerryhub.vercel.app';
    });
});
