// Function to fetch menu items from the CMS
async function loadMenuItems() {
    try {
        const response = await fetch('/_data/menu/');
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
            const categoryContainer = document.querySelector(`.menu-category h3:contains('${category}')`).closest('.menu-category');
            const menuItemsContainer = categoryContainer.querySelector('.menu-items');
            
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
    }
}

// Initialize menu when the page loads
document.addEventListener('DOMContentLoaded', loadMenuItems);