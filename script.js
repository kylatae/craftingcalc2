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
    const selectedItemName = document.getElementById('craftable-items').value;

    const recipeDetails = document.getElementById('recipe-details');
    recipeDetails.innerHTML = ''; // Clear previous recipe

    buildCraftingTree(selectedItemName, recipeDetails, 0); 
}

function buildCraftingTree(itemName, container, indentLevel) {
    const item = craftingItems.find(item => item.Name === itemName);

    if (!item) return; // Item not found in craftables

    const listItem = document.createElement('li');
    listItem.textContent = `${itemName} x${item.Recipe.includes(itemName) ? '?' : 1}`; // Check for circular recipes 
    listItem.style.marginLeft = `${indentLevel * 20}px`; // Indentation

    // Tooltip setup
    listItem.addEventListener('mouseover', () => showTooltip(itemName));
    listItem.addEventListener('mouseout', hideTooltip);

    container.appendChild(listItem);

    // Sub-recipe list
    const subRecipeList = document.createElement('ul');
    item.Recipe.forEach((ingredient, index) => {
        if (index % 2 === 0) { // Even indices are ingredient names
            buildCraftingTree(ingredient, subRecipeList, indentLevel + 1);
        }
    });
    container.appendChild(subRecipeList);
}

function showTooltip(ingredientName) {
  const item = itemData[ingredientName];

  // Create tooltip element (modify styling as needed)
  const tooltip = document.createElement('div');
  tooltip.classList.add('tooltip'); 
  tooltip.innerHTML = `
    <strong>Name:</strong> ${item.Name}<br>
    <strong>Type:</strong> ${item.Type}<br>
    <strong>Obtain:</strong> ${item.Obtain.join(', ')}<br>
    <strong>Description:</strong> ${item.Description}
  `;
  document.body.appendChild(tooltip);

  // Position tooltip near the mouse (implementation omitted for brevity) 
  // ...
}

function hideTooltip() {
  const tooltip = document.querySelector('.tooltip');
  if (tooltip) tooltip.remove();
}

