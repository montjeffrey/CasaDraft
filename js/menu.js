// Function to check if text content matches
function hasTextContent(element, text) {
    return element.textContent.trim().toLowerCase() === text.toLowerCase();
}

// Function to create a detailed menu item view
function createDetailedMenuItem(item) {
    const detailDiv = document.createElement('div');
    detailDiv.className = 'menu-item-detail';
    
    const imageHtml = item.image ? 
        `<img src="${item.image}" alt="${item.title}">` : 
        `<div style="background: var(--sage); height: 200px; display: flex; align-items: center; justify-content: center; color: var(--cream); border-radius: 10px;">No Image Available</div>`;
    
    detailDiv.innerHTML = `
        ${imageHtml}
        <div class="menu-item-detail-content">
            <h4>${item.title}</h4>
            <p>${item.description || 'No description available.'}</p>
            <div class="price">$${item.price}</div>
        </div>
    `;
    
    return detailDiv;
}

// Function to show detailed view for a category
function showCategoryDetails(category, items) {
    // Create a new overlay element
    const overlay = document.createElement('div');
    overlay.className = 'menu-category-details';
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'rgba(1, 47, 34, 0.95)';
    overlay.style.zIndex = '1000';
    overlay.style.overflowY = 'auto';
    overlay.style.padding = '2rem';

    // Create the content container
    const detailsContent = document.createElement('div');
    detailsContent.className = 'menu-details-content';
    detailsContent.style.maxWidth = '1200px';
    detailsContent.style.margin = '0 auto';
    detailsContent.style.padding = '2rem';
    detailsContent.style.backgroundColor = 'var(--cream)';
    detailsContent.style.borderRadius = '15px';
    detailsContent.style.position = 'relative';

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

    // Create close button
    const closeButton = document.createElement('button');
    closeButton.className = 'close-details';
    closeButton.innerHTML = '×';
    closeButton.style.position = 'fixed';
    closeButton.style.top = '2rem';
    closeButton.style.right = '2rem';
    closeButton.style.background = 'var(--orange)';
    closeButton.style.color = 'white';
    closeButton.style.border = 'none';
    closeButton.style.width = '40px';
    closeButton.style.height = '40px';
    closeButton.style.borderRadius = '50%';
    closeButton.style.fontSize = '24px';
    closeButton.style.cursor = 'pointer';
    closeButton.style.display = 'flex';
    closeButton.style.alignItems = 'center';
    closeButton.style.justifyContent = 'center';
    closeButton.style.transition = 'all 0.3s ease';

    // Add click handler to close button
    closeButton.addEventListener('click', () => {
        document.body.removeChild(overlay);
        document.body.style.overflow = '';
    });

    // Add elements to overlay
    overlay.appendChild(detailsContent);
    overlay.appendChild(closeButton);

    // Add overlay to body
    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';
}

// Function to hide detailed view
function hideCategoryDetails() {
    const activeDetails = document.querySelector('.menu-category-details');
    if (activeDetails) {
        document.body.removeChild(activeDetails);
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
                    <h4>${item.title}</h4>
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