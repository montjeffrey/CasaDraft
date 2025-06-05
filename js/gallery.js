// Gallery functionality
document.addEventListener('DOMContentLoaded', function() {
    // Tab switching
    const tabs = document.querySelectorAll('.gallery-tab');
    const contents = document.querySelectorAll('.gallery-content');
    
    // Set initial active state
    const socialTab = document.querySelector('.gallery-tab[data-tab="social"]');
    const socialContent = document.getElementById('social-gallery');
    tabs.forEach(t => t.classList.remove('active'));
    contents.forEach(c => c.classList.remove('active'));
    socialTab.classList.add('active');
    socialContent.classList.add('active');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all tabs and contents
            tabs.forEach(t => t.classList.remove('active'));
            contents.forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked tab and corresponding content
            tab.classList.add('active');
            const contentId = `${tab.dataset.tab}-gallery`;
            document.getElementById(contentId).classList.add('active');
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
        galleryGrid.innerHTML = ''; // Clear existing content
        
        data.photos.forEach(photo => {
            const item = createGalleryItem(photo);
            galleryGrid.appendChild(item);
        });
    } catch (error) {
        console.error('Error loading custom photos:', error);
        // Show error message in gallery
        const galleryGrid = document.querySelector('#custom-gallery .gallery-grid');
        galleryGrid.innerHTML = '<p class="error-message">Error loading photos. Please try again later.</p>';
    }
}

// Function to load social media content
async function loadSocialMediaContent(platform) {
    const galleryGrid = document.querySelector('#social-gallery .gallery-grid');
    galleryGrid.innerHTML = '<div class="loading">Loading content...</div>';
    
    try {
        let content;
        switch (platform) {
            case 'instagram':
                content = await loadInstagramContent();
                break;
            case 'facebook':
                content = await loadFacebookContent();
                break;
            case 'youtube':
                content = await loadYouTubeContent();
                break;
            default:
                throw new Error('Unsupported platform');
        }
        
        galleryGrid.innerHTML = ''; // Clear loading message
        
        content.forEach(item => {
            const galleryItem = createGalleryItem(item);
            galleryGrid.appendChild(galleryItem);
        });
    } catch (error) {
        console.error(`Error loading ${platform} content:`, error);
        galleryGrid.innerHTML = `<p class="error-message">Error loading ${platform} content. Please try again later.</p>`;
    }
}

// Function to create a gallery item
function createGalleryItem(item) {
    const div = document.createElement('div');
    div.className = 'gallery-item';
    
    const img = document.createElement('img');
    img.src = item.imageUrl;
    img.alt = item.title || 'Gallery image';
    
    const overlay = document.createElement('div');
    overlay.className = 'gallery-item-overlay';
    
    if (item.title) {
        const title = document.createElement('h4');
        title.textContent = item.title;
        overlay.appendChild(title);
    }
    
    if (item.description) {
        const description = document.createElement('p');
        description.textContent = item.description;
        overlay.appendChild(description);
    }
    
    div.appendChild(img);
    div.appendChild(overlay);
    
    // Add click handler for lightbox
    div.addEventListener('click', () => {
        showLightbox(item);
    });
    
    return div;
}

// Function to show lightbox
function showLightbox(item) {
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    
    const content = document.createElement('div');
    content.className = 'lightbox-content';
    
    const img = document.createElement('img');
    img.src = item.imageUrl;
    img.alt = item.title || 'Gallery image';
    
    const closeBtn = document.createElement('button');
    closeBtn.className = 'lightbox-close';
    closeBtn.innerHTML = '×';
    closeBtn.addEventListener('click', () => {
        document.body.removeChild(lightbox);
    });
    
    content.appendChild(img);
    content.appendChild(closeBtn);
    lightbox.appendChild(content);
    
    // Close on background click
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            document.body.removeChild(lightbox);
        }
    });
    
    // Close on escape key
    document.addEventListener('keydown', function closeOnEscape(e) {
        if (e.key === 'Escape') {
            document.body.removeChild(lightbox);
            document.removeEventListener('keydown', closeOnEscape);
        }
    });
    
    document.body.appendChild(lightbox);
}

// Social media content loading functions
async function loadInstagramContent() {
    // This would be replaced with actual Instagram API integration
    // For now, return mock data
    return [
        {
            imageUrl: 'https://via.placeholder.com/600x600',
            title: 'Instagram Post 1',
            description: 'Posted on Instagram'
        },
        // Add more mock items as needed
    ];
}

async function loadFacebookContent() {
    // This would be replaced with actual Facebook API integration
    return [
        {
            imageUrl: 'https://via.placeholder.com/600x600',
            title: 'Facebook Post 1',
            description: 'Posted on Facebook'
        },
        // Add more mock items as needed
    ];
}

async function loadYouTubeContent() {
    // This would be replaced with actual YouTube API integration
    return [
        {
            imageUrl: 'https://via.placeholder.com/600x600',
            title: 'YouTube Video 1',
            description: 'Posted on YouTube'
        },
        // Add more mock items as needed
    ];
} 