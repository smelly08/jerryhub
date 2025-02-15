let lore = {};
let slotitems = {};
let guis = [];
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

const tooltip = document.getElementById('tooltip');
const tooltipContainer = document.getElementById('tooltipContainer');

// Event listener for mouse movement
document.addEventListener('mousemove', (event) => {
    // Update the tooltip's position based on the mouse cursor
    tooltip.style.left = `${event.clientX}px`;
    tooltip.style.top = `${event.clientY}px`;
});
