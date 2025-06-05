// Instagram Gallery Implementation
const INSTAGRAM_USERNAME = 'casamexicankitchen';

async function loadInstagramPosts() {
    const grid = document.getElementById('instagram-grid');
    if (!grid) return;
    // Fix centering: make parent block and full width
    if (grid.parentElement && grid.parentElement.classList.contains('gallery-grid')) {
        grid.parentElement.style.display = 'block';
        grid.parentElement.style.width = '100%';
    } else {
        grid.style.display = 'block';
        grid.style.width = '100%';
    }
    grid.innerHTML = `
        <div style="width: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 200px;">
            <div class="loading" style="text-align: center; font-size: 1.2rem; margin-bottom: 1rem; color: #012f22;">Instagram gallery coming soon!</div>
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