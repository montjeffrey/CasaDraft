// Function to fetch menu items from the CMS
async function loadMenuItems() {
    try {
        // Fetch all menu items from the _data/menu directory
        const response = await fetch('/_data/menu/');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const menuItems = await response.json();
        
        // Group menu items by category
        const menuByCategory = menuItems.reduce((acc, item) => {
            if (!acc[item.category]) {
                acc[item.category] = [];
            }
            acc[item.category].push(item);
            return acc;
        }, {});

        // Update each menu category section
        Object.entries(menuByCategory).forEach(([category, items]) => {
            const categoryContainer = document.querySelector(`.menu-category h3:contains('${category}')`)?.closest('.menu-category');
            if (!categoryContainer) {
                console.warn(`Category container not found for: ${category}`);
                return;
            }

            const menuItemsContainer = categoryContainer.querySelector('.menu-items');
            if (!menuItemsContainer) {
                console.warn(`Menu items container not found for category: ${category}`);
                return;
            }
            
            // Clear existing items
            menuItemsContainer.innerHTML = '';
            
            // Add new items
            items.forEach(item => {
                const menuItem = document.createElement('div');
                menuItem.className = 'menu-item';
                menuItem.innerHTML = `
                    <h4>${item.title}</h4>
                    <p>${item.description}</p>
                    ${item.price ? `<span class="price">${item.price}</span>` : ''}
                `;
                menuItemsContainer.appendChild(menuItem);
            });
        });
    } catch (error) {
        console.error('Error loading menu items:', error);
        // Add error message to menu container
        const menuContainer = document.querySelector('.menu-container');
        if (menuContainer) {
            const errorMessage = document.createElement('div');
            errorMessage.className = 'menu-error';
            errorMessage.innerHTML = 'Unable to load menu items. Please try again later.';
            menuContainer.appendChild(errorMessage);
        }
    }
}

// Add a helper function to check if an element contains text
Element.prototype.contains = function(text) {
    return this.textContent.trim() === text;
};

// Initialize menu when the page loads
document.addEventListener('DOMContentLoaded', loadMenuItems);