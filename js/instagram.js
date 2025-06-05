// Instagram Gallery Implementation
const INSTAGRAM_USERNAME = 'casamexicankitchen';
const INSTAGRAM_WIDGET_IFRAME = `<iframe src="https://snapwidget.com/embed/1071872" class="snapwidget-widget" allowtransparency="true" frameborder="0" scrolling="no" style="border:none; overflow:hidden; width:100%; min-height:400px;"></iframe>`;

async function loadInstagramPosts() {
    const grid = document.getElementById('instagram-grid');
    if (!grid) return;
    
    grid.innerHTML = '<div class="loading">Loading Instagram posts...</div>';

    try {
        // Insert the Instagram widget iframe
        grid.innerHTML = INSTAGRAM_WIDGET_IFRAME +
            `<div style="text-align:center; margin-top:1rem;">
                <a href="https://www.instagram.com/${INSTAGRAM_USERNAME}/" target="_blank" class="cta-button">View Our Instagram Profile</a>
            </div>`;
    } catch (error) {
        console.error('Error loading Instagram widget:', error);
        grid.innerHTML = `<div class="error-message">Unable to load Instagram feed. <a href="https://www.instagram.com/${INSTAGRAM_USERNAME}/" target="_blank" style="color: var(--orange); text-decoration: underline;">Visit our Instagram profile</a></div>`;
    }
}

// Load Instagram posts when the page is ready
if (document.readyState === 'complete') {
    loadInstagramPosts();
} else {
    window.addEventListener('load', loadInstagramPosts);
}

// Handle social media button clicks
document.querySelectorAll('.social-media-btn').forEach(button => {
    button.addEventListener('click', function() {
        document.querySelectorAll('.social-media-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        this.classList.add('active');
        
        if (this.dataset.platform === 'instagram') {
            loadInstagramPosts();
        }
    });
}); 