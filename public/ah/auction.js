addEventListener("load", (event) => {
    document.getElementById("main").innerHTML = `
        <h1>Auction House</h1>
        <p id="lastUpdated"></p>
        <input type="text" id="username" placeholder="Search for an item">
        <button id="fetch-btn" onclick="fetchBazaarData()">Refresh</button>
        <select id="sel"></select>
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

async function fetchAndSortAuctions() {
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

    // Sort auctions into categories
    const categories = {
        weapons: [],
        armor: [],
        accessories: [],
        blocks: [],
        tools: []
    };

    allAuctions.forEach(auction => {
        const category = auction.category;
        if (categories[category]) {
            categories[category].push(auction);
        } else {
            console.warn(`Unknown category: ${category}`);
        }
    });

    // Log the sorted categories
    console.log(`Fetched a total of ${allAuctions.length} auctions.`);
    console.log('Sorted categories: ', categories);

    return categories;
}

fetchAndSortAuctions()
    .then(categories => {
        const dropdown = document.getElementById('sel');

        // Clear existing options except for the default one
        dropdown.innerHTML = '<option value="accessories">Accessories</option>';
        
        dropdown.addEventListener('change', (event) => {
        const selectedCategory = event.target.value;

        // Clear previous stats
        document.getElementById('ah').innerHTML = '';

        if (selectedProfile) {
            // Display the selected profile's information
            document.getElementById('stats').innerHTML = `
                <h2>${selectedCategory}</h2>
                <p>${categories[selectedCategory]}</p>
            `;
        }
    });
    })
    .catch(err => {
        console.error(err);
    });
