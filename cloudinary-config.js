// ================================
// Cloudinary Configuration Template
// ================================
//
// SETUP INSTRUCTIONS:
// 1. Go to https://cloudinary.com/users/register/free
// 2. Sign up for a free account
// 3. Go to Dashboard
// 4. Copy your Cloud Name
// 5. Go to Settings → Upload → Upload presets
// 6. Create an UNSIGNED upload preset named "mubarak_club_uploads"
// 7. Replace the values below with YOUR actual config
//
// ⚠️ Cloud Name is public, but keep API Secret private!
// ================================

const cloudinaryConfig = {
  cloudName: 'da2zdaxlv',  // From Cloudinary Dashboard
  uploadPreset: 'mubarak_club_uploads',  // Your unsigned upload preset
  apiKey: '981172351697479',  // Optional: from Dashboard
  folder: 'mubarak-club'  // Folder to organize uploads
};

// Cloudinary Upload Widget
let cloudinaryWidget = null;

function initCloudinaryWidget() {
  if (typeof cloudinary === 'undefined') {
    console.error('❌ Cloudinary library not loaded');
    return null;
  }

  cloudinaryWidget = cloudinary.createUploadWidget({
    cloudName: cloudinaryConfig.cloudName,
    uploadPreset: cloudinaryConfig.uploadPreset,
    folder: cloudinaryConfig.folder,
    sources: [
      'local',      // Upload from computer
      'url',        // Upload from URL
      'camera'      // Take photo with webcam
    ],
    multiple: false,  // Single file upload
    maxFileSize: 10000000,  // 10MB limit
    clientAllowedFormats: ['pdf', 'jpg', 'png', 'jpeg', 'doc', 'docx', 'ppt', 'pptx', 'zip'],
    resourceType: 'auto',  // Auto-detect file type
    maxImageWidth: 2000,   // Resize large images
    maxImageHeight: 2000,
    cropping: false,       // Disable cropping UI
    showPoweredBy: false,  // Hide "Powered by Cloudinary"
    styles: {
      palette: {
        window: "#FFFFFF",
        windowBorder: "#000000",
        tabIcon: "#F472B6",
        menuIcons: "#5A616A",
        textDark: "#000000",
        textLight: "#FFFFFF",
        link: "#F472B6",
        action: "#F472B6",
        inactiveTabIcon: "#000000",
        error: "#EF4444",
        inProgress: "#FEF08A",
        complete: "#10B981",
        sourceBg: "#FFFFFF"
      },
      fonts: {
        default: null,
        "'Space Grotesk', sans-serif": {
          url: "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;600;700",
          active: true
        }
      }
    }
  }, (error, result) => {
    if (error) {
      console.error('Cloudinary upload error:', error);
      alert('Upload failed: ' + error.message);
      return;
    }

    if (result && result.event === "success") {
      console.log('✅ File uploaded:', result.info.secure_url);

      // Return the uploaded file URL
      if (window.cloudinaryUploadCallback) {
        window.cloudinaryUploadCallback(result.info);
      }
    }
  });

  return cloudinaryWidget;
}

// Function to open upload widget
function openCloudinaryUpload(callback) {
  if (!cloudinaryWidget) {
    cloudinaryWidget = initCloudinaryWidget();
  }

  if (!cloudinaryWidget) {
    alert('Cloudinary not configured. Please check cloudinary-config.js');
    return;
  }

  // Set callback for when upload completes
  window.cloudinaryUploadCallback = callback;

  // Open the widget
  cloudinaryWidget.open();
}

// Helper function to get optimized image URL
function getOptimizedImageUrl(publicId, options = {}) {
  const width = options.width || 800;
  const quality = options.quality || 'auto';
  const format = options.format || 'auto';

  return `https://res.cloudinary.com/${cloudinaryConfig.cloudName}/image/upload/w_${width},q_${quality},f_${format}/${publicId}`;
}

// Helper function to get file thumbnail
function getThumbnailUrl(publicId, resourceType = 'image') {
  if (resourceType === 'image') {
    return `https://res.cloudinary.com/${cloudinaryConfig.cloudName}/image/upload/w_200,h_200,c_fill/${publicId}`;
  } else {
    // For PDFs and other files, return a generic icon
    return `https://res.cloudinary.com/${cloudinaryConfig.cloudName}/image/upload/w_200,h_200,c_fill/icons/file-icon.png`;
  }
}

// Export for use in other scripts
window.cloudinary_config = {
  ...cloudinaryConfig,
  widget: cloudinaryWidget,
  openUpload: openCloudinaryUpload,
  getOptimizedUrl: getOptimizedImageUrl,
  getThumbnail: getThumbnailUrl
};

console.log('✅ Cloudinary configuration loaded');