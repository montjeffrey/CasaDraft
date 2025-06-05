// Function to check if text content matches
function hasTextContent(element, text) {
    return element && element.textContent.trim().toLowerCase() === text.toLowerCase();
}

// Function to create a detailed menu item view
function createDetailedMenuItem(item) {
    console.log('Creating detailed menu item:', item);
    
    const itemElement = document.createElement('div');
    itemElement.className = 'menu-item-detail';
    
    // Title
    const title = document.createElement('h4');
    title.textContent = item.title;
    itemElement.appendChild(title);
    
    // Description
    if (item.description) {
        const description = document.createElement('p');
        description.textContent = item.description;
        itemElement.appendChild(description);
    }
    
    // Price
    if (item.price) {
        const price = document.createElement('div');
        price.className = 'price';
        price.textContent = item.price;
        itemElement.appendChild(price);
    }
    
    return itemElement;
}

// Function to show detailed view for a category
function showCategoryDetails(category, items) {
    console.log('Showing details for category:', category);
    console.log('Items to display:', items);

    // Create overlay
    const overlay = document.createElement('div');
    overlay.className = 'menu-category-details';
    overlay.style.opacity = '0';
    overlay.style.transition = 'opacity 0.3s ease-in-out';
    
    // Create content container
    const content = document.createElement('div');
    content.className = 'menu-details-content';
    content.style.transform = 'translateY(20px)';
    content.style.opacity = '0';
    content.style.transition = 'all 0.3s ease-in-out';
    
    // Add category title with decorative line
    const titleContainer = document.createElement('div');
    titleContainer.style.textAlign = 'center';
    titleContainer.style.marginBottom = '2rem';
    titleContainer.style.position = 'relative';
    
    const title = document.createElement('h2');
    title.textContent = category;
    title.style.color = 'var(--forest)';
    title.style.fontSize = '2.5rem';
    title.style.marginBottom = '1rem';
    
    const decorativeLine = document.createElement('div');
    decorativeLine.style.width = '80px';
    decorativeLine.style.height = '4px';
    decorativeLine.style.background = 'linear-gradient(90deg, var(--orange), var(--red))';
    decorativeLine.style.margin = '0 auto';
    decorativeLine.style.borderRadius = '2px';
    
    titleContainer.appendChild(title);
    titleContainer.appendChild(decorativeLine);
    content.appendChild(titleContainer);
    
    // Create grid container for items
    const gridContainer = document.createElement('div');
    gridContainer.style.display = 'grid';
    gridContainer.style.gridTemplateColumns = 'repeat(auto-fit, minmax(300px, 1fr))';
    gridContainer.style.gap = '2rem';
    gridContainer.style.padding = '1rem';
    
    // Add items to grid
    items.forEach(item => {
        const itemElement = createDetailedMenuItem(item);
        if (itemElement) {
            gridContainer.appendChild(itemElement);
        }
    });
    
    content.appendChild(gridContainer);
    
    // Add close button
    const closeButton = document.createElement('button');
    closeButton.className = 'close-details';
    closeButton.innerHTML = '×';
    closeButton.onclick = () => hideCategoryDetails(overlay);
    
    // Add click outside to close
    overlay.onclick = (e) => {
        if (e.target === overlay) {
            hideCategoryDetails(overlay);
        }
    };
    
    // Add escape key to close
    document.addEventListener('keydown', function escHandler(e) {
        if (e.key === 'Escape') {
            hideCategoryDetails(overlay);
            document.removeEventListener('keydown', escHandler);
        }
    });
    
    overlay.appendChild(content);
    overlay.appendChild(closeButton);
    document.body.appendChild(overlay);
    
    // Force reflow
    overlay.offsetHeight;
    
    // Show overlay with animation
    overlay.style.display = 'block';
    requestAnimationFrame(() => {
        overlay.style.opacity = '1';
        content.style.transform = 'translateY(0)';
        content.style.opacity = '1';
    });
    
    // Prevent body scrolling
    document.body.style.overflow = 'hidden';
}

function hideCategoryDetails(overlay) {
    if (!overlay) return;
    
    // Fade out animation
    overlay.style.opacity = '0';
    const content = overlay.querySelector('.menu-details-content');
    if (content) {
        content.style.transform = 'translateY(20px)';
        content.style.opacity = '0';
    }
    
    // Remove overlay after animation
    setTimeout(() => {
        if (overlay && overlay.parentNode) {
            overlay.parentNode.removeChild(overlay);
        }
        // Restore body scrolling
        document.body.style.overflow = '';
    }, 300);
}

// Function to show full menu
function showFullMenu(menuData) {
    console.log('Showing full menu');
    const overlay = document.getElementById('full-menu-overlay');
    const categoriesContainer = document.getElementById('full-menu-categories');
    
    // Clear existing content
    categoriesContainer.innerHTML = '';
    
    // Group items by category
    const itemsByCategory = {};
    menuData.forEach(item => {
        if (!itemsByCategory[item.category]) {
            itemsByCategory[item.category] = [];
        }
        itemsByCategory[item.category].push(item);
    });
    
    // Create category sections
    Object.entries(itemsByCategory).forEach(([category, items]) => {
        const categorySection = document.createElement('div');
        categorySection.className = 'full-menu-category';
        
        const categoryTitle = document.createElement('h3');
        categoryTitle.textContent = category;
        categorySection.appendChild(categoryTitle);
        
        const itemsGrid = document.createElement('div');
        itemsGrid.className = 'full-menu-items';
        
        items.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'full-menu-item';
            
            const title = document.createElement('h4');
            title.textContent = item.title;
            itemElement.appendChild(title);
            
            if (item.description) {
                const description = document.createElement('p');
                description.textContent = item.description;
                itemElement.appendChild(description);
            }
            
            if (item.price) {
                const price = document.createElement('div');
                price.className = 'price';
                price.textContent = item.price;
                itemElement.appendChild(price);
            }
            
            itemsGrid.appendChild(itemElement);
        });
        
        categorySection.appendChild(itemsGrid);
        categoriesContainer.appendChild(categorySection);
    });
    
    // Show overlay with animation
    overlay.style.display = 'block';
    overlay.style.opacity = '0';
    requestAnimationFrame(() => {
        overlay.style.opacity = '1';
    });
    
    // Prevent body scrolling
    document.body.style.overflow = 'hidden';
}

// Function to hide full menu
function hideFullMenu() {
    const overlay = document.getElementById('full-menu-overlay');
    if (!overlay) return;
    
    // Fade out animation
    overlay.style.opacity = '0';
    
    // Remove overlay after animation
    setTimeout(() => {
        overlay.style.display = 'none';
        // Restore body scrolling
        document.body.style.overflow = '';
    }, 300);
}

// Function to load menu items
async function loadMenuItems() {
    try {
        console.log('Loading menu items...');
        const response = await fetch('/_data/menu.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const menuData = await response.json();
        console.log('Menu data loaded:', menuData);

        // Group items by category
        const itemsByCategory = {};
        menuData.forEach(item => {
            if (!itemsByCategory[item.category]) {
                itemsByCategory[item.category] = [];
            }
            itemsByCategory[item.category].push(item);
        });
        console.log('Items grouped by category:', itemsByCategory);

        // Get all category containers
        const categoryContainers = document.querySelectorAll('.menu-category');
        console.log('Found category containers:', categoryContainers.length);

        categoryContainers.forEach(container => {
            const categoryTitle = container.querySelector('h3');
            if (!categoryTitle) return;

            const categoryName = categoryTitle.textContent.trim();
            console.log('Processing category:', categoryName);

            const items = itemsByCategory[categoryName] || [];
            console.log(`Found ${items.length} items for category: ${categoryName}`);

            // Add click handler to show details
            container.addEventListener('click', () => {
                console.log(`Clicked on category: ${categoryName}`);
                showCategoryDetails(categoryName, items);
            });

            // Show preview items
            const menuItemsContainer = container.querySelector('.menu-items');
            if (menuItemsContainer) {
                items.slice(0, 3).forEach(item => {
                    const previewItem = document.createElement('div');
                    previewItem.className = 'menu-item';
                    
                    const title = document.createElement('h4');
                    title.textContent = item.title;
                    previewItem.appendChild(title);
                    
                    if (item.description) {
                        const description = document.createElement('p');
                        // Truncate description if it's too long
                        const maxLength = 60;
                        const truncatedDesc = item.description.length > maxLength 
                            ? item.description.substring(0, maxLength) + '...'
                            : item.description;
                        description.textContent = truncatedDesc;
                        previewItem.appendChild(description);
                    }
                    
                    menuItemsContainer.appendChild(previewItem);
                });
            }
        });

        // Add full menu button handler
        const fullMenuButton = document.getElementById('view-full-menu');
        if (fullMenuButton) {
            fullMenuButton.addEventListener('click', (e) => {
                e.preventDefault(); // Prevent default button behavior
                console.log('Full menu button clicked');
                showFullMenu(menuData);
            });
        }

        // Add escape key handler for full menu
        document.addEventListener('keydown', function escHandler(e) {
            if (e.key === 'Escape') {
                hideFullMenu();
            }
        });

    } catch (error) {
        console.error('Error loading menu items:', error);
        const menuContainer = document.querySelector('.menu-categories');
        if (menuContainer) {
            menuContainer.innerHTML = '<p style="color: var(--cream); text-align: center;">Unable to load menu items. Please try again later.</p>';
        }
    }
}

// Load menu items when the DOM is ready
document.addEventListener('DOMContentLoaded', loadMenuItems);