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

    // Build the recipe tree recursively
    const recipeTree = buildRecipeTree(selectedItemName);
    renderRecipeTree(recipeTree, recipeDetails);
}

function buildRecipeTree(itemName) {
    const recipe = craftingItems.find(item => item.Name === itemName);

    if (!recipe) return null; // Item is not craftable

    const tree = {
        name: itemName,
        workbench: recipe.Workbench[0],
        ingredients: []
    };

    for (let i = 0; i < recipe.Recipe.length; i += 2) {
        const ingredientName = recipe.Recipe[i];
        const quantity = recipe.Recipe[i + 1];

        const ingredientTree = buildRecipeTree(ingredientName); // Recursion!

        tree.ingredients.push({
            name: ingredientName,
            quantity: quantity,
            tree: ingredientTree // Store the subtree 
        });
    }

    return tree;
}

function renderRecipeTree(tree, parentElement) {
    const itemHeader = document.createElement('h2');
    itemHeader.textContent = `Craft ${tree.name}`;
    parentElement.appendChild(itemHeader);
 
    const ingredientList = document.createElement('ul');
    tree.ingredients.forEach(ingredient => {
        const listItem = document.createElement('li');
        listItem.textContent = `${ingredient.name} x${ingredient.quantity}`;
        
        listItem.addEventListener('mouseover', () => showTooltip(ingredient.name));
        listItem.addEventListener('mouseout', hideTooltip);

        ingredientList.appendChild(listItem);

        if (ingredient.tree) { // Render sub-ingredients recursively
            renderRecipeTree(ingredient.tree, listItem);
        }
    });

    if (tree.workbench !== 'Self') {
        const workbench = document.createElement('p');
        workbench.textContent = tree.workbench;
        parentElement.appendChild(workbench);
    }

    parentElement.appendChild(ingredientList);
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
  
    // Position tooltip near the mouse with adjustment for nested lists
    const event = window.event; // Get the event object
    const listItem = event.target;  // Get the <li> element that triggered the event
  
    let offsetLeft = listItem.offsetLeft + listItem.offsetWidth + 10; // Start position
    let offsetTop = listItem.offsetTop;
   
    // Walk up the parent elements to adjust for nested lists
    let currentParent = listItem.offsetParent;
    while (currentParent !== recipeDetails) {
      offsetLeft += currentParent.offsetLeft; 
      currentParent = currentParent.offsetParent;
    }
  
    tooltip.style.left = offsetLeft + 'px';
    tooltip.style.top = offsetTop + 'px'; 
}

function hideTooltip() {
  const tooltip = document.querySelector('.tooltip');
  if (tooltip) tooltip.remove();
}

