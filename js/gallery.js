// Gallery functionality
document.addEventListener('DOMContentLoaded', function() {
    // Tab switching
    const tabs = document.querySelectorAll('.gallery-tab');
    const contents = document.querySelectorAll('.gallery-content');
    
    // Set initial active state
    const socialTab = document.querySelector('.gallery-tab[data-tab="social"]');
    const socialContent = document.getElementById('social-gallery');
    if (socialTab && socialContent) {
        tabs.forEach(t => t.classList.remove('active'));
        contents.forEach(c => c.classList.remove('active'));
        socialTab.classList.add('active');
        socialContent.classList.add('active');
    }
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all tabs and contents
            tabs.forEach(t => t.classList.remove('active'));
            contents.forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked tab and corresponding content
            tab.classList.add('active');
            const contentId = `${tab.dataset.tab}-gallery`;
            const content = document.getElementById(contentId);
            if (content) {
                content.classList.add('active');
            }
        });
    });
    
    // Social media platform switching
    const socialButtons = document.querySelectorAll('.social-media-btn');
    
    socialButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            socialButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            button.classList.add('active');
            
            // Load content for selected platform
            loadSocialMediaContent(button.dataset.platform);
        });
    });
    
    // Load custom photos (but don't show them yet)
    loadCustomPhotos();
    
    // Load initial social media content (Instagram by default)
    loadSocialMediaContent('instagram');
});

// Function to load custom photos
async function loadCustomPhotos() {
    try {
        const response = await fetch('/_data/gallery.json');
        const data = await response.json();
        
        const galleryGrid = document.querySelector('#custom-gallery .gallery-grid');
        if (!galleryGrid) return;
        
        galleryGrid.innerHTML = ''; // Clear existing content
        
        data.photos.forEach(photo => {
            const item = createGalleryItem(photo);
            galleryGrid.appendChild(item);
        });
    } catch (error) {
        console.error('Error loading custom photos:', error);
        // Show error message in gallery
        const galleryGrid = document.querySelector('#custom-gallery .gallery-grid');
        if (galleryGrid) {
            galleryGrid.innerHTML = '<p class="error-message">Error loading photos. Please try again later.</p>';
        }
    }
}

// Function to load social media content
async function loadSocialMediaContent(platform) {
    const galleryGrid = document.querySelector('#social-gallery .gallery-grid');
    if (!galleryGrid) return;
    
    galleryGrid.innerHTML = '<div class="loading">Loading content...</div>';
    
    try {
        switch (platform) {
            case 'instagram':
                if (typeof loadInstagramPosts === 'function') {
                    await loadInstagramPosts();
                }
                break;
            case 'facebook':
                await loadFacebookContent();
                break;
            case 'youtube':
                await loadYouTubeContent();
                break;
            default:
                throw new Error('Unsupported platform');
        }
    } catch (error) {
        console.error(`Error loading ${platform} content:`, error);
        galleryGrid.innerHTML = `<p class="error-message">Error loading ${platform} content. Please try again later.</p>`;
    }
}

// Function to create a gallery item
function createGalleryItem(item) {
    const div = document.createElement('div');
    div.className = 'gallery-item';

    if (item.embedCode) {
        div.innerHTML = item.embedCode;
    } else {
        const img = document.createElement('img');
        img.src = item.imageUrl;
        img.alt = item.title || 'Gallery image';
        div.appendChild(img);
    }

    return div;
}

// Function to load Facebook content
async function loadFacebookContent() {
    const galleryGrid = document.querySelector('#social-gallery .gallery-grid');
    if (!galleryGrid) return;
    // Fix centering: make parent block and full width
    if (galleryGrid.parentElement && galleryGrid.parentElement.classList.contains('gallery-grid')) {
        galleryGrid.parentElement.style.display = 'block';
        galleryGrid.parentElement.style.width = '100%';
    } else {
        galleryGrid.style.display = 'block';
        galleryGrid.style.width = '100%';
    }
    galleryGrid.innerHTML = `
        <div style="width: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 200px;">
            <div class="loading" style="text-align: center; font-size: 1.2rem; margin-bottom: 1rem; color: #012f22;">Facebook gallery coming soon!</div>
            <a href="https://www.facebook.com/casamexicankitchen" target="_blank" class="cta-button">View Our Facebook Page</a>
        </div>
    `;
}

// Function to load YouTube content
async function loadYouTubeContent() {
    const galleryGrid = document.querySelector('#social-gallery .gallery-grid');
    if (!galleryGrid) return;
    // Fix centering: make parent block and full width
    if (galleryGrid.parentElement && galleryGrid.parentElement.classList.contains('gallery-grid')) {
        galleryGrid.parentElement.style.display = 'block';
        galleryGrid.parentElement.style.width = '100%';
    } else {
        galleryGrid.style.display = 'block';
        galleryGrid.style.width = '100%';
    }
    galleryGrid.innerHTML = `
        <div style="width: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 200px;">
            <div class="loading" style="text-align: center; font-size: 1.2rem; margin-bottom: 1rem; color: #012f22;">YouTube gallery coming soon!</div>
            <a href="https://www.youtube.com/@casamexicankitchen" target="_blank" class="cta-button">View Our YouTube Channel</a>
        </div>
    `;
} 