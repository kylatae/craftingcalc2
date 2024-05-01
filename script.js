// Load JSON data
fetch('./craftable.json')
  .then(response => response.json())
  .then(craftableItems => populateCraftableList(craftableItems));

fetch('./items.json')
   .then(response => response.json())
   .then(allItems => storeAllItems(allItems));


// Data storage
let craftingItems = []; 
let itemData = {};
console.log(craftingItems)
// Function to populate the select dropdown
function populateCraftableList(items) {
    craftingItems = items; // Store craftable items data 

    const selectList = document.getElementById('craftable-items');
    items.forEach(item => {
        const option = document.createElement('option');
        option.value = item.Name;
        option.textContent = item.Name;
        selectList.appendChild(option);
    });

    selectList.addEventListener('change', displayRecipe); 
}

// Store all item info
function storeAllItems(items) {
    itemData = items.reduce((acc, item) => {
       acc[item.Name] = item;
       return acc;
    }, {});
}

// Display the recipe
function displayRecipe() { /* Implementation will go here */} 