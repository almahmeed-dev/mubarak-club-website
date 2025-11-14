// Admin Panel JavaScript - Mubarak Club CMS

// ==================== FIREBASE AUTHENTICATION ====================

// Default credentials (CHANGE THESE AFTER FIRST LOGIN!)
const DEFAULT_EMAIL = 'admin@mubarakclub.com';
const DEFAULT_PASSWORD = 'mubarak2024';

// Wait for Firebase to be ready
let firebaseReady = false;

// Check Firebase initialization
function waitForFirebase() {
    return new Promise((resolve) => {
        if (window.firebaseApp && window.firebaseApp.auth) {
            firebaseReady = true;
            resolve();
        } else {
            setTimeout(() => waitForFirebase().then(resolve), 100);
        }
    });
}

// Firebase Auth State Observer
waitForFirebase().then(() => {
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            // User is signed in
            console.log('✅ User authenticated:', user.email);
            showDashboard();
            document.getElementById('current-user').textContent = user.email;
            loadAllData();
        } else {
            // User is signed out
            console.log('❌ User not authenticated');
            document.getElementById('login-screen').classList.remove('hidden');
            document.getElementById('admin-dashboard').classList.add('hidden');
        }
    });
});

// Login form handler with Firebase Auth
document.getElementById('login-form').addEventListener('submit', async function(e) {
    e.preventDefault();

    const email = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Show loading state
    const submitButton = this.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Logging in...';
    submitButton.disabled = true;

    try {
        // Try to sign in with Firebase
        await firebase.auth().signInWithEmailAndPassword(email, password);
        console.log('✅ Login successful');
        // Dashboard will show automatically via auth state observer
    } catch (error) {
        console.error('Login error:', error.code);

        // If user doesn't exist and using default credentials, create the account
        if (error.code === 'auth/user-not-found' && email === DEFAULT_EMAIL && password === DEFAULT_PASSWORD) {
            try {
                console.log('Creating default admin account...');
                await firebase.auth().createUserWithEmailAndPassword(DEFAULT_EMAIL, DEFAULT_PASSWORD);
                alert('✅ Default admin account created! Please change your password in Settings.\n\nEmail: ' + DEFAULT_EMAIL);
            } catch (createError) {
                console.error('Account creation error:', createError);
                showLoginError('Failed to create admin account: ' + createError.message);
            }
        } else if (error.code === 'auth/wrong-password') {
            showLoginError('Incorrect password!');
        } else if (error.code === 'auth/invalid-email') {
            showLoginError('Invalid email address!');
        } else if (error.code === 'auth/user-not-found') {
            showLoginError('User not found! Use default credentials: ' + DEFAULT_EMAIL);
        } else {
            showLoginError('Login failed: ' + error.message);
        }
    } finally {
        submitButton.textContent = originalText;
        submitButton.disabled = false;
    }
});

// Show login error
function showLoginError(message) {
    const errorDiv = document.getElementById('login-error');
    errorDiv.textContent = message;
    errorDiv.classList.remove('hidden');
    setTimeout(() => {
        errorDiv.classList.add('hidden');
    }, 5000);
}

// Show dashboard
function showDashboard() {
    document.getElementById('login-screen').classList.add('hidden');
    document.getElementById('admin-dashboard').classList.remove('hidden');
}

// Logout with Firebase
async function logout() {
    if (confirm('Are you sure you want to logout?')) {
        try {
            await firebase.auth().signOut();
            console.log('✅ Logout successful');
            location.reload();
        } catch (error) {
            console.error('Logout error:', error);
            alert('Logout failed: ' + error.message);
        }
    }
}

// Change password with Firebase
document.getElementById('change-password-form').addEventListener('submit', async function(e) {
    e.preventDefault();

    const current = document.getElementById('current-password').value;
    const newPass = document.getElementById('new-password').value;
    const confirm = document.getElementById('confirm-password').value;

    if (newPass !== confirm) {
        alert('❌ New passwords do not match!');
        return;
    }

    if (newPass.length < 8) {
        alert('❌ Password must be at least 8 characters!');
        return;
    }

    try {
        const user = firebase.auth().currentUser;

        if (!user) {
            alert('❌ No user is currently logged in!');
            return;
        }

        // Re-authenticate user with current password
        const credential = firebase.auth.EmailAuthProvider.credential(
            user.email,
            current
        );

        await user.reauthenticateWithCredential(credential);
        console.log('✅ Re-authentication successful');

        // Update password
        await user.updatePassword(newPass);
        console.log('✅ Password updated successfully');

        alert('✅ Password changed successfully in Firebase!');
        this.reset();
    } catch (error) {
        console.error('Password change error:', error);

        if (error.code === 'auth/wrong-password') {
            alert('❌ Current password is incorrect!');
        } else if (error.code === 'auth/weak-password') {
            alert('❌ New password is too weak!');
        } else {
            alert('❌ Password change failed: ' + error.message);
        }
    }
});

// ==================== DATA MANAGEMENT ====================

// Initialize data structure
function initializeData() {
    if (!localStorage.getItem('blogs')) {
        localStorage.setItem('blogs', JSON.stringify([]));
    }
    if (!localStorage.getItem('videos')) {
        localStorage.setItem('videos', JSON.stringify([]));
    }
    if (!localStorage.getItem('resources')) {
        localStorage.setItem('resources', JSON.stringify([]));
    }
}

// Load all data
function loadAllData() {
    initializeData();
    loadBlogs();
    loadVideos();
    loadResources();
    updateStats();
}

// Update statistics
function updateStats() {
    const blogs = JSON.parse(localStorage.getItem('blogs') || '[]');
    const videos = JSON.parse(localStorage.getItem('videos') || '[]');
    const resources = JSON.parse(localStorage.getItem('resources') || '[]');

    document.getElementById('blog-count').textContent = blogs.length;
    document.getElementById('video-count').textContent = videos.length;
    document.getElementById('resource-count').textContent = resources.length;
    document.getElementById('subscriber-count').textContent = '0'; // Placeholder
}

// ==================== TAB MANAGEMENT ====================

function showTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.add('hidden');
    });

    // Remove active class from all buttons
    document.querySelectorAll('.tab-button').forEach(btn => {
        btn.classList.remove('active');
    });

    // Show selected tab
    document.getElementById(tabName + '-tab').classList.remove('hidden');

    // Add active class to clicked button
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
}

// ==================== BLOG MANAGEMENT ====================

let currentBlogId = null;

function loadBlogs() {
    const blogs = JSON.parse(localStorage.getItem('blogs') || '[]');
    const container = document.getElementById('blogs-list');

    if (blogs.length === 0) {
        container.innerHTML = '<p class="text-center font-bold text-gray-500 py-8">No blog posts yet. Add your first post!</p>';
        return;
    }

    container.innerHTML = blogs.map(blog => `
        <div class="neo-border bg-gray-50 p-4">
            <div class="flex justify-between items-start">
                <div class="flex-1">
                    <h3 class="text-xl font-bold mb-2">${blog.titleEn}</h3>
                    <p class="font-semibold text-gray-600 mb-2">${blog.excerptEn.substring(0, 100)}...</p>
                    <div class="flex gap-2 flex-wrap">
                        <span class="bg-yellow-300 px-3 py-1 text-xs font-bold border-2 border-black">${blog.category}</span>
                        <span class="bg-cyan-300 px-3 py-1 text-xs font-bold border-2 border-black">${blog.date}</span>
                    </div>
                </div>
                <div class="flex gap-2 ml-4">
                    <button onclick="editBlog('${blog.id}')" class="neo-button bg-cyan-400 px-4 py-2 font-bold text-sm">
                        Edit
                    </button>
                    <button onclick="deleteBlog('${blog.id}')" class="neo-button bg-red-400 px-4 py-2 font-bold text-sm">
                        Delete
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

function openBlogModal(blogId = null) {
    currentBlogId = blogId;
    const modal = document.getElementById('blog-modal');

    if (blogId) {
        // Edit mode
        const blogs = JSON.parse(localStorage.getItem('blogs') || '[]');
        const blog = blogs.find(b => b.id === blogId);

        if (blog) {
            document.getElementById('blog-id').value = blog.id;
            document.getElementById('blog-title-en').value = blog.titleEn;
            document.getElementById('blog-title-ar').value = blog.titleAr;
            document.getElementById('blog-excerpt-en').value = blog.excerptEn;
            document.getElementById('blog-excerpt-ar').value = blog.excerptAr;
            document.getElementById('blog-category').value = blog.category;
            document.getElementById('blog-tags').value = blog.tags;
            document.getElementById('blog-date').value = blog.date;
        }
    } else {
        // Add mode
        document.getElementById('blog-form').reset();
        document.getElementById('blog-date').valueAsDate = new Date();
    }

    modal.classList.add('active');
}

function closeBlogModal() {
    document.getElementById('blog-modal').classList.remove('active');
    currentBlogId = null;
}

document.getElementById('blog-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const blogData = {
        id: currentBlogId || 'blog-' + Date.now(),
        titleEn: document.getElementById('blog-title-en').value,
        titleAr: document.getElementById('blog-title-ar').value,
        excerptEn: document.getElementById('blog-excerpt-en').value,
        excerptAr: document.getElementById('blog-excerpt-ar').value,
        category: document.getElementById('blog-category').value,
        tags: document.getElementById('blog-tags').value,
        date: document.getElementById('blog-date').value,
        createdAt: new Date().toISOString()
    };

    let blogs = JSON.parse(localStorage.getItem('blogs') || '[]');

    if (currentBlogId) {
        // Update existing
        blogs = blogs.map(b => b.id === currentBlogId ? blogData : b);
    } else {
        // Add new
        blogs.push(blogData);
    }

    localStorage.setItem('blogs', JSON.stringify(blogs));
    loadBlogs();
    updateStats();
    closeBlogModal();

    alert('Blog post saved successfully!');
});

function editBlog(id) {
    openBlogModal(id);
}

function deleteBlog(id) {
    if (confirm('Are you sure you want to delete this blog post?')) {
        let blogs = JSON.parse(localStorage.getItem('blogs') || '[]');
        blogs = blogs.filter(b => b.id !== id);
        localStorage.setItem('blogs', JSON.stringify(blogs));
        loadBlogs();
        updateStats();
    }
}

// ==================== VIDEO MANAGEMENT ====================

let currentVideoId = null;

function loadVideos() {
    const videos = JSON.parse(localStorage.getItem('videos') || '[]');
    const container = document.getElementById('videos-list');

    if (videos.length === 0) {
        container.innerHTML = '<p class="text-center font-bold text-gray-500 py-8">No videos yet. Add your first video!</p>';
        return;
    }

    container.innerHTML = videos.map(video => `
        <div class="neo-border bg-gray-50 p-4">
            <div class="flex justify-between items-start">
                <div class="flex-1">
                    <h3 class="text-xl font-bold mb-2">${video.titleEn}</h3>
                    <p class="font-semibold text-gray-600 mb-2">${video.descEn.substring(0, 100)}...</p>
                    <div class="flex gap-2 flex-wrap">
                        <span class="bg-pink-300 px-3 py-1 text-xs font-bold border-2 border-black">${video.category}</span>
                        <span class="bg-purple-300 px-3 py-1 text-xs font-bold border-2 border-black">ID: ${video.youtubeId}</span>
                    </div>
                </div>
                <div class="flex gap-2 ml-4">
                    <button onclick="editVideo('${video.id}')" class="neo-button bg-cyan-400 px-4 py-2 font-bold text-sm">
                        Edit
                    </button>
                    <button onclick="deleteVideo('${video.id}')" class="neo-button bg-red-400 px-4 py-2 font-bold text-sm">
                        Delete
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

function openVideoModal(videoId = null) {
    currentVideoId = videoId;
    const modal = document.getElementById('video-modal');

    if (videoId) {
        const videos = JSON.parse(localStorage.getItem('videos') || '[]');
        const video = videos.find(v => v.id === videoId);

        if (video) {
            document.getElementById('video-id').value = video.id;
            document.getElementById('video-title-en').value = video.titleEn;
            document.getElementById('video-title-ar').value = video.titleAr;
            document.getElementById('video-youtube-id').value = video.youtubeId;
            document.getElementById('video-desc-en').value = video.descEn;
            document.getElementById('video-desc-ar').value = video.descAr;
            document.getElementById('video-category').value = video.category;
            document.getElementById('video-tags').value = video.tags;
        }
    } else {
        document.getElementById('video-form').reset();
    }

    modal.classList.add('active');
}

function closeVideoModal() {
    document.getElementById('video-modal').classList.remove('active');
    currentVideoId = null;
}

document.getElementById('video-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const videoData = {
        id: currentVideoId || 'video-' + Date.now(),
        titleEn: document.getElementById('video-title-en').value,
        titleAr: document.getElementById('video-title-ar').value,
        youtubeId: document.getElementById('video-youtube-id').value,
        descEn: document.getElementById('video-desc-en').value,
        descAr: document.getElementById('video-desc-ar').value,
        category: document.getElementById('video-category').value,
        tags: document.getElementById('video-tags').value,
        createdAt: new Date().toISOString()
    };

    let videos = JSON.parse(localStorage.getItem('videos') || '[]');

    if (currentVideoId) {
        videos = videos.map(v => v.id === currentVideoId ? videoData : v);
    } else {
        videos.push(videoData);
    }

    localStorage.setItem('videos', JSON.stringify(videos));
    loadVideos();
    updateStats();
    closeVideoModal();

    alert('Video saved successfully!');
});

function editVideo(id) {
    openVideoModal(id);
}

function deleteVideo(id) {
    if (confirm('Are you sure you want to delete this video?')) {
        let videos = JSON.parse(localStorage.getItem('videos') || '[]');
        videos = videos.filter(v => v.id !== id);
        localStorage.setItem('videos', JSON.stringify(videos));
        loadVideos();
        updateStats();
    }
}

// ==================== RESOURCE MANAGEMENT ====================

let currentResourceId = null;

function loadResources() {
    const resources = JSON.parse(localStorage.getItem('resources') || '[]');
    const container = document.getElementById('resources-list');

    if (resources.length === 0) {
        container.innerHTML = '<p class="text-center font-bold text-gray-500 py-8">No resources yet. Add your first resource!</p>';
        return;
    }

    container.innerHTML = resources.map(resource => `
        <div class="neo-border bg-gray-50 p-4">
            <div class="flex justify-between items-start">
                <div class="flex-1">
                    <h3 class="text-xl font-bold mb-2">${resource.titleEn}</h3>
                    <p class="font-semibold text-gray-600 mb-2">${resource.descEn.substring(0, 100)}...</p>
                    <div class="flex gap-2 flex-wrap">
                        <span class="bg-lime-300 px-3 py-1 text-xs font-bold border-2 border-black">${resource.type}</span>
                        <span class="bg-orange-300 px-3 py-1 text-xs font-bold border-2 border-black">${resource.format}</span>
                        <span class="bg-yellow-300 px-3 py-1 text-xs font-bold border-2 border-black">${resource.size}</span>
                    </div>
                </div>
                <div class="flex gap-2 ml-4">
                    <button onclick="editResource('${resource.id}')" class="neo-button bg-cyan-400 px-4 py-2 font-bold text-sm">
                        Edit
                    </button>
                    <button onclick="deleteResource('${resource.id}')" class="neo-button bg-red-400 px-4 py-2 font-bold text-sm">
                        Delete
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

function openResourceModal(resourceId = null) {
    currentResourceId = resourceId;
    const modal = document.getElementById('resource-modal');

    if (resourceId) {
        const resources = JSON.parse(localStorage.getItem('resources') || '[]');
        const resource = resources.find(r => r.id === resourceId);

        if (resource) {
            document.getElementById('resource-id').value = resource.id;
            document.getElementById('resource-title-en').value = resource.titleEn;
            document.getElementById('resource-title-ar').value = resource.titleAr;
            document.getElementById('resource-desc-en').value = resource.descEn;
            document.getElementById('resource-desc-ar').value = resource.descAr;
            document.getElementById('resource-type').value = resource.type;
            document.getElementById('resource-url').value = resource.url;
            document.getElementById('resource-size').value = resource.size;
            document.getElementById('resource-format').value = resource.format;
        }
    } else {
        document.getElementById('resource-form').reset();
    }

    modal.classList.add('active');
}

function closeResourceModal() {
    document.getElementById('resource-modal').classList.remove('active');
    currentResourceId = null;
}

document.getElementById('resource-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const resourceData = {
        id: currentResourceId || 'resource-' + Date.now(),
        titleEn: document.getElementById('resource-title-en').value,
        titleAr: document.getElementById('resource-title-ar').value,
        descEn: document.getElementById('resource-desc-en').value,
        descAr: document.getElementById('resource-desc-ar').value,
        type: document.getElementById('resource-type').value,
        url: document.getElementById('resource-url').value,
        size: document.getElementById('resource-size').value,
        format: document.getElementById('resource-format').value,
        createdAt: new Date().toISOString()
    };

    let resources = JSON.parse(localStorage.getItem('resources') || '[]');

    if (currentResourceId) {
        resources = resources.map(r => r.id === currentResourceId ? resourceData : r);
    } else {
        resources.push(resourceData);
    }

    localStorage.setItem('resources', JSON.stringify(resources));
    loadResources();
    updateStats();
    closeResourceModal();

    alert('Resource saved successfully!');
});

function editResource(id) {
    openResourceModal(id);
}

function deleteResource(id) {
    if (confirm('Are you sure you want to delete this resource?')) {
        let resources = JSON.parse(localStorage.getItem('resources') || '[]');
        resources = resources.filter(r => r.id !== id);
        localStorage.setItem('resources', JSON.stringify(resources));
        loadResources();
        updateStats();
    }
}

// ==================== DATA EXPORT ====================

function exportData() {
    const data = {
        blogs: JSON.parse(localStorage.getItem('blogs') || '[]'),
        videos: JSON.parse(localStorage.getItem('videos') || '[]'),
        resources: JSON.parse(localStorage.getItem('resources') || '[]'),
        exportDate: new Date().toISOString()
    };

    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `mubarak-club-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);

    alert('Data exported successfully!');
}

// ==================== INITIALIZATION ====================

// Firebase auth state observer handles authentication automatically
// Data structures initialized in loadAllData() called by auth observer

console.log('🚀 Mubarak Club Admin Panel loaded');
console.log('📧 Default login: admin@mubarakclub.com / mubarak2024');
console.log('⚠️ Please change your password after first login!');