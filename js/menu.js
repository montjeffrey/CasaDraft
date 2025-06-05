// Function to check if text content matches
function hasTextContent(element, text) {
    return element.textContent.trim().toLowerCase() === text.toLowerCase();
}

// Function to create a detailed menu item view
function createDetailedMenuItem(item) {
    console.log('Creating detailed view for item:', item);
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
    console.log('Showing details for category:', category.querySelector('h3').textContent);
    console.log('Items to display:', items);

    // Remove any existing overlay first
    hideCategoryDetails();

    // Create a new overlay element
    const overlay = document.createElement('div');
    overlay.className = 'menu-category-details';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(1, 47, 34, 0.95);
        z-index: 1000;
        overflow-y: auto;
        padding: 2rem;
        opacity: 0;
        transition: opacity 0.3s ease;
    `;

    // Create the content container
    const detailsContent = document.createElement('div');
    detailsContent.className = 'menu-details-content';
    detailsContent.style.cssText = `
        max-width: 1200px;
        margin: 0 auto;
        padding: 2rem;
        background-color: var(--cream);
        border-radius: 15px;
        position: relative;
        transform: translateY(20px);
        transition: transform 0.3s ease;
    `;

    // Add category title
    const categoryTitle = document.createElement('h2');
    categoryTitle.textContent = category.querySelector('h3').textContent;
    categoryTitle.style.cssText = `
        color: var(--forest);
        margin-bottom: 2rem;
        font-size: 2rem;
    `;
    detailsContent.appendChild(categoryTitle);

    // Add menu items
    if (items && items.length > 0) {
        items.forEach(item => {
            detailsContent.appendChild(createDetailedMenuItem(item));
        });
    } else {
        const noItems = document.createElement('p');
        noItems.textContent = 'No items available in this category.';
        noItems.style.color = 'var(--sage)';
        detailsContent.appendChild(noItems);
    }

    // Create close button
    const closeButton = document.createElement('button');
    closeButton.className = 'close-details';
    closeButton.innerHTML = '×';
    closeButton.style.cssText = `
        position: fixed;
        top: 2rem;
        right: 2rem;
        background: var(--orange);
        color: white;
        border: none;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        font-size: 24px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s ease;
        z-index: 1001;
    `;

    // Add click handler to close button
    closeButton.addEventListener('click', (e) => {
        e.stopPropagation();
        hideCategoryDetails();
    });

    // Add click handler to overlay
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            hideCategoryDetails();
        }
    });

    // Add elements to overlay
    overlay.appendChild(detailsContent);
    overlay.appendChild(closeButton);

    // Add overlay to body
    document.body.appendChild(overlay);

    // Trigger animations
    requestAnimationFrame(() => {
        overlay.style.opacity = '1';
        detailsContent.style.transform = 'translateY(0)';
    });

    // Prevent body scrolling
    document.body.style.overflow = 'hidden';
}

// Function to hide detailed view
function hideCategoryDetails() {
    const activeDetails = document.querySelector('.menu-category-details');
    if (activeDetails) {
        // Add fade-out animation
        activeDetails.style.opacity = '0';
        const content = activeDetails.querySelector('.menu-details-content');
        if (content) {
            content.style.transform = 'translateY(20px)';
        }

        // Remove the element after animation
        setTimeout(() => {
            if (activeDetails.parentNode) {
                activeDetails.parentNode.removeChild(activeDetails);
            }
            document.body.style.overflow = '';
        }, 300);
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