let lore = {};
let slotitems = {};
let guis = [];

addEventListener("load", (event) => {
    const tooltipContainer = document.createElement("div");
    tooltipContainer.innerHTML = `
    <div id="body">
        <div id="tooltipContainer">
            <div id="tooltip"></div>
        </div>
    </div>
    `;
    document.body.appendChild(tooltipContainer);
    const style = document.createElement("style");
    style.innerHTML = `
        html { height: 100%; }
        #body {
            background-color: #f0f0f0;
            display: flex;
            margin: 0;
            justify-content: center;
            align-items: center;
            position: fixed;
            width: 100vw;
            height: 100vh;
        }
        @font-face {
            font-family: "main";
            src:url("./font/MinecraftRegular-Bmg3.otf");
        }
        
        .container {
            background-color: #fff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        .inventory-div {
            font-size:12px;
            color:#4C4C4C;
            font-family: "main";
            background-color:#C6C6C6;
            padding: 7px;
            padding-top: 1px;
            box-shadow:
                /* Right & bottom */
                4px 0 #555,
                6px 0 black,
                0 4px #555,
                0 6px black,
                /* Left & top */
                -4px 0 white,
                -6px 0 black,
                0 -4px white,
                0 -6px black,
                /* Corner right bottom */
                4px 2px #555,
                2px 4px #555,
                2px 6px black,
                6px 2px black,
                4px 4px black,
                /* Corner top right */
                2px -2px #C6C6C6,
                4px -2px black,
                2px -4px black,
                /* Corner top left */
                -4px -2px white,
                -2px -4px white,
                -2px -6px black,
                -6px -2px black,
                -4px -4px black,
                /* Corner bottom left */
                -2px 2px #C6C6C6,
                -4px 2px black,
                -2px 4px black;
        }
        .inventory-title {
            text-align: center;
            margin-bottom: 20px;
            border-bottom: 2px solid #ccc;
        }
        
        .inventory-table {
            width: 100%;
            border-collapse: collapse;
        }
        
        .inventory-table th, 
        .inventory-table td {
            text-align: center;
            cursor: pointer;
        }
        .inventory-slot {
            border-right: 2px solid white;
            border-bottom: 2px solid white;
            border-left: 2px inset #333333;
            border-top: 2px inset #333333;
            background-color:#888;
            width: 46px;
            height: 46px;
        }
        .inventory-slot:hover {
            background-color: #e0e0e0;
        }
        
        #tooltipContainer {
            position: fixed;
            left: 0;
            top: 0;
            z-index: 1000;
            pointer-events: none;
            width: 100vw;
            height: 100vh;
        }
        
        #tooltip {
            font-family: 'main';
            color: white;
            position: absolute;
            min-height: 1em;
            padding: 7px;
            display: none;
            background-color: rgba(22,8,23,255);
            box-shadow:
                /* Right & bottom */
                2px 0 #210454,
                4px 0 black,
                0 2px #210454,
                0 4px black,
                /* Left & top */
                -2px 0 #210454,
                -4px 0 black,
                0 -2px #210454,
                0 -4px black,
                /* Corner right bottom */
                2px 2px black,
                /* Corner top right */
                2px -2px black,
                /* Corner top left */
                -2px -2px black,
                /* Corner bottom left */
                -2px 2px black;
        }
    `;
    document.head.appendChild(style);

    
    
    const tooltip = document.getElementById('tooltip');
    const tooltipContainer = document.getElementById('tooltipContainer');
    
    // Event listener for mouse movement
    document.addEventListener('mousemove', (event) => {
        // Update the tooltip's position based on the mouse cursor
        tooltip.style.left = `${event.clientX}px`;
        tooltip.style.top = `${event.clientY}px`;
    });
});
function itemClicked(itemName) {
    alert(`You clicked on ${itemName}!`);
    // You can add any other functionality you want here, such as adding items to a selection or modifying inventory.
}
function newInventory(parent, rows, id, name) {
    // Get the parent element by id
    const parentElement = document.getElementById(parent);
    // Create the inventory
    const div = document.createElement("div");
    div.innerHTML = `<h1>${name}</h1>`;
    div.classList = "inventory-div";
    if (!guis[id]) {
        guis.push ("id");
    }
    // Create the table element
    const table = document.createElement('table');
    table.classList = "inventory-table";

    // Loop through the number of rows
    for (let i = 0; i < rows; i++) {
        // Create a new table row
        const tr = document.createElement('tr');

        // Loop to create 9 blocks (cells) in each row
        for (let j = 0; j < 9; j++) {
            // Calculate the block id
            const itemslot = i * 9 + j;
            const blockId = `${id}${itemslot}`;

            // Create a new table cell
            const td = document.createElement('td');
            td.innerHTML = `<div class="inventory-slot" id="slot${blockId}"></div>`;
            td.addEventListener("click", function () {
                inventoryClick(id, itemslot);
            });
            td.addEventListener("mouseenter", function () {
                document.getElementById(`tooltip`).innerHTML = `${lore.blockId}`;
                if (lore.blockId) {
                    document.getElementById('tooltip').style.display = 'block';
                }
                tooltip.style.left = `${event.clientX}px`;
                tooltip.style.top = `${event.clientY}px`;
            });
            td.addEventListener("mouseleave", function () {
                document.getElementById(`tooltip`).innerHTML = ``;
                document.getElementById('tooltip').style.display = 'none';
            });
            td.id = blockId; // Set the id of the block

            // Append the cell to the row
            tr.appendChild(td);
        }

        // Append the row to the table
        table.appendChild(tr);
    }
    // Add table to div
    div.appendChild(table);
    
    // Append the table to the parent element
    parentElement.appendChild(div);
}

function setItemSlot(id, slot, item, lore) {
    const blockID = `${id}${slot}`;
    document.getElementById(`slot${blockID}`).innerHTML = `${item}`;
    slotitems.blockID = item;
    lore.blockID = lore;
}

function setClickFunction(id, slot, func) {
    //alert(`id: ${id}, slot: ${slot}`)
    if (guis[id] && func) {
        document.getElementById(`slot${id}${slot}`).setAttribute("onclick", func);
    }
}
