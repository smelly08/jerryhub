addEventListener("load", (event) => {
    document.getElementById("main").innerHTML = `
        <h1>Auction House</h1>
        <p id="lastUpdated"></p>
        <input type="text" id="username" placeholder="Search for an item">
        <button id="fetch-btn" onclick="fetchBazaarData()">Refresh</button>
        <div id="ah" class="grid-container"></div>
    `;

    // Add search input event listener
    document.getElementById('username').addEventListener('input', filterItems);
});

// Add CSS for bz page
const style = document.createElement('style');
style.innerHTML = `
    #ah:empty {
      animation: mymove 5s infinite;
    }
    
    @keyframes mymove {
          0%   {content: "Loading";}
          25%  {content: "Loading.";}
          75%  {content: "Loading..";}
          100%  {content: "Loading...";}
    }
`;
document.head.appendChild(style);

async function fetchAuctions() {
    const baseUrl = 'https://api.hypixel.net/skyblock/auctions?page=';
    let allAuctions = [];
    let totalPages = 0;

    // Fetch the first page to get the total number of pages
    const firstPageResponse = await fetch(`${baseUrl}0`);
    if (!firstPageResponse.ok) {
        throw new Error('Failed to fetch data from the API');
    }
    const firstPageData = await firstPageResponse.json();
    
    // Check if the data received is valid and get total pages
    if (firstPageData.success && firstPageData.auctions) {
        totalPages = firstPageData.totalPages;
        allAuctions = allAuctions.concat(firstPageData.auctions);
    }

    // Loop through the remaining pages and collect auction data
    for (let page = 1; page < totalPages; page++) {
        console.log(`Fetching page ${page}...`);
        const response = await fetch(`${baseUrl}${page}`);
        if (!response.ok) {
            console.error(`Failed to fetch page ${page}`);
            continue; // skip this page if the fetch fails
        }
        const data = await response.json();
        if (data.success && data.auctions) {
            allAuctions = allAuctions.concat(data.auctions);
        }
    }

    return allAuctions;
}

fetchAuctions()
    .then(auctions => {
        document.getElementById("ah").innerText = `Fetched a total of ${auctions.length} auctions.`;
        // Do something with the auctions data
    })
    .catch(err => {
        console.error(err);
    });
