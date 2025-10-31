// Add scroll effect to header
window.addEventListener('scroll', function() {
    const header = document.querySelector('header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(0, 0, 0, 0.95)';
        header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.3)';
    } else {
        header.style.background = 'linear-gradient(rgba(131, 14, 14, 0.8), rgba(0,0,0,0.8))';
        header.style.boxShadow = 'none';
    }
});

// Mobile menu functionality for small screens
function initMobileMenu() {
    const nav = document.querySelector('nav');
    const navList = document.querySelector('nav ul');
    
    if (window.innerWidth <= 768) {
        // Add mobile menu toggle if needed
        if (!document.querySelector('.menu-toggle')) {
            const menuToggle = document.createElement('button');
            menuToggle.className = 'menu-toggle';
            menuToggle.innerHTML = '☰';
            menuToggle.style.cssText = `
                background: none;
                border: none;
                color: white;
                font-size: 1.5rem;
                cursor: pointer;
                display: none;
            `;
            
            document.querySelector('.nav-container').appendChild(menuToggle);
            
            menuToggle.addEventListener('click', function() {
                navList.style.display = navList.style.display === 'flex' ? 'none' : 'flex';
            });
        }
    }
}

// Initialize on load and resize
document.addEventListener('DOMContentLoaded', function() {
    initMobileMenu();
    
    // Initialize Journey page if we're on that page
    if (document.querySelector('.journey-hero')) {
        initializeJourneyPage();
    }
    
    // Initialize Community page if we're on that page
    if (document.querySelector('.community-hero')) {
        initializeCommunityPage();
    }
    
    // Initialize Ecosystem page if we're on that page
    if (document.querySelector('.ecosystem-hero')) {
        initializeEcosystemPage();
    }
});

window.addEventListener('resize', function() {
    initMobileMenu();
});

// Prevent horizontal scroll on mobile
document.addEventListener('touchmove', function(e) {
    if (e.touches.length > 1) {
        e.preventDefault();
    }
}, { passive: false });

// Improve touch experience
document.addEventListener('touchstart', function() {}, { passive: true });

// JavaScript specific to the Journey page
function initializeJourneyPage() {
    // Add scroll animations for timeline items
    animateTimelineOnScroll();
    
    // Add hover effects for ecosystem cards
    enhanceEcosystemCards();
}

function animateTimelineOnScroll() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    // Create intersection observer for timeline animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });
    
    // Set initial state and observe each timeline item
    timelineItems.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(item);
    });
}

function enhanceEcosystemCards() {
    const ecosystemCards = document.querySelectorAll('.ecosystem-card');
    
    ecosystemCards.forEach(card => {
        // Add click event to expand card on mobile
        card.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                this.classList.toggle('expanded');
            }
        });
        
        // Add keyboard navigation support
        card.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                if (window.innerWidth <= 768) {
                    this.classList.toggle('expanded');
                }
            }
        });
        
        // Make cards focusable for accessibility
        card.setAttribute('tabindex', '0');
    });
}

// JavaScript specific to the Community page
let comments = [];

function initializeCommunityPage() {
    // DOM Elements for community page
    const submitCommentBtn = document.getElementById('submitCommentBtn');
    const nameInput = document.getElementById('name');
    const commentInput = document.getElementById('comment');
    
    // Add event listeners
    if (submitCommentBtn) {
        submitCommentBtn.addEventListener('click', submitComment);
    }
    
    // Allow submitting comment with Enter key in textarea
    if (commentInput) {
        commentInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                submitComment();
            }
        });
    }
    
    // Load comments from localStorage or use sample data
    loadComments();
    
    // Display initial comments
    displayComments();
    
    // Improve mobile form experience
    improveMobileForms();
}

function improveMobileForms() {
    const nameInput = document.getElementById('name');
    const commentInput = document.getElementById('comment');
    
    // Add proper input attributes for mobile
    if (nameInput) {
        nameInput.setAttribute('autocomplete', 'name');
    }
    if (commentInput) {
        commentInput.setAttribute('autocomplete', 'off');
    }
}

// Function to submit comment
function submitComment() {
    const nameInput = document.getElementById('name');
    const commentInput = document.getElementById('comment');
    const name = nameInput ? nameInput.value.trim() : '';
    const comment = commentInput ? commentInput.value.trim() : '';

    if (name && comment) {
        const newComment = {
            id: Date.now(),
            name: name,
            comment: comment,
            date: new Date().toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            })
        };

        comments.unshift(newComment);
        displayComments();
        saveComments();
        
        // Clear form
        if (nameInput) nameInput.value = '';
        if (commentInput) commentInput.value = '';
        
        showNotification('Thank you for sharing your thoughts!');
        
        // Close virtual keyboard on mobile after submission
        if (commentInput) commentInput.blur();
    } else {
        showNotification('Please fill in both fields.', 'error');
    }
}

// Function to display comments
function displayComments() {
    const commentsContainer = document.getElementById('commentsContainer');
    if (!commentsContainer) return;

    commentsContainer.innerHTML = '';

    if (comments.length === 0) {
        commentsContainer.innerHTML = `
            <div class="no-comments">
                <h3>No comments yet</h3>
                <p>Be the first to share your thoughts about MMA in Nepal!</p>
            </div>
        `;
        return;
    }

    comments.forEach(comment => {
        const commentCard = document.createElement('div');
        commentCard.className = 'comment-card';
        commentCard.innerHTML = `
            <div class="comment-header">
                <div class="comment-author">${escapeHtml(comment.name)}</div>
                <div class="comment-date">${comment.date}</div>
            </div>
            <div class="comment-text">${escapeHtml(comment.comment)}</div>
        `;
        commentsContainer.appendChild(commentCard);
    });
}

// Load comments from localStorage or use sample data
function loadComments() {
    const savedComments = localStorage.getItem('mmaNepalComments');
    
    if (savedComments) {
        comments = JSON.parse(savedComments);
    } else {
        loadSampleComments();
    }
}

// Save comments to localStorage
function saveComments() {
    localStorage.setItem('mmaNepalComments', JSON.stringify(comments));
}

// Load sample comments
function loadSampleComments() {
    comments = [
        {
            id: 1,
            name: "Raj Thapa",
            comment: "MMA has changed my life! The discipline and strength I've gained is incredible. The community here is so supportive!",
            date: "January 15, 2024 at 2:30 PM"
        },
        {
            id: 2,
            name: "Sita Gurung",
            comment: "Proud to see Nepalese warriors making their mark in international MMA competitions! Let's keep growing together!",
            date: "January 10, 2024 at 10:15 AM"
        },
        {
            id: 3,
            name: "Bikram Shah",
            comment: "The training facilities and community support here are amazing. I've met so many dedicated fighters and made lifelong friends.",
            date: "January 8, 2024 at 4:45 PM"
        }
    ];
}

// JavaScript specific to the Ecosystem page
function initializeEcosystemPage() {
    // Add hover effects for gym cards
    enhanceGymCards();
    
    // Add scroll animations
    initScrollAnimations();
}

function enhanceGymCards() {
    const gymCards = document.querySelectorAll('.gym-card');
    
    gymCards.forEach(card => {
        // Add click effect for mobile
        card.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                // Remove active class from all cards
                gymCards.forEach(otherCard => {
                    if (otherCard !== card) {
                        otherCard.classList.remove('active');
                    }
                });
                // Toggle active class on clicked card
                this.classList.toggle('active');
            }
        });
        
        // Add keyboard navigation
        card.setAttribute('tabindex', '0');
        card.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                if (window.innerWidth <= 768) {
                    this.classList.toggle('active');
                }
            }
        });
    });
}

function initScrollAnimations() {
    const gymCards = document.querySelectorAll('.gym-card');
    const programCards = document.querySelectorAll('.program-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });
    
    // Set initial state for animation
    gymCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
    
    programCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
}

// Utility function to escape HTML (prevent XSS)
function escapeHtml(unsafe) {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// Show notification function
function showNotification(message, type = 'success') {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    // Create new notification
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 2rem;
        background: ${type === 'error' ? '#ff4444' : '#00aa00'};
        color: white;
        border-radius: 5px;
        z-index: 3000;
        animation: slideIn 0.3s ease;
        font-family: Arial, sans-serif;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        max-width: 90%;
        word-wrap: break-word;
    `;
    
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 3000);
}

// Add CSS for notifications and community features
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    
    .no-comments {
        text-align: center;
        color: #888;
        font-style: italic;
        grid-column: 1 / -1;
        padding: 3rem;
        background: #222;
        border-radius: 10px;
        border: 2px dashed #444;
    }
    
    .no-comments h3 {
        color: #ff0000;
        margin-bottom: 1rem;
    }
    
    .comment-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
        flex-wrap: wrap;
        gap: 0.5rem;
    }
    
    /* Mobile-specific improvements */
    @media (max-width: 480px) {
        .comment-header {
            flex-direction: column;
            align-items: flex-start;
        }
        
        .comment-date {
            font-size: 0.8rem;
        }
    }
`;
document.head.appendChild(style);

// Contact form handling
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const subject = document.getElementById('subject').value.trim();
            const message = document.getElementById('message').value.trim();
            
            // Simple validation
            if (name && email && subject && message) {
                // In a real application, you would send this data to a server
                // For now, we'll just show a success message
                showNotification('Thank you for your message! We will get back to you soon.', 'success');
                contactForm.reset();
            } else {
                showNotification('Please fill in all fields.', 'error');
            }
        });
    }
    
    // Show notification function
    function showNotification(message, type = 'success') {
        // Remove existing notification
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        // Create new notification
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            padding: 1rem 2rem;
            background: ${type === 'error' ? '#ff4444' : '#00aa00'};
            color: white;
            border-radius: 5px;
            z-index: 3000;
            animation: slideIn 0.3s ease;
            font-family: Arial, sans-serif;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            max-width: 90%;
            word-wrap: break-word;
        `;
        
        document.body.appendChild(notification);
        
        // Remove notification after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }, 3000);
    }
});




