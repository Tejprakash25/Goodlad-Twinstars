
/* =========================================================
   GOODLAD TWINSTARS
   Website interactions | Neumorphism-compatible
   ========================================================= */

"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  const header = document.querySelector("header");
  const navLinks = [...document.querySelectorAll('nav a[href^="#"]')];
  const internalLinks = [
    ...document.querySelectorAll('a[href^="#"]')
  ];

  /* ---------------------------------------------------------
     1. Smooth, accessible internal navigation
     --------------------------------------------------------- */

  internalLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("href");

      if (!targetId || targetId === "#") return;

      const target = document.querySelector(targetId);
      if (!target) return;

      event.preventDefault();

      target.scrollIntoView({
        behavior: prefersReducedMotion ? "auto" : "smooth",
        block: "start"
      });

      if (window.history.replaceState) {
        window.history.replaceState(null, "", targetId);
      }
    });
  });

  /* ---------------------------------------------------------
     2. Scroll-reveal animations
     --------------------------------------------------------- */

  const revealElements = [
    ...document.querySelectorAll(
      ".hero > *, .trust, .section-head, .card, .approach, footer"
    )
  ];

  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    revealElements.forEach((element) => {
      element.style.opacity = "1";
      element.style.transform = "none";
    });
  } else {
    revealElements.forEach((element) => {
      element.style.opacity = "0";
      element.style.transform = "translateY(16px)";
      element.style.transition =
        "opacity 550ms ease, transform 550ms ease";
    });

    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0)";
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -35px 0px"
      }
    );

    revealElements.forEach((element) => {
      revealObserver.observe(element);
    });
  }

  /* ---------------------------------------------------------
     3. Subtle Neumorphism card interactions
     --------------------------------------------------------- */

  document.querySelectorAll(".card, .visual").forEach((element) => {
    element.addEventListener("mouseenter", () => {
      if (prefersReducedMotion) return;

      element.style.transition =
        "transform 220ms ease, box-shadow 220ms ease";
      element.style.transform = "translateY(-3px)";
    });

    element.addEventListener("mouseleave", () => {
      element.style.transform = "translateY(0)";
    });
  });

  /* ---------------------------------------------------------
     4. Active navigation section
     --------------------------------------------------------- */

  const sections = [
    ...document.querySelectorAll("section[id]")
  ];

  if ("IntersectionObserver" in window && navLinks.length) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (a, b) =>
              b.intersectionRatio - a.intersectionRatio
          );

        if (!visibleEntries.length) return;

        const activeId = visibleEntries[0].target.id;

        navLinks.forEach((link) => {
          const isActive =
            link.getAttribute("href") === `#${activeId}`;

          if (isActive) {
            link.setAttribute("aria-current", "location");
          } else {
            link.removeAttribute("aria-current");
          }
        });
      },
      {
        threshold: [0.15, 0.35, 0.6],
        rootMargin: "-15% 0px -55% 0px"
      }
    );

    sections.forEach((section) => {
      sectionObserver.observe(section);
    });
  }

  /* ---------------------------------------------------------
     5. Contact link safety and email fallback
     --------------------------------------------------------- */

  document.querySelectorAll('a[href^="mailto:"]').forEach((link) => {
    link.setAttribute("aria-label", "Contact Goodlad Twinstars by email");
  });

  /* ---------------------------------------------------------
     6. Prevent accidental empty anchor navigation
     --------------------------------------------------------- */

  document.querySelectorAll('a[href="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
    });
  });

  /* ---------------------------------------------------------
     7. Header accessibility
     --------------------------------------------------------- */

  if (header) {
    header.setAttribute("role", "banner");
  }

  /* ---------------------------------------------------------
     8. Footer year stays current
     --------------------------------------------------------- */

  const footer = document.querySelector("footer");

  if (footer) {
    const yearText = footer.querySelector("*");

    if (yearText) {
      footer.innerHTML = footer.innerHTML.replace(
        /©\s*\d{4}/,
        `© ${new Date().getFullYear()}`
      );
    }
  }
});
