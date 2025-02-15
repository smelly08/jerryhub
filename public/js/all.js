addEventListener("load", (event) => {
    const homeButton = document.createElement("div");
    homeButton.innerHTML = `
        <img src="/public/img/jerryhead.jpeg" width="24px" height="24px" />
    `;
    homebutton.style.position = "absolute";
    homebutton.style.padding = "20px";
    homebutton.style.background = "#555555";
    document.body.appendChild(homeButton);
    homeButton.addEventListener("click", (event) {
        location.href
    });
});
