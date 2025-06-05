// Instagram Gallery Implementation
const INSTAGRAM_USERNAME = 'casamexicankitchen';

async function loadInstagramPosts() {
    const grid = document.getElementById('instagram-grid');
    if (!grid) return;
    
    grid.innerHTML = `
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 200px;">
            <div class="loading" style="text-align: center; font-size: 1.2rem; margin-bottom: 1rem;">Instagram gallery coming soon!</div>
            <a href="https://www.instagram.com/${INSTAGRAM_USERNAME}/" target="_blank" class="cta-button">View Our Instagram Profile</a>
        </div>
    `;
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