// Firebase Configuration (Matching Ability SMP Project)
const firebaseConfig = {
    apiKey: "AIzaSyA6sANvYoAkXHYG8MjbZl6Pyq23CNdBuzA",
    authDomain: "community-canvas-255fa.firebaseapp.com",
    databaseURL: "https://community-canvas-255fa-default-rtdb.firebaseio.com",
    projectId: "community-canvas-255fa",
    storageBucket: "community-canvas-255fa.appspot.com",
    messagingSenderId: "729445267995",
    appId: "1:729445267995:web:05da6756d66c58b9ccd6be"
};

// Initialize Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

const db = firebase.database();
const auth = firebase.auth();

// Blog Functions
const blogRef = db.ref('portfolio/blog/posts');

// Sign in anonymously for visitors (Optional now, but kept for future comment features)
const signInVisitor = async () => {
    try {
        if (!auth.currentUser) {
            await auth.signInAnonymously();
        }
    } catch (error) {
        console.error("Auth Error:", error);
    }
};

// Caching Logic for Seamless UX
const cacheBlogPosts = () => {
    // We only cache the latest 10 for the quick-view
    blogRef.orderByChild('timestamp').limitToLast(10).once('value', (snapshot) => {
        if (snapshot.exists()) {
            const posts = [];
            snapshot.forEach(child => {
                posts.push({ key: child.key, ...child.val() });
            });
            localStorage.setItem('portfolio_blog_cache', JSON.stringify(posts.reverse()));
        }
    });
};

// Render Posts Helper
const renderPostsToContainer = (container, posts) => {
    container.innerHTML = '';
    posts.forEach((post) => {
        const article = document.createElement('article');
        article.className = 'blog-card';
        
        const date = new Date(post.timestamp).toLocaleDateString('en-US', {
            year: 'numeric', month: 'long', day: 'numeric'
        });

        article.innerHTML = `
            <div class="blog-date">${date}</div>
            <h2 class="blog-title">${post.title}</h2>
            <p class="blog-excerpt">${post.excerpt || (post.content.replace(/<[^>]*>/g, '').substring(0, 150) + '...')}</p>
            <a href="post.html?id=${post.key}" class="project-link">Read More →</a>
        `;
        container.appendChild(article);
    });
};

// Fetch and Render Posts
const loadBlogPosts = (containerId) => {
    const container = document.getElementById(containerId);
    if (!container) return;

    // 1. Try Loading from Cache first (Instant)
    const cachedData = localStorage.getItem('portfolio_blog_cache');
    if (cachedData) {
        try {
            const posts = JSON.parse(cachedData);
            renderPostsToContainer(container, posts);
        } catch (e) { console.error("Cache Parse Error", e); }
    } else {
        // Fallback to skeletons if no cache and currently empty
        if (container.innerHTML.trim() === '') {
            const skeletonHTML = `
                <div class="skeleton-card">
                    <div class="skeleton skeleton-date"></div>
                    <div class="skeleton skeleton-title"></div>
                    <div class="skeleton skeleton-text"></div>
                    <div class="skeleton skeleton-text short"></div>
                </div>
            `.repeat(6);
            container.innerHTML = skeletonHTML;
        }
    }

    // 2. Load/Update from Firebase (Background)
    blogRef.orderByChild('timestamp').on('value', (snapshot) => {
        if (!snapshot.exists()) {
            if (!cachedData) container.innerHTML = '<div style="text-align:center; padding:50px; color:#94a3b8;">No posts yet. Stay tuned!</div>';
            return;
        }

        const posts = [];
        snapshot.forEach((child) => {
            posts.push({ key: child.key, ...child.val() });
        });
        
        const finalPosts = posts.reverse();
        renderPostsToContainer(container, finalPosts);
        
        // Update Cache for next visit
        localStorage.setItem('portfolio_blog_cache', JSON.stringify(finalPosts));
    });
};
