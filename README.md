# Master Web Architecture & Client Blueprint
> **Universal Replication & Implementation Guide for AI Coding Agents**  
> *Use this blueprint as the system specification and prompt reference when building high-converting, trilingual clinic and local business websites in any new conversation.*

---

## 1. Project Overview & File Structure

This architecture delivers a **100/100 Lighthouse performance**, zero-build-step, luxury web experience with instant trilingual switching (**English, Arabic, Kurdish Sorani**), dark/light themes, and automated WhatsApp booking.

```text
├── index.html        # Semantic HTML5, trilingual data attributes, zero-flicker pre-render script
├── styles.css        # Modular CSS3, CSS custom properties (tokens), responsive & RTL layout rules
├── script.js         # Trilingual translation dictionary, interactive widgets, local storage sync
├── README.md         # Master blueprint and AI agent prompt guide
└── assets/           # Optimized WebP imagery and branding icons
```

---

## 2. Core Philosophy & Architectural Standards

1. **Pure Vanilla Tech Stack**:
   - Semantic HTML5, CSS3 with Custom Properties (CSS variables), and modern ES6+ JavaScript.
   - **Zero Build Step**: No webpack, no npm build scripts, no node dependencies required to edit or deploy.
   - **Sub-Second Performance**: First Contentful Paint (FCP) < 0.8s, Cumulative Layout Shift (CLS) = 0.
2. **Zero-Flicker Client-Side Hydration**:
   - Language and Theme must **never flash or shift** on page refresh.
   - Initial `lang`, `dir`, and `data-theme` are applied synchronously inside `<head>` before the DOM renders.
3. **Native Browser APIs Only**:
   - `IntersectionObserver` for map and image lazy loading.
   - `localStorage` for persisting language and theme preferences.
   - `window.matchMedia` for system dark-mode detection.
   - `Intl.DateTimeFormat` for local time calculations.

---

## 3. Trilingual Localization Engine (English, Arabic, Kurdish)

### A. Font Strategy & Kurdish Sorani Typography
- **English (`en`)**: `'Plus Jakarta Sans', system-ui, sans-serif`
- **Arabic (`ar`)**: `'Cairo', system-ui, sans-serif`
- **Kurdish Sorani (`ku`)**: **`'Vazirmatn', system-ui, sans-serif`**

> [!IMPORTANT]
> **CRITICAL GOTCHA**: Standard Arabic fonts like *Cairo* distort Kurdish Sorani diacritics (`ێ`, `ۆ`, `ڕ`, `ڵ`, `ە`), producing floating chevrons or font fallback glitches. Always bind `[lang="ku"]` to **Vazirmatn** for authentic, native Kurdish rendering.

```html
<!-- In index.html <head> -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Vazirmatn:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
```

```css
/* In styles.css */
[dir="rtl"] { font-family: var(--font-ar); }
[lang="ku"], [lang="ku"] body, [lang="ku"] button, [lang="ku"] input, [lang="ku"] select, [lang="ku"] textarea {
  font-family: var(--font-ku) !important;
}
```

### B. Zero-Flicker Synchronous Pre-Render Script
Place this script in `<head>` immediately after `<meta charset>`:
```html
<script>
  (function() {
    try {
      var savedLang = localStorage.getItem('site_lang') || 'en';
      if (savedLang === 'ar' || savedLang === 'ku') {
        document.documentElement.lang = savedLang;
        document.documentElement.dir = 'rtl';
      } else {
        document.documentElement.lang = 'en';
        document.documentElement.dir = 'ltr';
      }
      var savedTheme = localStorage.getItem('site_theme');
      if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
      } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.setAttribute('data-theme', 'dark');
      }
    } catch (e) {}
  })();
</script>
```

### C. Language Switcher UI
- **Desktop**: Dropdown in the top utility bar (`[کوردی | العربية | English]`).
- **Mobile**: Segmented 3-button control inside the mobile hamburger drawer.

---

## 4. Bidirectional (RTL / BiDi) Strict Rules

### A. Phone Number Inversion Bug & Universal Fix
> [!WARNING]
> In RTL mode, browser BiDi algorithms reverse numbers containing spaces, dashes, or plus signs (e.g., `0772 891 1733` flips into `1733 891 0772`, and `(+964 772 891 1733)` turns into `(1733 891 772 964+)`).

**Universal Fix**: Always wrap phone numbers and handles in `<bdi dir="ltr">` and apply strict CSS isolation:
```html
<!-- HTML -->
<a href="tel:07728911733" class="phone-link" dir="ltr"><bdi>0772 891 1733</bdi></a>
<span class="phone-intl" dir="ltr"><bdi>(+964 772 891 1733)</bdi></span>
```

```css
/* CSS */
a[href^="tel:"], .phone-link, .phone-intl, .direct-phone-num, .phone-num, bdi {
  direction: ltr !important;
  unicode-bidi: isolate !important;
  display: inline-block;
  white-space: nowrap;
}
```

### B. Social Media SVG Icons
> [!WARNING]
> Do NOT use stroke-based `<rect>` SVGs with `fill="currentColor"` for Instagram or Facebook. When filled, the outer bounding rectangle renders as a solid opaque box. Always use official single-path compound SVG vectors with built-in counter cutouts.

---

## 5. Dark Mode & Theme Engine

1. **Tokens**: Tailored palette with deep dark blues (`#070d1a`, `#0d1830`, `#182847`) instead of generic washed-out blacks.
2. **Gold/Star Badges in Dark Mode**:
   - Fix contrast: `background: rgba(245, 158, 11, 0.22); color: #fbbf24;`
3. **Dynamic Theme Labels per Language**:
   - English: `Light` / `Dark`
   - Arabic: `فاتح` / `داكن`
   - Kurdish: `ڕۆشن` / `تاریک`

---

## 6. High-Impact Interactive Components

### 1. Interactive Before & After Smile Slider
- Pure vanilla JS drag-and-touch slider.
- Both "before" and "after" images are pinned to 100% width with synchronized aspect ratios; the foreground image is clipped using `width: X%` via the divider handle.
- Responsive on mouse drag, touch drag, and direct clicks.

### 2. Interactive Treatment Finder
- 4 prominent priority cards (e.g., Hollywood Smile, Implants, Orthodontics, Pain Relief).
- Clicking any card dynamically renders clinical details, procedure duration, warranty, and updates the WhatsApp CTA button with a personalized pre-filled message.

### 3. Live Clinic Working Hours
- Evaluates the local timezone (e.g., `Asia/Baghdad` / UTC+3).
- Evaluates business schedule (e.g., Saturday to Wednesday: 2:00 PM – 8:00 PM).
- Displays live status:
  - Green pulsing dot: "Open Now (Until 8:00 PM)"
  - Red dot: "Closed (Opens Today at 2:00 PM)" or "Closed (Opens Sat at 2:00 PM)"
- Localized dynamically in English, Arabic, and Kurdish.

### 4. Background Google Maps Lazy Loading
- **Problem**: Google Maps iframes require 500ms+ and 1.5MB+ of network resources, blocking initial page paint.
- **Solution**:
  - The iframe holds `data-src` instead of `src`.
  - A skeleton placeholder displays immediately.
  - An `IntersectionObserver` coupled with `requestIdleCallback` loads the map in the background after the hero section is already interactive.

### 5. Instant WhatsApp Booking Generator
- Validates patient name, phone, selected day, service, and time slot.
- Generates a structured WhatsApp text string:
  ```text
  Clinic Appointment Request:
  Patient Name: Ahmed Ali
  Phone: 0772 891 1733
  Treatment: Hollywood Smile
  Preferred Day: 2026-10-26
  Time Window: 4:00 PM - 6:00 PM
  ```
- Launches WhatsApp directly via `https://wa.me/[PHONE]?text=[ENCODED_URI]`.

---

## 7. Mobile UX Rules & Overflow Prevention

1. **Top Bar on Mobile (`< 680px`)**:
   - Hide location text and divider (`.top-bar-location`, `.top-bar-divider`).
   - Hide secondary phone link (covered by bottom bar).
   - Display a single clean row: Status pill on left, Theme + Language on right.
2. **Navbar Header on Mobile (`< 991px`)**:
   - **Hide desktop CTA button**: `.nav-cta-group .btn-primary { display: none !important; }`.
   - Prevents header overflow (`Book Appo` cut-off).
   - Keeps brand logo on left and hamburger button (☰) visible on right.
3. **Sticky Bottom Mobile Bar**:
   - Fixed 4-button quick action bar: `Call`, `WhatsApp`, `Book`, `Maps`.
   - **Clearance Padding**: Always set `body { padding-bottom: calc(88px + env(safe-area-inset-bottom)); }` so sticky bars never obscure form buttons.

---

## 8. Client Business Model & Pricing

| Service Provided | Implementation Tool | Real Cost | Client Retainer | Net Profit |
| :--- | :--- | :--- | :--- | :--- |
| **Domain Registration** | Porkbun / Namecheap | ~$10 – $12/yr | Included in retainer | High margin |
| **High-Speed CDN Hosting** | Cloudflare Pages / GitHub Pages | **$0.00** | Included in retainer | 100% profit |
| **Automated SSL Security** | Cloudflare / Let's Encrypt | **$0.00** | Included in retainer | 100% profit |
| **Uptime Monitoring** | UptimeRobot (Free 50 monitors) | **$0.00** | Included in retainer | 100% profit |
| **Minor Content Updates** | Git push via VS Code | **$0.00** | 2–4 updates/year | Retainer value |
| **Total Annual Package** | Fully Managed Website Care | **~$12/yr** | **$120 – $180/yr** | **+$108 to +$168/yr per client** |

---

## 9. Step-by-Step AI Agent Execution Workflow

When starting a project for a new client in a new conversation:

1. **Phase 1: Information Gathering**
   - Collect clinic/business name, location, working hours, phone number, WhatsApp, and primary services.
2. **Phase 2: HTML Skeleton & Trilingual Dictionary**
   - Create `index.html` with trilingual metadata, Google Fonts, zero-flicker pre-render script, and `data-i18n` tags on all text elements.
3. **Phase 3: Design System & Styling (`styles.css`)**
   - Set up CSS custom properties (colors, typography, spacing, shadows).
   - Implement dark mode overrides and RTL font/alignment rules (`[dir="rtl"]` and `[lang="ku"]`).
4. **Phase 4: Component Logic (`script.js`)**
   - Build translation dictionary for `en`, `ar`, and `ku`.
   - Implement language switcher, theme switcher, live working hours calculator, before/after slider, and WhatsApp booking builder.
5. **Phase 5: Mobile Hardening & BiDi Verification**
   - Test screen widths (`375px`, `768px`, `1024px`, `1440px`).
   - Verify phone numbers wrap with `<bdi dir="ltr">`.
   - Ensure sticky bottom bar does not block form submit buttons.
6. **Phase 6: GitHub Pages Deployment**
   - Initialize git repo, commit files, push to GitHub, and enable GitHub Pages (Deploy from branch `main` / `root`).

---

## 10. Copy-Paste Master Prompt for New Conversations

Copy and paste this prompt to start a new client website with any AI agent:

```text
I want to build a high-converting, luxury website for [CLIENT NAME / BUSINESS TYPE] in [CITY, COUNTRY].

Please follow the exact architecture, standards, and lessons learned from the Aston Dental Clinic master blueprint:

1. Tech Stack:
   - Pure Vanilla HTML5, CSS3 with design tokens, and modular ES6+ JavaScript.
   - Zero build step, zero npm bloat, 100/100 Lighthouse performance.

2. Trilingual Localization Engine:
   - English (LTR, font: 'Plus Jakarta Sans')
   - Arabic (RTL, font: 'Cairo')
   - Kurdish Sorani (RTL, font: 'Vazirmatn' to fix all Kurdish diacritic/chevron rendering bugs)
   - Zero-flicker pre-render script in <head> to hydrate language and dark/light theme before DOM paint.

3. RTL & Bidirectional (BiDi) Integrity:
   - Strict phone number isolation: wrap all phone numbers in <span dir="ltr"><bdi>...</bdi></span> and apply CSS 'unicode-bidi: isolate !important;' so numbers never invert in Arabic/Kurdish.
   - Use official single-path compound SVG vectors for Instagram/Facebook to prevent solid filled box glitches.

4. High-Impact Interactive Components:
   - Interactive Before & After comparison slider (touch & mouse draggable).
   - Interactive Treatment Finder with customized WhatsApp pre-filled inquiries.
   - Live working hours indicator with real-time open/closed calculations based on local timezone.
   - Instant WhatsApp appointment booking generator with formatted message output.
   - Background lazy-loading Google Maps iframe with skeleton placeholder.

5. Mobile-First UX:
   - Single-row compact top bar on mobile (<680px).
   - Header navigation CTA hidden on mobile (<991px) to prevent button overflow over hamburger menu.
   - Fixed 4-action bottom bar (Call, WhatsApp, Book, Map) with safe-area padding on body to prevent form overlap.

6. Deployment:
   - Clean, production-ready code ready for immediate deployment on GitHub Pages or Cloudflare Pages.
```
