# SEO Files for Google Indexing

This document outlines the SEO files and configurations added to improve Google search engine indexing.

## Files Created

### 1. `app/sitemap.ts`
- **Purpose**: Generates a dynamic XML sitemap for search engines
- **Location**: `/sitemap.xml`
- **Features**:
  - Lists all public pages with priorities and change frequencies
  - Automatically updates when pages are added
  - Uses `NEXT_PUBLIC_APP_URL` environment variable for base URL

### 2. `app/robots.ts`
- **Purpose**: Controls search engine crawler access
- **Location**: `/robots.txt`
- **Features**:
  - Allows crawling of public pages
  - Blocks private/admin pages (dashboard, admin, API routes, etc.)
  - References sitemap location
  - Includes specific rules for Googlebot

### 3. `app/manifest.ts`
- **Purpose**: Web App Manifest for PWA support
- **Location**: `/manifest.json`
- **Features**:
  - Defines app name, description, and icons
  - Enables "Add to Home Screen" functionality
  - Improves mobile SEO and user experience

## Enhanced Metadata

### Root Layout (`app/layout.tsx`)
- Enhanced metadata with:
  - Comprehensive Open Graph tags
  - Twitter Card metadata
  - Robots directives
  - Canonical URLs
  - Keywords and descriptions

### Structured Data (JSON-LD)

#### Home Page (`app/page.tsx`)
- SoftwareApplication schema
- Organization information
- Contact details
- Feature list

#### Pricing Page (`app/pricing/page.tsx`)
- WebPage schema
- Breadcrumb navigation

#### About Page (`app/about/page.tsx`)
- AboutPage schema
- Organization details

## Environment Variables Required

Add to your `.env.local` or deployment environment:

```env
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

**Important**: Replace `https://yourdomain.com` with your actual domain URL.

## Testing

### Verify Sitemap
Visit: `https://yourdomain.com/sitemap.xml`

### Verify Robots.txt
Visit: `https://yourdomain.com/robots.txt`

### Verify Manifest
Visit: `https://yourdomain.com/manifest.json`

### Google Search Console
1. Submit your sitemap at: https://search.google.com/search-console
2. Add property: `https://yourdomain.com`
3. Submit sitemap: `https://yourdomain.com/sitemap.xml`

## SEO Best Practices Implemented

✅ XML Sitemap for easy crawling
✅ Robots.txt for crawl control
✅ Structured data (JSON-LD) for rich snippets
✅ Open Graph tags for social sharing
✅ Twitter Card metadata
✅ Canonical URLs
✅ Meta descriptions and keywords
✅ Proper heading hierarchy
✅ Mobile-friendly (responsive design)
✅ Fast loading times
✅ Secure HTTPS (when deployed)

## Next Steps

1. **Set Environment Variable**: Add `NEXT_PUBLIC_APP_URL` with your production domain
2. **Submit to Google**: Use Google Search Console to submit your sitemap
3. **Monitor**: Check Google Search Console regularly for indexing status
4. **Update**: Keep sitemap updated as you add new pages

## Additional Recommendations

- Add more structured data for blog posts (Article schema)
- Implement breadcrumb navigation on all pages
- Add alt text to all images
- Ensure all internal links use proper anchor text
- Create a 404 page with helpful navigation
- Implement lazy loading for images
- Add schema.org markup for reviews/testimonials (if applicable)
