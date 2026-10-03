# SEO 404 Fix - Deployment Checklist

## Pre-Deployment (Local Testing)

### Step 1: Build Verification
```bash
cd puramente/frontend
npm run build
```
✅ **Expected:** Build completes with no errors  
❌ **If fails:** Check for TypeScript errors in `sitemap.js` and `robots.js`

### Step 2: Local Sitemap Test
```bash
npm run dev
# Visit: http://localhost:3000/sitemap.xml
```
✅ **Expected:** 
- Valid XML displayed in browser
- Contains `/en-in/`, `/en-gb/`, `/en-ae/` routes
- Contains product URLs like `/product/[id]`
- Contains blog URLs like `/blog/[slug]`

### Step 3: Local Robots Test
```bash
# Visit: http://localhost:3000/robots.txt
```
✅ **Expected:**
- Plain text file displayed
- Contains "User-agent: *"
- Contains all 14 locale paths
- Contains "Disallow: /admin/"

### Step 4: Route Testing
```bash
# Test these URLs return 200 (not 404):
http://localhost:3000/en-in/store/ring
http://localhost:3000/en-gb/store/ring
http://localhost:3000/en-ae/custom
http://localhost:3000/blog
```

---

## Deployment Steps

### Step 1: Merge to Main Branch
```bash
git add .
git commit -m "Fix: SEO 404 issues - Add dynamic sitemap and robots"
git push origin main
```

### Step 2: Deploy to Production
**Using your deployment method:**
- **Vercel:** Auto-deploys on main push
- **Docker/VPS:** Run deployment script
- **Manual:** Copy files and restart server

### Step 3: Verify Production Sitemap
```bash
# Visit: https://puramentejewel.com/sitemap.xml
```
✅ **Expected:**
- XML displays correctly
- All URLs have `puramentejewel.com` domain
- URL count > 1,000
- Recent `lastModified` dates

### Step 4: Verify Production Robots
```bash
# Visit: https://puramentejewel.com/robots.txt
```
✅ **Expected:**
- Displays correctly
- Sitemap points to correct domain
- All locale paths allowed

---

## Post-Deployment (Google Search Console)

### Step 1: Update Sitemap in GSC
1. Go to [Google Search Console](https://search.google.com/search-console)
2. Select "Puramente Jewel" property
3. Go to **Sitemaps** section
4. Delete old sitemap (if exists)
5. Add new: `https://puramentejewel.com/sitemap.xml`
6. Click **Submit**

### Step 2: Request Re-crawl
1. Go to **URL Inspection** tool
2. Test a few key URLs:
   - `https://puramentejewel.com/`
   - `https://puramentejewel.com/en-in/store/ring`
   - `https://puramentejewel.com/blog`
3. Click **Request Indexing** for each
4. Monitor for "Coverage" status

### Step 3: Monitor Coverage
1. Go to **Coverage** report
2. Look for:
   - ✅ Indexed pages increasing
   - ❌ Errors decreasing (especially 404s)
   - ⚠️ Valid with warnings stable

### Step 4: Check Crawl Stats
1. Go to **About this property** → **Crawl stats**
2. Monitor:
   - Requests per day (should increase initially)
   - Kilobytes downloaded
   - Response time

---

## Troubleshooting

### Sitemap Not Loading
**Problem:** `https://puramentejewel.com/sitemap.xml` returns 404
**Solution:**
1. Check `NEXT_PUBLIC_BASE_URL` in `.env.production`
2. Verify build includes `sitemap.js`
3. Restart application

### API Integration Issues
**Problem:** Sitemap has only static routes (no products/blogs)
**Solution:**
1. Check `NEXT_PUBLIC_API_BASE_URL` correct
2. Verify API endpoint `/api/products` is accessible
3. Check API response format matches expectations
4. Review server logs for fetch errors

### Wrong Domain in Sitemap
**Problem:** URLs show `localhost` or wrong domain
**Solution:**
1. Verify `NEXT_PUBLIC_BASE_URL` in `.env.production`
2. Rebuild: `npm run build`
3. Redeploy application

### 404s Still Appearing in GSC
**Problem:** New 404s appearing despite fix
**Solution:**
1. Check if URLs are dynamic routes
2. Verify route handlers exist in `/src/app`
3. Check middleware redirects not interfering
4. Review server logs for routing errors

---

## Verification Metrics

### Before Fix
- ❌ Sitemap: ~30 URLs (static only)
- ❌ 404 pages indexed: 1,300+
- ❌ Product pages: Not in sitemap
- ❌ Blog posts: Not in sitemap
- ❌ Locale variants: Missing

### After Fix (Expected)
- ✅ Sitemap: 1,300+ URLs
- ✅ 404 pages indexed: 0 (over time)
- ✅ Product pages: All included
- ✅ Blog posts: All included
- ✅ Locale variants: All 14 locales

### Timeline
- **Week 1:** Sitemap submitted, crawl increases
- **Week 2-3:** Google re-crawls all new URLs
- **Week 3-4:** 404s indexed drop significantly
- **Month 2:** Full stabilization, new pages indexed normally

---

## Rollback Plan (If Needed)

### Quick Rollback
```bash
git revert <commit-hash>
git push origin main
```

### Fallback to Old Sitemap
```bash
# Temporarily restore static sitemap
cp public/sitemap.xml.bak public/sitemap.xml
```

---

## Post-Fix Maintenance

### Monthly Tasks
- [ ] Check Google Search Console coverage report
- [ ] Monitor crawl stats
- [ ] Verify no new 404 errors
- [ ] Test sitemap URL count growth

### Quarterly Tasks
- [ ] Audit top crawled pages
- [ ] Review crawl budget usage
- [ ] Optimize robots.txt if needed
- [ ] Update GSC Search Performance report

### New Content
**When adding products:**
- No action needed - auto-included via API

**When adding blog posts:**
- No action needed - auto-included via API

**When adding new static pages:**
- Add to `staticRoutes` in `sitemap.js`
- Redeploy

---

## Contact & Support

**Questions or Issues?**
- Check `/frontend/SEO_FIX_SUMMARY.md` for detailed info
- Review server logs: `npm run dev`
- Test API endpoints manually
- Verify environment variables set correctly

---

**Last Updated:** October 3, 2026  
**Status:** Ready for Deployment  
**Estimated Time to Resolution:** 2-4 weeks
