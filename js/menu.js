// Function to check if text content matches
function hasTextContent(element, text) {
    return element.textContent.trim().toLowerCase() === text.toLowerCase();
}

// Function to create a detailed menu item view
function createDetailedMenuItem(item) {
    const detailDiv = document.createElement('div');
    detailDiv.className = 'menu-item-detail';
    detailDiv.style.cssText = `
        background: white;
        border-radius: 10px;
        padding: 1.5rem;
        margin-bottom: 1rem;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        transition: transform 0.3s ease;
    `;
    
    detailDiv.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem;">
            <h4 style="color: var(--forest); font-size: 1.2rem; margin: 0;">${item.title}</h4>
            <div style="color: var(--orange); font-weight: 600; font-size: 1.1rem;">$${item.price}</div>
        </div>
        <p style="color: var(--sage); margin: 0; font-size: 0.95rem;">${item.description || 'No description available.'}</p>
    `;
    
    return detailDiv;
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
            console.log('Processing category:', categoryTitle);
            const items = itemsByCategory[categoryTitle] || [];
            console.log('Items for category:', items);
            
            const menuItemsContainer = container.querySelector('.menu-items');
            if (!menuItemsContainer) {
                console.warn('Menu items container not found for category:', categoryTitle);
                return;
            }
            
            // Clear existing items
            menuItemsContainer.innerHTML = '';
            
            // Add up to 3 items as preview
            items.slice(0, 3).forEach(item => {
                const menuItem = document.createElement('div');
                menuItem.className = 'menu-item';
                menuItem.innerHTML = `
                    <h4>${item.title}</h4>
                    <p style="color: var(--light-green); font-size: 0.9rem;">${item.description ? item.description.substring(0, 60) + '...' : ''}</p>
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
                console.log('Category clicked:', categoryTitle);
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