# Goodlad Twinstars

A static, production-hardening audit for the Goodlad Twinstars marketing site.

Status
- Current workspace validation: no editor-reported HTML/JS errors were found in the existing files reviewed.
- This patch is intentionally frontend-only. It does not assume any backend, analytics, SMTP, CRM, or API credentials.
- Production readiness requires deployment platform configuration, custom domain setup, HTTPS certificate, and final form/analytics endpoint wiring.

Objectives preserved
- Neumorphism design remains intact
- Existing logo and branding remain intact
- Existing product content remains intact
- Core navigation and CTA structure remain functional

Completed checklist
- Privacy policy page
- Terms page
- Frontend secret audit guidance
- HTTPS/deployment guidance
- Conditional cookie consent
- SEO metadata and social preview tags
- Favicon and manifest support
- Sitemap and robots.txt
- Alt-text-safe image handling
- Performance-minded frontend structure
- Contrast-aware styling
- Responsive layout
- Custom 404 page
- Broken-link-aware internal navigation and document links
- Client-side form validation
- Honeypot spam protection
- Analytics-ready consent gating
- One clear CTA: Request a consultation

Remaining dependencies before production
- Final production domain + SSL certificate
- Custom domain record configuration at your chosen host
- Contact form endpoint or email workflow integration
- Analytics provider setup and consent configuration when enabled
- Final brand review on live environment
- Accessibility and content review across target browsers

Frontend secret audit
This project is a static website and should not contain:
- API keys
- OAuth secrets
- private tokens
- analytics identifiers in source code
- SMTP usernames/passwords
- backend URLs or credentials
- environment-specific secrets

Verified practice in this patch:
- No private credentials or IDs are added
- No production domain URL is invented
- The contact form uses a public Formspark submission endpoint; it contains no secret credential
- Analytics remains disabled until it is explicitly configured and consent-gated

Configuration-dependent items
These values must be set before launch:
- canonical URL in index.html
- final production domain in deployment platform
- Formspark notification, spam-protection, and allowed-domain settings
- analytics provider and ID in script.js via GOODLAD_CONFIG.analyticsId if you enable analytics
- any consent, CRM, or form service credentials outside this repo

Exact setup instructions
1. Choose your static hosting provider
    - Vercel, Netlify, Cloudflare Pages, GitHub Pages, or another static host are suitable.
    - Ensure HTTPS is enabled and the site is served over TLS.

2. Configure the domain
    - Add your production domain in the hosting platform.
    - Point DNS records to the host.
    - Ensure the certificate is provisioned and active.
    - Update the canonical URL in index.html once the live domain is known.

3. Configure the contact form
    - The Formspark endpoint is configured in script.js.
    - Set the Formspark notification recipient to goodladtwinstars@gmail.com.
    - Enable spam protection and add the final production domain to Formspark's allowed domains after deployment.

4. Configure analytics
    - Only enable analytics after your consent policy is finalized.
    - Add the provider script in the production deploy and gate it behind cookie consent.
    - Keep analytics IDs out of source control.

5. Review and publish
    - Ensure all pages load over HTTPS
    - Verify sitemap.xml and robots.txt are served from the root
    - Test the main landing page, privacy page, terms page, 404 page, and contact form flow
    - Confirm all links work on the final domain

Deployment guidance
- Use a static host with automatic HTTPS
- Keep the repo content public or private based on your deployment model
- Do not commit secrets
- Prefer environment variables for any deploy-time configuration
- Leverage a CDN or caching layer only after final testing
- Validate the site on mobile and desktop before go-live

SEO and social preview
- Title, description, Open Graph and Twitter metadata are included
- Favicon uses the existing Goodlad Twinstars SVG brand asset
- Social preview image uses the existing brand PNG asset
- The canonical URL is intentionally left unset in source because the live production domain is not known yet

Cookie consent
- Cookie banner appears on first visit and stores a consent choice in localStorage
- Analytics is not activated until the user accepts
- Decline keeps the site functional without analytics activation

Accessibility notes
- Keyboard focus styling is included
- Sufficient contrast is maintained within the existing neumorphic palette
- Reduced motion is respected
- Form fields use labels, `aria-live`, and validation messaging
- No invasive scripts are used on page load

Performance notes
- Minimal JavaScript loaded
- IntersectionObserver is used only where supported
- CSS is embedded in the page to minimize network requests for this static landing page
- No large extra images are introduced beyond existing brand assets

Files delivered
- LAUNCH_CHECKLIST.md
- index.html
- script.js
- README.md
- privacy.html
- terms.html
- 404.html
- robots.txt
- sitemap.xml
- BrandAssets/GOODLAD_TWINSTARS_logo_white_bg.svg (existing asset retained)
- BrandAssets/GOODLAD_TWINSTARS_logo_white_bg.png (existing asset retained)

Validation
- Existing workspace files: no editor-reported errors found.
- This patch is not a claim of production security; it is a frontend hardening pass that still requires live deployment review and final service configuration.

Recommended final production launch checklist
- verify HTTPS
- verify custom domain
- verify favicon and social preview
- verify sitemap path and robots.txt rules
- verify contact form endpoint is live
- verify consent banner and analytics gating
- verify 404 page and all internal links
- verify mobile responsiveness and contrast
- verify page speed with Lighthouse or equivalent
- verify privacy and terms pages are linked from the footer and where required
