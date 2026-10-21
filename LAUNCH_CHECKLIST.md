# Goodlad Twinstars launch checklist

This checklist is the persistent record of remaining work for the first public company website release. Items should be completed and checked against the live deployment, not only the local files.

## Completed

- [x] Connect the contact form to Formspark endpoint `https://submit-form.com/np4OejJnM`.
- [x] Allow Formspark in the Vercel Content Security Policy.
- [x] Keep the existing client-side validation, honeypot, cooldown, and success/error states.

## Before deployment

- [x] Add the supplied phone, email, and LinkedIn details to the contact section and footer.
- [ ] Confirm Formspark notification emails are sent to `goodladtwinstars@gmail.com`.
- [ ] Configure Formspark spam protection and review the existing honeypot.
- [ ] Update the privacy policy to name Formspark as a form-processing provider and document the relevant data handling.
- [ ] Replace generic legal wording with the company's legal name, jurisdiction, business contact, and retention details.
- [ ] Decide whether to remove the cookie banner while analytics is disabled, or configure consent-gated analytics.

## After the live domain is available

- [ ] Add the live domain to Formspark's allowed domains.
- [ ] Configure the custom domain and verify HTTPS.
- [ ] Set the canonical URL in `index.html`.
- [ ] Replace relative sitemap URLs with absolute live-domain URLs in `sitemap.xml`.
- [ ] Replace the relative sitemap URL with the absolute live-domain URL in `robots.txt`.
- [ ] Update Open Graph and Twitter image URLs to absolute live-domain URLs.
- [ ] Verify the social preview image on LinkedIn and other preview tools.
- [ ] Test one real enquiry from desktop and mobile and confirm the notification arrives.
- [ ] Verify the Formspark submission appears in the dashboard.

## Content and trust improvements

- [ ] Add a short company/contact introduction.
- [ ] Add three clear service or capability descriptions with business outcomes.
- [ ] Add founder/team, industry focus, or other available credibility signals.
- [ ] Add a direct email and LinkedIn link with accessible labels.

## Final live-site QA

- [ ] Test home, privacy, terms, and 404 pages.
- [ ] Check all navigation, footer, phone, email, and LinkedIn links.
- [ ] Test keyboard navigation, focus states, reduced motion, and mobile layout.
- [ ] Run Lighthouse or equivalent performance and accessibility checks.
- [ ] Confirm security headers work on the deployed domain.
- [ ] Create square 192px and 512px app icons, or remove the PWA manifest if it is not needed.
