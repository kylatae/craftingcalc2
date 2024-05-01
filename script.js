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
function displayRecipe() {
    const selectedItem = document.getElementById('craftable-items').value;
    const recipeDetails = document.getElementById('recipe-details');
    recipeDetails.innerHTML = ''; // Clear previous recipe

    const selectedRecipe = craftingItems.find(item => item.Name === selectedItem);

    // Header
    const title = document.createElement('h2');
    title.textContent = `Craft ${selectedRecipe.Name}`;
    recipeDetails.appendChild(title);

    // Recipe list
    const recipeList = document.createElement('ul');
    for (let i = 0; i < selectedRecipe.Recipe.length; i += 2) {
        const ingredientName = selectedRecipe.Recipe[i];
        const quantity = selectedRecipe.Recipe[i + 1];

        const listItem = document.createElement('li');
        listItem.textContent = `${ingredientName} x${quantity}`;
        listItem.title = createTooltipText(ingredientName); // Add tooltip on mouseover

        recipeList.appendChild(listItem);
    }
    recipeDetails.appendChild(recipeList);

    // Workbench
    const workbench = document.createElement('p');
    workbench.textContent = `Workbench: ${selectedRecipe.Workbench[0]}`;
    recipeDetails.appendChild(workbench);
}

function createTooltipText(itemName) {
    const item = itemData[itemName];
    return `Name: ${item.Name} 
Type: ${item.Type}
Obtain: ${item.Obtain.join(', ')}
Description: ${item.Description}`;
}