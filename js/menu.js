// Function to check if text content matches
function hasTextContent(element, text) {
    return element.textContent.trim().toLowerCase() === text.toLowerCase();
}

// Function to create a detailed menu item view
function createDetailedMenuItem(item) {
    const detailDiv = document.createElement('div');
    detailDiv.className = 'menu-item-detail';
    
    const imageHtml = item.image ? 
        `<img src="${item.image}" alt="${item.name}">` : 
        `<div style="background: var(--sage); height: 200px; display: flex; align-items: center; justify-content: center; color: var(--cream); border-radius: 10px;">No Image Available</div>`;
    
    detailDiv.innerHTML = `
        ${imageHtml}
        <div class="menu-item-detail-content">
            <h4>${item.name}</h4>
            <p>${item.description || 'No description available.'}</p>
            <div class="price">$${item.price}</div>
        </div>
    `;
    
    return detailDiv;
}

// Function to show detailed view for a category
function showCategoryDetails(category, items) {
    const detailsContainer = category.querySelector('.menu-category-details');
    const detailsContent = detailsContainer.querySelector('.menu-details-content');
    
    // Clear previous content
    detailsContent.innerHTML = '';
    
    // Add category title
    const categoryTitle = document.createElement('h2');
    categoryTitle.textContent = category.querySelector('h3').textContent;
    categoryTitle.style.color = 'var(--forest)';
    categoryTitle.style.marginBottom = '2rem';
    detailsContent.appendChild(categoryTitle);
    
    // Add menu items
    items.forEach(item => {
        detailsContent.appendChild(createDetailedMenuItem(item));
    });
    
    // Show the details container
    detailsContainer.classList.add('active');
    
    // Prevent body scrolling
    document.body.style.overflow = 'hidden';
}

// Function to hide detailed view
function hideCategoryDetails() {
    const activeDetails = document.querySelector('.menu-category-details.active');
    if (activeDetails) {
        activeDetails.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Function to load menu items
async function loadMenuItems() {
    try {
        console.log('Loading menu items...');
        const response = await fetch('/_data/menu.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const menuItems = await response.json();
        console.log('Menu items loaded:', menuItems);

        // Group items by category
        const itemsByCategory = {};
        menuItems.forEach(item => {
            if (!itemsByCategory[item.category]) {
                itemsByCategory[item.category] = [];
            }
            itemsByCategory[item.category].push(item);
        });
        console.log('Items grouped by category:', itemsByCategory);

        // Get all category containers
        const categoryContainers = document.querySelectorAll('.menu-category');
        console.log('Found category containers:', categoryContainers.length);

        // For each category container
        categoryContainers.forEach(container => {
            const categoryTitle = container.querySelector('h3').textContent;
            const items = itemsByCategory[categoryTitle] || [];
            const menuItemsContainer = container.querySelector('.menu-items');
            
            // Clear existing items
            menuItemsContainer.innerHTML = '';
            
            // Add up to 3 items as preview
            items.slice(0, 3).forEach(item => {
                const menuItem = document.createElement('div');
                menuItem.className = 'menu-item';
                menuItem.innerHTML = `
                    <h4>${item.name}</h4>
                    <p>${item.description ? item.description.substring(0, 60) + '...' : ''}</p>
                `;
                menuItemsContainer.appendChild(menuItem);
            });
            
            // Add "View More" button if there are more items
            if (items.length > 3) {
                const viewMoreBtn = document.createElement('button');
                viewMoreBtn.className = 'view-more-btn';
                viewMoreBtn.textContent = `View ${items.length - 3} more items`;
                viewMoreBtn.style.cssText = `
                    background: var(--orange);
                    color: white;
                    border: none;
                    padding: 0.5rem 1rem;
                    border-radius: 5px;
                    margin-top: 1rem;
                    cursor: pointer;
                    transition: all 0.3s ease;
                `;
                viewMoreBtn.onmouseover = () => {
                    viewMoreBtn.style.background = 'var(--red)';
                };
                viewMoreBtn.onmouseout = () => {
                    viewMoreBtn.style.background = 'var(--orange)';
                };
                menuItemsContainer.appendChild(viewMoreBtn);
            }
            
            // Add click handler to show details
            container.addEventListener('click', (e) => {
                // Don't trigger if clicking the close button
                if (e.target.classList.contains('close-details')) {
                    return;
                }
                showCategoryDetails(container, items);
            });
        });

        // Add click handlers for close buttons
        document.querySelectorAll('.close-details').forEach(button => {
            button.addEventListener('click', (e) => {
                e.stopPropagation();
                hideCategoryDetails();
            });
        });

        // Add escape key handler
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                hideCategoryDetails();
            }
        });

    } catch (error) {
        console.error('Error loading menu items:', error);
        const menuContainer = document.querySelector('.menu-categories');
        if (menuContainer) {
            menuContainer.innerHTML = `
                <div style="color: var(--cream); text-align: center; padding: 2rem;">
                    <p>Unable to load menu items. Please try again later.</p>
                </div>
            `;
        }
    }
}

// Load menu items when the page loads
document.addEventListener('DOMContentLoaded', loadMenuItems);