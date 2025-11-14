# Mubarak Club - Economics Education Website 📚

A creative neobrutalist personal webpage for economics education with bilingual support (Arabic/English).

## 🌟 Features

### Frontend
- **Bilingual Support**: Arabic (default) & English with easy language switching
- **Neobrutalist Design**: Bold borders, vibrant colors, chunky shadows
- **Responsive Layout**: Works perfectly on mobile, tablet, and desktop
- **Smooth Animations**: Scroll animations, hover effects, transitions
- **RTL/LTR Support**: Proper styling for both text directions

### Content Management System (CMS)
- **Secure Admin Panel**: Password-protected content management
- **CRUD Operations**: Create, Read, Update, Delete for all content types
- **Blog Management**: Add/edit/delete blog posts with bilingual content
- **Video Management**: Manage YouTube video links and descriptions
- **Resource Management**: Handle downloadable study materials
- **Data Export**: Backup your data as JSON

## 📄 Pages

1. **index.html** - Homepage with language switcher (bilingual - Arabic default)
2. **index-english-only.html** - English-only version (backup)
3. **index-ar.html** - Arabic-only version (backup)
4. **blog.html** - Blog listing with search and filter
5. **blog-post-1.html** - Sample blog post
6. **videos.html** - Video gallery organized by categories
7. **resources.html** - Downloadable study materials
8. **404.html** - Creative error page
9. **admin.html** - Content Management System

## 🔐 Admin Panel

### Accessing the Admin Panel

1. Navigate to: `admin.html`
2. Login with default credentials:
   - **Username**: `admin`
   - **Password**: `mubarak2024`

⚠️ **IMPORTANT**: Change these credentials immediately after first login!

### Managing Content

#### Blog Posts
- Add new posts with English and Arabic titles/content
- Categorize posts (Study Tips, Bahrain, Concepts, etc.)
- Add tags for better organization
- Edit or delete existing posts

#### Videos
- Add YouTube video IDs
- Provide bilingual titles and descriptions
- Organize by category (Microeconomics, Macroeconomics, Finance, Trade)
- Add tags for searchability

#### Resources
- Add study guides, practice tests, flashcards
- Provide download links (Google Drive, Dropbox, etc.)
- Specify file type, size, and format
- Bilingual descriptions

### Security Features

1. **Password Protection**: Secure login system
2. **Session Management**: Auto-logout on browser close
3. **Password Change**: Update credentials anytime
4. **Data Backup**: Export all data as JSON

### Data Storage

- Content is stored in browser's **localStorage**
- Data persists unless browser data is cleared
- Regular backups recommended (use Export feature)

## 🚀 Deployment

### GitHub Pages

1. Push code to GitHub repository
2. Go to Settings → Pages
3. Select `master` branch
4. Your site will be live at: `https://username.github.io/repo-name/`

### Custom Domain (Optional)

1. Add a `CNAME` file with your domain
2. Configure DNS settings with your provider
3. Update GitHub Pages settings

## 🎨 Customization

### Colors

The site uses a vibrant neobrutalist palette:
- Yellow (#FEF08A) - Primary
- Pink (#F472B6) - Accent
- Cyan (#67E8F9) - Secondary
- Lime (#BEF264) - Tertiary
- Purple (#C084FC) - Highlight

### Fonts

- **Arabic**: Cairo (Google Fonts)
- **English**: Space Grotesk (Google Fonts)

### YouTube Videos

Replace placeholder video IDs (`dQw4w9WgXcQ`) with your actual YouTube video IDs:
1. Go to Admin Panel
2. Navigate to "Manage Videos"
3. Edit each video
4. Enter your YouTube video ID (from `youtube.com/watch?v=VIDEO_ID`)

### Contact Information

Update these in the admin panel or directly in the HTML files:
- Email address
- YouTube channel URL
- Social media links (Twitter, Instagram)

## 📦 File Structure

```
mubarak-club-website/
├── index-bilingual.html    # Main bilingual homepage
├── index.html              # English homepage
├── index-ar.html           # Arabic homepage
├── blog.html               # Blog listing
├── blog-post-1.html        # Sample blog post
├── videos.html             # Video gallery
├── resources.html          # Study resources
├── 404.html                # Error page
├── admin.html              # CMS interface
├── admin.js                # CMS functionality
└── README.md               # This file
```

## 🛠️ Technologies Used

- **HTML5**: Structure
- **Tailwind CSS**: Styling (via CDN)
- **JavaScript**: Interactivity and CMS
- **LocalStorage**: Data persistence
- **Google Fonts**: Typography

## 📱 Responsive Breakpoints

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## 🔧 Browser Support

- Chrome/Edge (recommended)
- Firefox
- Safari
- Opera

## 🎯 Future Enhancements

Consider integrating:
- **Backend Database**: Firebase, Supabase, or custom API
- **Image Upload**: Cloudinary or similar service
- **Analytics**: Google Analytics or Plausible
- **Comments**: Disqus or custom solution
- **Newsletter**: Mailchimp integration
- **Search**: Algolia or custom implementation

## 📝 Content Guidelines

### Blog Posts
- Write clear, engaging titles
- Keep excerpts under 150 characters
- Use proper categorization
- Add relevant tags
- Proofread before publishing

### Videos
- Use descriptive titles
- Write comprehensive descriptions
- Verify YouTube video IDs
- Organize by appropriate category
- Keep content relevant to economics

### Resources
- Provide clear titles
- Host files on reliable platforms
- Specify file size and format
- Test download links regularly
- Update outdated materials

## 🐛 Troubleshooting

### Admin Panel Won't Load
- Clear browser cache
- Check JavaScript console for errors
- Ensure `admin.js` is in the same directory

### Data Lost
- Check if localStorage was cleared
- Restore from JSON backup
- Re-enter content via admin panel

### Language Switcher Not Working
- Verify localStorage is enabled
- Check browser console for errors
- Try different browser

## 📞 Support

For issues or questions:
- Email: contact@mubarakclub.com
- GitHub Issues: [Create an issue](https://github.com/almahmeed-dev/mubarak-club-website/issues)

## 📄 License

© 2024 Mubarak Club. All rights reserved.

---

**Built with ❤️ for Economics Students in Bahrain and beyond.**

🤖 Generated with [Claude Code](https://claude.com/claude-code)