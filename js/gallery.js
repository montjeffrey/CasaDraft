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
                await loadInstagramContent();
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

// Function to load Instagram content
async function loadInstagramContent() {
    const galleryGrid = document.querySelector('#social-gallery .gallery-grid');
    if (!galleryGrid) return;

    try {
        // Show loading state
        galleryGrid.innerHTML = '<div class="loading">Loading Instagram feed...</div>';

        // Load Instagram embed script if not already loaded
        if (!window.instgrm) {
            await new Promise((resolve, reject) => {
                const script = document.createElement('script');
                script.src = '//www.instagram.com/embed.js';
                script.async = true;
                script.onload = resolve;
                script.onerror = () => reject(new Error('Failed to load Instagram embed script'));
                document.body.appendChild(script);
            });
        }

        // Create Instagram embed
        const embed = document.createElement('blockquote');
        embed.className = 'instagram-media';
        embed.setAttribute('data-instgrm-permalink', 'https://www.instagram.com/casamexicankitchen/');
        embed.setAttribute('data-instgrm-version', '14');
        embed.style.cssText = 'background:#FFF; border:0; border-radius:3px; box-shadow:0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15); margin: 1px; max-width:540px; min-width:326px; padding:0; width:99.375%; width:-webkit-calc(100% - 2px); width:calc(100% - 2px);';

        // Clear the gallery grid and add the embed
        galleryGrid.innerHTML = '';
        galleryGrid.appendChild(embed);

        // Process the Instagram embed
        if (window.instgrm) {
            window.instgrm.Embeds.process();
            
            // Wait for the embed to be processed
            await new Promise((resolve, reject) => {
                let attempts = 0;
                const maxAttempts = 20; // 2 seconds total
                const checkInterval = setInterval(() => {
                    attempts++;
                    const processedEmbed = galleryGrid.querySelector('.instagram-media');
                    if (processedEmbed && processedEmbed.innerHTML !== '') {
                        clearInterval(checkInterval);
                        resolve();
                    } else if (attempts >= maxAttempts) {
                        clearInterval(checkInterval);
                        reject(new Error('Instagram embed failed to process'));
                    }
                }, 100);
            });
        } else {
            throw new Error('Instagram embed script not loaded');
        }
    } catch (error) {
        console.error('Error loading Instagram content:', error);
        galleryGrid.innerHTML = `
            <div class="error-message" style="text-align: center; padding: 2rem;">
                <p style="color: var(--red); margin-bottom: 1rem;">Unable to load Instagram feed. Please try again later.</p>
                <a href="https://www.instagram.com/casamexicankitchen/" 
                   target="_blank" 
                   rel="noopener noreferrer" 
                   style="color: var(--orange); 
                          text-decoration: none; 
                          padding: 0.5rem 1rem;
                          border: 2px solid var(--orange);
                          border-radius: 50px;
                          transition: all 0.3s ease;
                          display: inline-block;">
                    Visit our Instagram profile
                </a>
            </div>`;
    }
}

// Function to load Facebook content
async function loadFacebookContent() {
    const galleryGrid = document.querySelector('#social-gallery .gallery-grid');
    if (!galleryGrid) return;
    
    galleryGrid.innerHTML = '<p class="error-message">Facebook integration coming soon!</p>';
}

// Function to load YouTube content
async function loadYouTubeContent() {
    const galleryGrid = document.querySelector('#social-gallery .gallery-grid');
    if (!galleryGrid) return;
    
    galleryGrid.innerHTML = '<p class="error-message">YouTube integration coming soon!</p>';
} 